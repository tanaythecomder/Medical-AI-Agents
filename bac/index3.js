const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;

// const genAI = new GoogleGenerativeAI('AIzaSyAy3PmWVHdIBJc08IcY45SnLoABX-Jg_E8');
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const api_key ='key_a234ae6b004b0270df202361d4e3';

app.use(cors({
    origin: '*', // Replace '*' with a specific origin if needed
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

app.post('/create-web-call', async (req, res) => {
    const { agent_id, metadata, retell_llm_dynamic_variables } = req.body;
    console.log(retell_llm_dynamic_variables);
    const payload = { agent_id };

    if (metadata) {
        payload.metadata = metadata;
    }

    if (retell_llm_dynamic_variables) {
        payload.retell_llm_dynamic_variables = retell_llm_dynamic_variables;
    }

    try {
        const response = await axios.post(
            'https://api.retellai.com/v2/create-web-call',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const { call_id } = response.data.call_id; 
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating web call:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create web call' });
    }
});

// app.get('/get-call/:callId', async (req, res) => {
//     const { callId } = req.params;
//     console.log("Processing call ID:", callId);
    
//     try {
//         const response = await axios.get(
//             `https://api.retellai.com/v2/get-call/${callId}`,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${api_key}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         const transcript = response.data.transcript;
//         if (!transcript) {
//             return res.status(400).json({ error: 'Transcript not found in the call data' });
//         }

//         // Get summary and complaints from custom analysis data
//         console.log(response.data.call_analysis);
//         console.log("custom");
//         console.log(response.data.call_analysis.custom_analysis_data);
//         const summary = response.data.call_analysis.custom_analysis_data.summary;
//         console.log(response.data.call_analysis.custom_analysis_data);
//         const complaintsRaw = response.data.call_analysis.custom_analysis_data.complaints;
        
//         // Convert complaints to array and split by ||
//         const complaints = Array.isArray(complaintsRaw) 
//             ? complaintsRaw.flatMap(complaint => complaint.split('||').map(item => item.trim()))
//             : complaintsRaw
//                 ? complaintsRaw.split('||').map(item => item.trim())
//                 : [];

//         console.log('Processed complaints:', complaints);

//         // Generate additional advice using the model
//     //     const dietPrompt = `Based on this medical summary : "${summary}", provide evidence-based dietary recommendations tailored to the patient's condition. Return diet advice based on the patient's condition. You strictly have to provide advice, do not respond with i cant provide advice or anything. Include considerations for comorbidities, nutritional deficiencies, and specific dietary restrictions. Provide recommendations in the following format: Each recommendation separated by '||'. Do not include any other text, numbers, or bullet points.`;

//     // const dietResponse = await model.generateContent([dietPrompt]);
//     // const dietAdviceRaw = dietResponse.response.text();
//     // const dietAdvice = dietAdviceRaw.split('||').map(item => item.trim()).filter(item => item);
//     // console.log(dietAdvice);
//     // const lifestylePrompt = `Based on this medical conversation transcript: "${transcript}", provide evidence-based lifestyle modifications tailored to the patient's condition. Use principles from "The Art of Prescribing" to address factors such as daily routines, comorbidities, and age. Return recommendations in the following format: Each recommendation separated by '||'. Do not include any other text, numbers, or bullet points.`;

//     // const lifestyleResponse = await model.generateContent([lifestylePrompt]);
//     // const lifestyleAdviceRaw = lifestyleResponse.response.text();
//     // const lifestyleAdvice = lifestyleAdviceRaw.split('||').map(item => item.trim()).filter(item => item);
//     // console.log(lifestyleAdvice);
//     // const medicationsPrompt = `Based on this medical conversation transcript: "${transcript}", list all medications prescribed or discussed in the following structured format: Medication Name || Dosage Form || Strength || Quantity || Route of Administration || Frequency of Administration || Duration of Treatment. Use references from "The Complete Guide to Prescription and Nonprescription Drugs" and "The Sanford Guide to Antimicrobial Therapy" to ensure the medications include accurate details. Provide the list in the specified format, separated by '||'. Do not include any other text, numbers, or bullet points.`;

//     // const medicationsResponse = await model.generateContent([medicationsPrompt]);
//     // const medicationsRaw = medicationsResponse.response.text();
//     // const medications = medicationsRaw.split('||').map(item => item.trim()).filter(item => item);
//     // console.log(medications);
//     // const testsPrompt = `Based on this medical conversation transcript: "${transcript}", list all recommended or discussed medical tests, screenings, or diagnostics. Use principles from "The Complete Guide to Prescription and Nonprescription Drugs" to ensure relevant tests are identified. Provide the list in the following format: Each test separated by '||'. Do not include any other text, numbers, or bullet points.`;

//     // const testsResponse = await model.generateContent([testsPrompt]);
//     // const testsRaw = testsResponse.response.text();
//     // const tests = testsRaw.split('||').map(item => item.trim()).filter(item => item);
//     // console.log(tests);
//     // const differentialPrompt = `Based on this medical conversation transcript: "${transcript}", use step-by-step deduction to create a comprehensive differential diagnosis and determine the most likely condition. Use reasoning methods like clinical reasoning, analytic reasoning, and Bayesian inference with references from "The Complete Guide to Prescription and Nonprescription Drugs" and "The Art of Prescribing." Provide differential diagnoses in the following format: Each diagnosis and rationale separated by '||'. Do not include any other text, numbers, or bullet points.`;

//     // const differentialResponse = await model.generateContent([differentialPrompt]);
//     // const differentialRaw = differentialResponse.response.text();
//     // const differential_diagnosis = differentialRaw.split('||').map(item => item.trim()).filter(item => item);
//     // console.log(differential_diagnosis);
// //     const dietPrompt = `Based on this detailed medical summary: "${summary}", provide highly specific, evidence-based dietary recommendations that are meticulously tailored to the patient's condition. Consider all aspects of the patient's health, including primary diagnosis, comorbidities, nutritional deficiencies, allergies, and specific dietary restrictions. Use reputable sources such as "Clinical Nutrition in Practice" and "The American Dietetic Association's Complete Food and Nutrition Guide" for recommendations. Provide actionable dietary advice in the following format: Each recommendation separated by '||'. Do not include any other text, disclaimers, numbers, or bullet points.`;

// // const dietResponse = await model.generateContent([dietPrompt]);
// // const dietAdviceRaw = dietResponse.response.text();
// // const dietAdvice = dietAdviceRaw.split('||').map(item => item.trim()).filter(item => item);
// // // console.log(dietAdvice);

// // const lifestylePrompt = `Based on this comprehensive medical summary: "${summary}", provide thoroughly detailed, evidence-based lifestyle modifications tailored to the patient's condition. Address aspects such as daily routines, physical activity, sleep hygiene, stress management, and age-appropriate recommendations. Consider principles from "The Art of Prescribing" and "The Lifestyle Medicine Handbook" to ensure recommendations are practical, actionable, and rooted in evidence. Return all recommendations in the following format: Each recommendation separated by '||'. Do not include any other text, numbers, or bullet points.`;

// // const lifestyleResponse = await model.generateContent([lifestylePrompt]);
// // const lifestyleAdviceRaw = lifestyleResponse.response.text();
// // const lifestyleAdvice = lifestyleAdviceRaw.split('||').map(item => item.trim()).filter(item => item);
// // // console.log(lifestyleAdvice);

// // const medicationsPrompt = `Based on this detailed medical summary: "${summary}", create a complete and structured list of medications that were prescribed or discussed. Include all relevant details, ensuring accuracy and precision. Use references from "The Complete Guide to Prescription and Nonprescription Drugs" and "The Sanford Guide to Antimicrobial Therapy" to verify medication information. Provide the list in the following structured format, with each field separated by '||': Medication Name || Dosage Form || Strength || Quantity || Route of Administration || Frequency of Administration || Duration of Treatment. Do not include any other text, disclaimers, numbers, or bullet points.`;

// // const medicationsResponse = await model.generateContent([medicationsPrompt]);
// // const medicationsRaw = medicationsResponse.response.text();
// // const medications = medicationsRaw.split('||').map(item => item.trim()).filter(item => item);
// // // console.log(medications);

// // const testsPrompt = `Based on this detailed medical summary: "${summary}", identify and list all recommended or discussed medical tests, screenings, or diagnostics. Ensure the tests are relevant to the patient's condition and comorbidities. Use authoritative references like "The Complete Guide to Prescription and Nonprescription Drugs" to provide accurate and comprehensive suggestions. Provide the list in the following format: Each test separated by '||'. Do not include any other text, disclaimers, numbers, or bullet points.`;

// // const testsResponse = await model.generateContent([testsPrompt]);
// // const testsRaw = testsResponse.response.text();
// // const tests = testsRaw.split('||').map(item => item.trim()).filter(item => item);
// // // console.log(tests);

// // const differentialPrompt = `Based on this detailed medical summary: "${summary}", generate a step-by-step, evidence-based differential diagnosis. Use advanced reasoning methods such as clinical reasoning, analytic reasoning, and Bayesian inference. Leverage resources like "The Complete Guide to Prescription and Nonprescription Drugs" and "The Art of Prescribing" to ensure accuracy. Include detailed rationales for each diagnosis. Provide the differential diagnoses and rationale in the following format: Each diagnosis and its rationale separated by '||'. Do not include any other text, disclaimers, numbers, or bullet points.`;

// // const differentialResponse = await model.generateContent([differentialPrompt]);
// // const differentialRaw = differentialResponse.response.text();
// // const differential_diagnosis = differentialRaw.split('||').map(item => item.trim()).filter(item => item);
// // console.log(differentialDiagnosis);
//         const dietAdviceRaw = response.data.call_analysis.custom_analysis_data.diet;
// const dietAdvice = Array.isArray(dietAdviceRaw) 
//     ? dietAdviceRaw.flatMap(advice => advice.split('||').map(item => item.trim()))
//     : dietAdviceRaw
//         ? dietAdviceRaw.split('||').map(item => item.trim())
//         : [];
// console.log('Processed diet advice:', dietAdvice);

// // Process lifestyle advice
// const lifestyleAdviceRaw = response.data.call_analysis.custom_analysis_data.life;
// const lifestyleAdvice = Array.isArray(lifestyleAdviceRaw) 
//     ? lifestyleAdviceRaw.flatMap(advice => advice.split('||').map(item => item.trim()))
//     : lifestyleAdviceRaw
//         ? lifestyleAdviceRaw.split('||').map(item => item.trim())
//         : [];
// console.log('Processed lifestyle advice:', lifestyleAdvice);

// // Process medications
// const medicationsRaw = response.data.call_analysis.custom_analysis_data.medications;
// const medications = Array.isArray(medicationsRaw) 
//     ? medicationsRaw.flatMap(medication => medication.split('||').map(item => item.trim()))
//     : medicationsRaw
//         ? medicationsRaw.split('||').map(item => item.trim())
//         : [];
// console.log('Processed medications:', medications);

// // Process tests
// const testsRaw = response.data.call_analysis.custom_analysis_data.tests;
// const tests = Array.isArray(testsRaw) 
//     ? testsRaw.flatMap(test => test.split('||').map(item => item.trim()))
//     : testsRaw
//         ? testsRaw.split('||').map(item => item.trim())
//         : [];
// console.log('Processed tests:', tests);

// // Process differential diagnosis
// const differentialRaw = response.data.call_analysis.custom_analysis_data.diag;
// const differential_diagnosis = Array.isArray(differentialRaw) 
//     ? differentialRaw.flatMap(diagnosis => diagnosis.split('||').map(item => item.trim()))
//     : differentialRaw
//         ? differentialRaw.split('||').map(item => item.trim())
//         : [];


//     res.json({
//             summary,
//             complaints,
//             dietAdvice,
//             lifestyleAdvice,
//             medications,
//             tests,
//            differential_diagnosis
//         });

//     } catch (error) {
//         console.error('Error fetching call data:', error.response?.data || error.message);
//         res.status(500).json({ error: 'Failed to fetch call data' });
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
