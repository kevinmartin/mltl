'use strict';

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, cb) => {
	const params = {
		TableName: 'tasks-dev',
		FilterExpression: '#user = :user',
		ExpressionAttributeNames: {
			'#user': 'user'
		},
		ExpressionAttributeValues: {
			':user': event.queryStringParameters.user
		}
	};

	return dynamo.scan(params, (error, data) => {
		if (error) {
			console.error(error);
			cb(new Error('[500] Internal Server Error'));
			return;
		}

		cb(null, {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify(data.Items)
		});
	});
};
