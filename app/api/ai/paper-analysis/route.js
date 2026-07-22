import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { analyzePaper } from '../../../../lib/ai/extractor';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const paper_id = searchParams.get('paper_id');

  if (!paper_id) {
    return NextResponse.json({ error: 'Missing paper_id' }, { status: 400 });
  }

  try {
    // 1. Check if we already have the intelligence cached
    const { data: existingIntel, error: intelError } = await supabase
      .from('paper_intelligence')
      .select('*')
      .eq('paper_id', paper_id)
      .single();

    if (existingIntel && !intelError) {
      // Fetch associated questions
      const { data: questions } = await supabase
        .from('paper_questions')
        .select('*')
        .eq('paper_id', paper_id)
        .order('section', { ascending: true })
        .order('marks', { ascending: true }); // A basic ordering

      return NextResponse.json({
        cached: true,
        intelligence: existingIntel,
        questions: questions || []
      });
    }

    // 2. Not cached. In a full production app, we would download the PDF and run OCR.
    // For this Idea2Impact Hackathon demo (SAGEMMC BCA Sem 1 CASC-02T), we provide the 
    // extracted OCR text representing the J-2206 paper if it matches the specific paper ID.
    // The specific paper ID seeded for J-2206 is: '47a08056-e018-4266-baeb-7003becb1c72'
    // For other papers, we would normally use pdf-parse.

    const { data: paperData } = await supabase
      .from('papers')
      .select('subject_name, subject_code')
      .eq('id', paper_id)
      .single();

    if (!paperData) {
        return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    let extractedText = "Raw text not available for this paper.";
    
    // Check if it's our target demo paper
    if (paper_id === '47a08056-e018-4266-baeb-7003becb1c72') {
        extractedText = `
B.C.A. (First Semester) Examination, Dec.-Jan., 2025-26
COMPUTER FUNDAMENTAL AND MS-OFFICE (CASC-02T)
Section-A
(i) The first generation computers used : Vacuum tubes, Transistors, Integrated circuits, Microprocessors
(ii) Which of the following is not an input device? Keyboard, Mouse, Monitor, Scanner
(iii) Which of the following is a primary memory? Hard Disk, RAM, CD-ROM, Pen Drive
(iv) Which tab in MS Word is used to insert tables and pictures? Home, Insert, Review, View
(v) In MS Excel, the intersection of a row and a column is called: Box, Cell, Block, Sheet
(vi) MS PowerPoint file extension is : .xlsx, .pptx, .docx, .accdb
(vii) What is the full form of ICT? Information and Communication Technology, Internet and Computer Technology
(viii) The shortcut key for Print a document in MS Word is : Ctrl + X, Ctrl + C, Ctrl + P, Ctrl + Z
(ix) Which of the following is a cloud-based platform by Google? GSuite, MS Office, LibreOffice, OpenOffice
(x) What is the purpose of SWAYAM portal? Online shopping, Digital payments, Online education, Cloud storage
Section-B
Q2 (i) What is the difference between System Software and Application Software?
(ii) Explain the use of Header and Footer in MS Word.
(iii) What is Conditional Formatting in MS Excel?
(iv) Write a short note on National Digital Library of India.
(v) Write steps to open MS-PowerPoint, add a new slide and save in a directory.
Descriptive Questions (10 marks each)
Q3. Explain the classification of computers and their generations in detail. OR Draw the block diagram of a computer system and explain each components in brief.
Q4. Describe the steps to create and format a document in MS Word. OR Explain the use of HOME tab in MS Excel.
Q5. Explain the process of creating a PowerPoint presentation with animations and transitions. OR What is MS Access? Explain its features and steps to create a database.
Q6. Discuss the impact of ICT and digital initiatives in higher education. OR Explain different types of functions in MS-Excel with examples.
        `;
    }

    // 3. Call the AI Engine (ensure GEMINI_API_KEY is set in .env)
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }
    
    const aiResult = await analyzePaper(extractedText, paperData.subject_name);

    // 4. Save to Database
    const { data: newIntel, error: insertIntelError } = await supabase
      .from('paper_intelligence')
      .insert({
        paper_id,
        syllabus_mapping: aiResult.paper_intelligence.syllabus_mapping,
        key_topics: aiResult.paper_intelligence.key_topics
      })
      .select()
      .single();

    if (insertIntelError) throw insertIntelError;

    // Prepare questions for batch insert
    const questionsToInsert = aiResult.paper_questions.map(q => ({
      paper_id,
      section: q.section,
      question_type: q.question_type,
      question_text: q.question_text,
      marks: q.marks,
      syllabus_unit: q.syllabus_unit,
      model_answer: q.model_answer
    }));

    const { data: newQuestions, error: insertQuestionsError } = await supabase
      .from('paper_questions')
      .insert(questionsToInsert)
      .select();

    if (insertQuestionsError) throw insertQuestionsError;

    // 5. Return the full intelligence payload
    return NextResponse.json({
      cached: false,
      intelligence: newIntel,
      questions: newQuestions
    });
  } catch (error) {
    console.error('AI Processing Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
