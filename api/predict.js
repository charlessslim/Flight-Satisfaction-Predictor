// Vercel serverless function format
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Log when function is invoked
    console.log('Function invoked at:', new Date().toISOString());
    console.log('Request method:', req.method);
    console.log('Client IP:', req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown');
    console.log('User Agent:', req.headers['user-agent'] || 'unknown');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        return res.status(200).end();
    }

    const AZURE_ML_ENDPOINT = process.env.AZURE_ML_ENDPOINT;
    const AZURE_ML_API_KEY = process.env.AZURE_ML_API_KEY;

    if (!AZURE_ML_ENDPOINT || !AZURE_ML_API_KEY) {
        console.error('ERROR: Missing Azure ML credentials');
        console.error('AZURE_ML_ENDPOINT exists:', !!AZURE_ML_ENDPOINT);
        console.error('AZURE_ML_API_KEY exists:', !!AZURE_ML_API_KEY);
        return res.status(500).json({ 
            error: 'Azure ML credentials not configured' 
        });
    }

    try {
        const inputData = req.body;
        console.log('Received input data:');
        console.log('  Customer Type:', inputData['Customer Type']);
        console.log('  Age:', inputData['Age']);
        console.log('  Gender:', inputData['Gender']);
        console.log('  Travel Type:', inputData['Type of Travel']);
        console.log('  Class:', inputData['Class']);
        console.log('  Flight Distance:', inputData['Flight Distance'], 'miles');
        console.log('  Departure Delay:', inputData['Departure Delay in Minutes'], 'min');
        console.log('  Arrival Delay:', inputData['Arrival Delay in Minutes'], 'min');
        
        // Format data for Azure ML Designer pipeline
        const requestBody = {
            "Inputs": {
                "input1": [inputData]
            },
            "GlobalParameters": {}
        };

        console.log('Sending to Azure ML...');
        console.log('Endpoint:', AZURE_ML_ENDPOINT.substring(0, 50) + '...');
        console.log('Request body size:', JSON.stringify(requestBody).length, 'bytes');

        const startTime = Date.now();

        // Dynamic import for node-fetch (Vercel uses ES modules)
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(AZURE_ML_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AZURE_ML_API_KEY}`,
                'azureml-model-deployment': 'default'
            },
            body: JSON.stringify(requestBody)
        });

        const duration = Date.now() - startTime;
        console.log('Azure ML response time:', duration, 'ms');
        console.log('HTTP Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('Response size:', responseText.length, 'bytes');

        if (!response.ok) {
            console.error('Azure ML API Error:', response.status);
            console.error('Error response:', responseText);
            throw new Error(`Azure ML API Error: ${response.status} - ${responseText}`);
        }

        const result = JSON.parse(responseText);
        
        // Extract and log prediction details
        if (result.Results && result.Results.WebServiceOutput0 && result.Results.WebServiceOutput0[0]) {
            const prediction = result.Results.WebServiceOutput0[0];
            console.log('Prediction successful!');
            console.log('Scored Labels:', prediction['Scored Labels']);
            console.log('Probability:', (prediction['Scored Probabilities'] * 100).toFixed(2) + '%');
            console.log('Satisfied probability:', (prediction['Scored Probabilities'] * 100).toFixed(2) + '%');
            console.log('Dissatisfied probability:', ((1 - prediction['Scored Probabilities']) * 100).toFixed(2) + '%');
        } else {
            console.log('Unexpected response format');
        }

        console.log('Request completed successfully');
        console.log('Total execution time:', Date.now() - startTime, 'ms');

        return res.status(200).json(result);

    } catch (error) {
        console.error('ERROR occurred:');
        console.error('Type:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        return res.status(500).json({ 
            error: error.message,
            details: error.toString()
        });
    }
}
