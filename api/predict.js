const fetch = require('node-fetch');

module.exports = async function (context, req) {
    // Your Azure ML credentials - STORED SECURELY HERE
    const AZURE_ML_ENDPOINT = process.env.AZURE_ML_ENDPOINT;
    const AZURE_ML_API_KEY = process.env.AZURE_ML_API_KEY;

    // Set CORS headers
    context.res = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    try {
        const inputData = req.body;

        // Prepare Azure ML request
        const requestBody = {
            "Inputs": {
                "data": [inputData]
            },
            "GlobalParameters": {}
        };

        // Call Azure ML
        const response = await fetch(AZURE_ML_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AZURE_ML_API_KEY}`,
                'azureml-model-deployment': 'default'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Azure ML API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        // Return the result
        context.res.status = 200;
        context.res.body = result;

    } catch (error) {
        context.log.error('Error:', error);
        context.res.status = 500;
        context.res.body = {
            error: error.message
        };
    }
};
