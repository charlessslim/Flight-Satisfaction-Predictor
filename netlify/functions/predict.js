const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }

    const AZURE_ML_ENDPOINT = process.env.AZURE_ML_ENDPOINT;
    const AZURE_ML_API_KEY = process.env.AZURE_ML_API_KEY;

    if (!AZURE_ML_ENDPOINT || !AZURE_ML_API_KEY) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Azure ML credentials not configured' })
        };
    }

    try {
        const inputData = JSON.parse(event.body);

        // Format data for Azure ML Designer pipeline
        // The pipeline expects 'input1' with column-based format
        const requestBody = {
            "input1": {
                "data": [inputData]
            }
        };

        console.log('Sending to Azure ML:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(AZURE_ML_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AZURE_ML_API_KEY}`,
                'azureml-model-deployment': 'default'
            },
            body: JSON.stringify(requestBody)
        });

        const responseText = await response.text();
        console.log('Azure ML response:', responseText);

        if (!response.ok) {
            throw new Error(`Azure ML API Error: ${response.status} - ${responseText}`);
        }

        const result = JSON.parse(responseText);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: error.message,
                details: error.toString()
            })
        };
    }
};
