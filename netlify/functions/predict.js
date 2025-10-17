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

    try {
        const inputData = JSON.parse(event.body);

        const requestBody = {
            "Inputs": {
                "data": [inputData]
            },
            "GlobalParameters": {}
        };

        const response = await fetch(AZURE_ML_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AZURE_ML_API_KEY}`,
                'azureml-model-deployment': 'default'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
