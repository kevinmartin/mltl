'use strict';

const AWS	= require('aws-sdk');
const uuid	= require('uuid/v4');

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, cb) => {
	const body		= JSON.parse(event.body);
	const params	= {
		TableName: 'tasks-dev',
		Item: {
			id: uuid(),
			user: body.user,
			description: body.description,
			priority: body.priority,
			completed: body.completed
		}
	};

	return dynamo.put(params, error => {
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
				id: params.Item.id
			})
		});
	});
};
