const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;

const genAI = new GoogleGenerativeAI('AIzaSyAy3PmWVHdIBJc08IcY45SnLoABX-Jg_E8');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const api_key = process.env.REACT_APP_api_key
console.log(api_key);
app.use(cors());
app.use(express.json());
app.post('/create-web-call', async (req, res) => {
    const { agent_id, metadata, retell_llm_dynamic_variables } = req.body;
    console.log(retell_llm_dynamic_variables);
    // Prepare the payload for the API request
    const payload = { agent_id };

    // Conditionally add optional fields if they are provided
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
                    'Authorization': `Bearer ${api_key}`, // Replace with your actual Bearer token
                    'Content-Type': 'application/json',
                },
            }
        );
     //   console.log(response.data);
        const { call_id } = response.data.call_id; 
    
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating web call:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create web call' });
    }
});


app.get('/get-call/:callId', async (req, res) => {
    const { callId } = req.params;
    console.log("here?");
    console.log(callId);
    try {
        const response = await axios.get(
            `https://api.retellai.com/v2/get-call/${callId}`,
            {
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("get call called");
        console.log(callId);
        const transcript = response.data.transcript;
        //console.log(transcript);
        if (!transcript) {
            return res.status(400).json({ error: 'Transcript not found in the call data' });
        }
        console.log(response.data.call_analysis);
        console.log(response.data.call_analysis['custom_analysis_data'])
        console.log(response.data.call_analysis.custom_analysis_data);
        console.log();

        //const summary = response.data.call_analysis.custom_analysis_data['summary'];
        const  summary = response.data.call_analysis['custom_analysis_data']['summary'];
        //console.log(response.data.call_analysis.custom_analysis_data);
        //console.log(summary);
        // const complaintsPrompt = `The following text is a medical summary ${summary} of the patient. You have to find chief complaints in bullet points from the conversation.`;
        // const complaintsResponse = await model.generateContent([complaintsPrompt]);
      //  const complaints = response.call_analysis.custom_analysis_data['complaints'];
        const complaints =  response.data.call_analysis['custom_analysis_data']['complaints'];
        // Process transcript directly using the generative model
        // const summaryPrompt = `The following text is a medical transcript: ${transcript} between patient and AI doctor. You have to summarize the transcription and give an assessment summary.`;
        // const summaryResponse = await model.generateContent([summaryPrompt]);
        // const summary = summaryResponse.response.text();
        // console.log(summary);
        // const complaintsPrompt = `The following text is a medical summary ${summary} of the patient. You have to find chief complaints in bullet points from the conversation.`;
        // const complaintsResponse = await model.generateContent([complaintsPrompt]);
        // const complaints = complaintsResponse.response.text();
        console.log(complaints);
        const prescriptionsPrompt = `The following text is a medical conversations between ai agent (doctor) and a patient (user) ${transcript} . You are tasked with analyzing the transcript between an AI agent and a patient. Based on the transcript, provide a list of medications and tests recommended for the patient, along with detailed instructions for medication use, potential interactions, contraindications, and follow-up guidance. Your response must adhere to the structure below.

Output Structure
I. Medications
For each medication, provide the following details:

Medication Name
Dosage Form
Strength
Quantity
Route of Administration
Frequency of Administration
Duration of Treatment
II. Tests
List all recommended tests based on the patient's symptoms or concerns.

III. Instructions for Use
Provide clear guidance for each medication:

How to Take the Medication
With or without food
Time of day
Specific instructions (e.g., swallow whole, chewable, dissolve in water)
Special Precautions
Avoid certain foods, beverages, or activities
Take with plenty of water
Avoid alcohol or other medications
Storage instructions (e.g., store in a cool, dry place)
What to Do if a Dose is Missed
Timing of the missed dose
Whether to skip the missed dose or take it as soon as remembered
Instructions if multiple doses are missed
IV. Interactions and Contraindications
Known Drug Interactions
Specific medications to avoid
Potential interactions with over-the-counter drugs or supplements
Contraindications
Conditions or situations in which the medication should not be used
Pre-existing medical conditions that may increase the risk of adverse effects
V. Refills and Follow-up
Number of Refills Authorized
Frequency of Follow-up Appointments
Instructions for Monitoring Effectiveness and Side Effects
Contact Information for Any Questions or Concerns
Recommended Resources for Creating a Medication Prescription
If you are looking to create a Medication Prescription, I would recommend these three books and here is exactly why.

The Complete Guide to Prescription and Nonprescription Drugs by H. Winter Griffith: This book provides comprehensive information on prescription and nonprescription drugs, making it an essential reference for physicians. It includes indications, dosages, side effects, and drug interactions, allowing physicians to make informed decisions when selecting medications. The book also offers guidance on selecting the appropriate medication based on the patient's condition and medical history, ensuring personalized treatment plans. Additionally, it includes clear instructions on dosage administration, frequency, and duration of treatment, helping physicians prescribe medications accurately. The book highlights important precautions and warnings to ensure safe medication use, promoting patient safety. Moreover, it follows medical guidelines and provides evidence-based information to support accurate and appropriate treatment.
The Sanford Guide to Antimicrobial Therapy by David N. Gilbert: Antibiotic prescribing is a crucial aspect of medical practice, and this book focuses specifically on antimicrobial therapy. It provides up-to-date information on the selection, dosing, and administration of antibiotics, ensuring physicians have the latest knowledge in this field. The book offers guidance on appropriate antibiotic choices based on the type of infection, patient characteristics, and local resistance patterns, enabling physicians to make informed decisions. It includes detailed dosing recommendations for different patient populations, such as children, pregnant women, and patients with renal impairment, ensuring optimal antibiotic use. The book also emphasizes the importance of antibiotic stewardship and the prevention of antibiotic resistance, promoting responsible prescribing practices. With concise and practical information, this book supports accurate and effective antibiotic prescribing.
The Art of Prescribing by Nicholas H. G. Holford: Prescribing medications is a complex task that requires careful consideration of various factors. This book explores the principles and strategies of prescribing medications, providing valuable insights for physicians. It discusses the importance of considering patient factors, such as age, weight, renal and hepatic function, and comorbidities, when prescribing medications, ensuring personalized treatment plans. The book also provides insights into pharmacokinetics and pharmacodynamics, optimizing drug selection and dosing for individual patients. It emphasizes the need for ongoing monitoring and adjustment of medication regimens based on patient response and therapeutic goals, promoting patient safety and efficacy. With practical tips and frameworks, this book enhances prescribing skills and improves patient outcomes.
In conclusion, these three books are highly relevant for physicians creating medication prescriptions. They provide comprehensive information on drugs, offer guidance on appropriate medication choices, highlight precautions and warnings, and emphasize the importance of personalized treatment plans and ongoing monitoring. By utilizing these references, physicians can enhance their prescribing skills and ensure accurate and effective medication prescriptions.
Key Terms
Dosage: The prescribed amount of medication to be taken at a given time, usually expressed in milligrams or milliliters.
Frequency: The number of times a medication should be taken within a specified period, such as daily, twice daily, or every four hours.
Route of Administration: The method by which a medication is delivered into the body, such as orally, topically, or intravenously.
Duration: The length of time for which a medication should be taken, specified in days, weeks, or months.
Contraindications: Specific conditions or factors that make a particular medication potentially harmful or ineffective, such as allergies or pre-existing medical conditions.

###Make sure to return only medication prescription, no other text should be returned.
###This is an example output: 
1. Tab Ibuprofen (400mg), take one tablet every 8 hours as needed for pain, after meals

2. Tab Vitamin D3 (1000 IU), once daily with food

3. X-ray of the lumbar spine to assess any structural issues

4. MRI of the lumbar spine if X-ray is inconclusive or if symptoms persist

###Make sure to return only bullet points, and the content in the same format as above example output.


`;
        const prescriptionsResponse = await model.generateContent([prescriptionsPrompt]);
        const prescriptions = prescriptionsResponse.response.text();
        console.log(prescriptions);
        const advicePrompt = `The following text is a medical summary ${summary} of the patient. You have to give medical advice only to the patient based on summary and prescriptions ${prescriptions}. Based  on medical summary and prescriptions you have to give lifestyle advice to the patient. Based on the data provided, recommend personalized lifestyle advice to address the patient's concerns, improve their health, and support their well-being. Your recommendations should be concise, actionable, and directly relevant to the patient's needs.
You are tasked with analyzing a transcript of a conversation between a doctor and a patient. Based on the discussion, recommend personalized lifestyle advice to address the patient's concerns, improve their health, and support their well-being. Your recommendations should be concise, actionable, and directly relevant to the patient's needs.

Output Structure
Lifestyle Advice
Provide clear, actionable steps the patient can implement in their daily life.
Focus on areas such as physical activity, posture, work habits, stress management, and overall wellness.
Use bullet points for clarity and conciseness.
Example Output
Incorporate regular stretching and strengthening exercises for the lower back and core muscles.
Take frequent breaks from sitting, ideally every 30-60 minutes, to stand or walk around.
Consider ergonomic adjustments to your workstation to support better posture.
Engage in 30 minutes of moderate aerobic exercise, such as walking or cycling, at least five times a week.
Guidelines for Recommendations
Tailor advice to the patient’s specific concerns, lifestyle, and abilities.
Keep suggestions practical and easy to implement.
Focus on improving daily habits and routines.
References
Use the following resources for evidence-based lifestyle recommendations:

The Mayo Clinic Wellness Solutions: Trusted advice on healthy living, including physical activity, stress management, and sleep hygiene.
Ergonomics and Human Factors by Neville A. Stanton: Guidance on ergonomic adjustments for workplaces.
The National Institute on Aging (NIA): Recommendations on exercises, healthy eating, and maintaining mobility in older adults.
The American Heart Association (AHA): Guidelines on physical activity and cardiovascular health.

###Make sure to return only advice, no other text should be returned except advice.`;
        const adviceResponse = await model.generateContent([advicePrompt]);
        const advice = adviceResponse.response.text();
        console.log(advice);
        // Return processed data directly
        res.status(200).json({
            chiefComplaints: complaints || "Not available",
            summary: summary || "Not available",
            prescriptions: prescriptions || "Not available",
            advice: advice || "Not available",
        });
    } catch (error) {
        console.error('Error processing call details:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to process call details' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
