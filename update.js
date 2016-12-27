'use strict';

const AWS = require('aws-sdk');

const dynamo    	= new AWS.DynamoDB.DocumentClient();
const allowedFields	= ['user', 'description', 'priority', 'completed'];

function createUpdateExpression(body) {
	const updates = [];

	for (const field of allowedFields) {
		if (field in body) {
			updates.push(`${field} = :${field}`);
		}
	}

	return `set ${updates.join(', ')}`;
}

module.exports.handler = (event, context, cb) => {
	const body		= JSON.parse(event.body);
	const params	= {
		TableName: 'tasks-dev',
		Key: {
			id: event.pathParameters.id
		},
		UpdateExpression: createUpdateExpression(body),
		ExpressionAttributeValues: {
			':user': body.user,
			':description': body.description,
			':priority': body.priority,
			':completed': body.completed
		}
	};

	return dynamo.update(params, error => {
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
