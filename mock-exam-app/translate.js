import fs from 'fs';
import path from 'path';
import translate from 'translate-google';

const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'mockExams.json');

async function translateExams() {
    console.log("Loading mockExams.json...");
    const exams = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    
    for (let i = 0; i < exams.length; i++) {
        const exam = exams[i];
        console.log(`\nTranslating Set ${exam.setId}... (${exam.questions.length} questions)`);
        
        // Chunk questions to avoid payload too large / rate limits
        const chunkSize = 5; 
        for (let j = 0; j < exam.questions.length; j += chunkSize) {
            console.log(`  Progress: ${j} / ${exam.questions.length}`);
            const chunk = exam.questions.slice(j, j + chunkSize);
            
            // Build an object to translate at once
            const toTranslate = {};
            chunk.forEach(q => {
               toTranslate[`q_${q.id}`] = q.question.en;
               toTranslate[`exp_${q.id}`] = q.explanation.en;
               q.options.forEach((opt, idx) => {
                   toTranslate[`opt_${q.id}_${idx}`] = opt.text.en;
               });
            });

            try {
                const translated = await translate(toTranslate, {to: 'ja'});
                
                // Map back
                chunk.forEach(q => {
                    q.question.ja = translated[`q_${q.id}`];
                    q.explanation.ja = translated[`exp_${q.id}`];
                    q.options.forEach((opt, idx) => {
                        opt.text.ja = translated[`opt_${q.id}_${idx}`];
                    });
                });
            } catch (err) {
                console.error(`  Error translating chunk ${j}:`, err.message);
                // Wait and retry once
                await new Promise(r => setTimeout(r, 5000));
                try {
                    const translated = await translate(toTranslate, {to: 'ja'});
                    chunk.forEach(q => {
                        q.question.ja = translated[`q_${q.id}`];
                        q.explanation.ja = translated[`exp_${q.id}`];
                        q.options.forEach((opt, idx) => {
                            opt.text.ja = translated[`opt_${q.id}_${idx}`];
                        });
                    });
                } catch(err2) {
                    console.error(`  Retry failed! Using placeholders.`);
                }
            }
            
            // Sleep to avoid rate limits
            await new Promise(r => setTimeout(r, 1500));
        }
        
        // Save after each set
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(exams, null, 2), 'utf-8');
        console.log(`Set ${exam.setId} translated and saved.`);
    }
    
    console.log("\nAll translations complete!");
}

translateExams().catch(console.error);
