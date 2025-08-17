const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8080;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyAy3PmWVHdIBJc08IcY45SnLoABX-Jg_E8');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Middleware to parse JSON bodies
app.use(cors());

app.use(express.json());
const logsDir = path.join(__dirname, 'call_logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}
app.post('/process-call/:callId', async (req, res) => {
    const { callId } = req.params;

    // Construct the path to the saved JSON file
    const fileName = `call_details_${callId}.json`;
    const filePath = path.join(logsDir, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Call details file not found' });
    }

    try {
        // Read the JSON file
        const callData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Extract the transcript
        const transcript = callData.transcript;
        if (!transcript) {
            return res.status(400).json({ error: 'Transcript not found in the call data' });
        }
        const summary = `The following text is a medical transcript: ${transcript} between patient and AI doctor. You have to summarize the transcription and give an assessment summary.`;
        const summary1 = await model.generateContent([summary]);
        const s1 = summary1.response.text();
        const complaints =  `The following text is a medical summary ${s1} of patient. You have to find chief complaints in bullet points from the conversation.`;
        const c2 = await model.generateContent([complaints]);
        const c1 = c2.response.text();
        const prescriptions = `The following text is a medical summary ${s1} of patient. You have to prescribe medicines based on the summary.`;
        const p2 = await model.generateContent([prescriptions]);
        const p1 = p2.response.text();
        const advice = `The followingn test is medical summary ${s1} of patient. You have to give medical advice only to the patient based on summary and prescritons ${p1}.`
        const a2 = await model.generateContent([advice]);
        const a1 = a2.response.text();
        console.log(a1);
        console.log(p1);

        // Parse the Gemini response
        

        // Assuming the response contains structured information for each field
        res.status(200).json({
            chiefComplaints:c1 || "Not available",
            summary: s1 || "Not available",
            prescriptions: p1 || "Not available",
            advice: a1 || "Not available",
        });
    } catch (error) {
        console.error('Error processing call data:', error.message);
        res.status(500).json({ error: 'Failed to process call data' });
    }
});

app.post('/create-web-call', async (req, res) => {
    const { agent_id, metadata, retell_llm_dynamic_variables } = req.body;

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
                    'Authorization': 'Bearer key_d193d28697d9c6f8dbc865024a0b', // Replace with your actual Bearer token
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
    console.log("recievved  callidd");
    try {
        const response = await axios.get(
            `https://api.retellai.com/v2/get-call/${callId}`,
            {
                headers: {
                    'Authorization': 'Bearer key_d193d28697d9c6f8dbc865024a0b',
                    'Content-Type': 'application/json',
                },
            }
        );
        //console.log(response.data);
        // Create a timestamp for the filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `call_details_${callId}.json`;
        
        // Save the response data to a file
        fs.writeFileSync(
            path.join(__dirname, 'call_logs', fileName),
            JSON.stringify(response.data, null, 2)
        );

        console.log(`Call details saved to ${fileName}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting call details:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get call details' });
    }
});

// Create call_logs directory if it doesn't exist



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
