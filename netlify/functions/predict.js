const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Log when function is invoked
    console.log('🚀 Function invoked at:', new Date().toISOString());
    console.log('📍 Request method:', event.httpMethod);
    console.log('🌐 Client IP:', event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown');
    console.log('🖥️ User Agent:', event.headers['user-agent'] || 'unknown');
    
    if (event.httpMethod === 'OPTIONS') {
        console.log('⚙️ Handling OPTIONS preflight request');
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
        console.error('❌ ERROR: Missing Azure ML credentials');
        console.error('   AZURE_ML_ENDPOINT exists:', !!AZURE_ML_ENDPOINT);
        console.error('   AZURE_ML_API_KEY exists:', !!AZURE_ML_API_KEY);
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
        console.log('📥 Received input data:');
        console.log('   👤 Customer Type:', inputData['Customer Type']);
        console.log('   🎂 Age:', inputData['Age']);
        console.log('   🧑 Gender:', inputData['Gender']);
        console.log('   ✈️ Travel Type:', inputData['Type of Travel']);
        console.log('   💺 Class:', inputData['Class']);
        console.log('   📏 Flight Distance:', inputData['Flight Distance'], 'miles');
        console.log('   ⏱️ Departure Delay:', inputData['Departure Delay in Minutes'], 'min');
        console.log('   ⏱️ Arrival Delay:', inputData['Arrival Delay in Minutes'], 'min');
        
        // Format data for Azure ML Designer pipeline
        const requestBody = {
            "Inputs": {
                "input1": [inputData]
            },
            "GlobalParameters": {}
        };

        console.log('📤 Sending to Azure ML...');
        console.log('🔗 Endpoint:', AZURE_ML_ENDPOINT.substring(0, 50) + '...');
        console.log('📦 Request body size:', JSON.stringify(requestBody).length, 'bytes');

        const startTime = Date.now();

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
        console.log('⏱️ Azure ML response time:', duration, 'ms');
        console.log('📊 HTTP Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('📩 Response size:', responseText.length, 'bytes');

        if (!respoconst fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Log when function is invoked
    console.log('🚀 Function invoked at:', new Date().toISOString());
    console.log('📍 Request method:', event.httpMethod);
    console.log('🌐 Request IP:', event.headers['x-forwarded-for'] || 'unknown');
    
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
        console.error('❌ Missing Azure ML credentials');
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
        console.log('📥 Received input data:', JSON.stringify(inputData, null, 2));

        // Prepare Azure ML request
        const requestBody = {
            "Inputs": {
                "input1": [inputData]
            },
            "GlobalParameters": {}
        };

        console.log('📤 Sending to Azure ML:', JSON.stringify(requestBody, null, 2));
        console.log('🔗 Endpoint:', AZURE_ML_ENDPOINT);

        const startTime = Date.now();

        // Call Azure ML
        const response = await fetch(AZURE_ML_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AZURE_ML_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const duration = Date.now() - startTime;
        console.log(`⏱️ Azure ML response time: ${duration}ms`);
        console.log('📊 Response status:', response.status);

        const responseText = await response.text();
        console.log('📩 Azure ML raw response:', responseText);

        if (!response.ok) {
            console.error('❌ Azure ML API Error:', response.status, responseText);
            throw new Error(`Azure ML API Error: ${response.status} - ${responseText}`);
        }

        const result = JSON.parse(responseText);
        console.log('✅ Parsed result:', JSON.stringify(result, null, 2));

        // Log prediction details
        if (result.Results && result.Results.WebServiceOutput0) {
            const prediction = result.Results.WebServiceOutput0[0];
            console.log('🎯 Prediction:', prediction['Scored Labels']);
            console.log('📈 Probability:', prediction['Scored Probabilities']);
        }

        console.log('✅ Request completed successfully');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('❌ Error occurred:', error.message);
        console.error('🔍 Error stack:', error.stack);
        
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
