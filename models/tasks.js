'use strict';

const AWS	= require('aws-sdk');
const uuid	= require('uuid/v4');

const allowedFields	= ['user', 'description', 'priority', 'completed'];
const dynamo		= new AWS.DynamoDB.DocumentClient({
	params: {
		TableName: process.env.TABLE_NAME
	}
});

function createUpdateExpression(body, params) {
	params.ExpressionAttributeNames		= {};
	params.ExpressionAttributeValues	= {};

	const updates = [];

	for (const field of allowedFields) {
		if (field in body) {
			updates.push(`#${field}Col = :${field}Value`);

			params.ExpressionAttributeNames[`#${field}Col`]		= field;
			params.ExpressionAttributeValues[`:${field}Value`]	= body[field];
		}
	}

	params.UpdateExpression = `set ${updates.join(', ')}`;

	return params;
}

module.exports = class Tasks {
	constructor(idOrData) {
		if (typeof idOrData === 'string') {
			this.data = {
				id: idOrData
			};
		} else if (idOrData && typeof idOrData === 'object') {
			this.data = idOrData;
		} else {
			this.data = {};
		}

		if (!this.data.id) {
			this.data.id = uuid();
		}
	}

	static filter(expressionOrColumn, value) {
		let params;

		if (value) {
			params = {
				FilterExpression: '#col = :value',
				ExpressionAttributeNames: {
					'#col': expressionOrColumn
				},
				ExpressionAttributeValues: {
					':value': value
				}
			};
		} else {
			params = {
				FilterExpression: expressionOrColumn
			};
		}

		return dynamo.scan(params).promise().then(data => data.Items);
	}

	get id() { return this.data.id; }

	add() {
		return dynamo.put({
			Item: {
				id: this.id,
				user: this.data.user,
				description: this.data.description,
				priority: this.data.priority,
				completed: this.data.completed
			}
		}).promise();
	}

	update() {
		return dynamo.update(createUpdateExpression(this.data, {
			Key: {
				id: this.id
			}
		})).promise();
	}

	delete() {
		return dynamo.delete({
			Key: {
				id: this.id
			}
		}).promise();
	}
};
