'use strict';

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, cb) => {
	const params = {
		TableName: 'tasks-dev',
		Key: {
			id: event.pathParameters.id
		}
	};

	return dynamo.delete(params, error => {
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
			body: JSON.stringify({
				id: params.Key.id
			})
		});
	});
};
