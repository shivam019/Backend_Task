const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event, context) => {
    try {

        const { month } = event.queryStringParameters || {};

        const monthParam = 2;

        
        if (isNaN(monthParam)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Month parameter is not a number' }),
            };
        }

        // Invoke the statistics Lambda function
        const statisticsParams = {
            FunctionName: 'my-serverless-app-dev-getStatistics', 
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({ month: monthParam })
        };

        const statisticsResponse = await lambda.invoke(statisticsParams).promise();
        const statistics = JSON.parse(statisticsResponse.Payload);

        // Invoke the bar chart Lambda function
        const barChartParams = {
            FunctionName: 'my-serverless-app-dev-getBarChart', 
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({ month: monthParam })
        };
        const barChartResponse = await lambda.invoke(barChartParams).promise();
        const barChart = JSON.parse(barChartResponse.Payload);

        // Invoke the pie chart Lambda function
        const pieChartParams = {
            FunctionName: 'my-serverless-app-dev-getPieChart', 
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({ month: monthParam })
        };
        const pieChartResponse = await lambda.invoke(pieChartParams).promise();
        const pieChart = JSON.parse(pieChartResponse.Payload);

        const combinedData = {
            statistics,
            barChart,
            pieChart
        };

        return {
            statusCode: 200,
            body: JSON.stringify(combinedData),
        };
    } catch (error) {
        console.error('Error while fetching combined data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to fetch combined data' }),
        };
    }
};
