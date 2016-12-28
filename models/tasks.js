'use strict';

const AWS	= require('aws-sdk');
const uuid	= require('uuid/v4');

const dynamo = new AWS.DynamoDB.DocumentClient({
	params: {
		TableName: 'tasks-dev'
	}
});

function createUpdateExpression(body) {
	const updates = [];

	for (const field of Tasks.allowedFields) {
		if (field in body) {
			updates.push(`${field} = :${field}`);
		}
	}

	return `set ${updates.join(', ')}`;
}

module.exports = class Tasks {
	static get allowedFields() { return ['user', 'description', 'priority', 'completed']; }

	static filter(expressionOrColumn, value) {
		let params;

		if (typeof expressionOrColumn === 'string') {
			params = {
				FilterExpression: expressionOrColumn
			};
		} else {
			params = {
				FilterExpression: '#col = :value',
				ExpressionAttributeNames: {
					'#col': expressionOrColumn
				},
				ExpressionAttributeValues: {
					':value': value
				}
			};
		}

		return dynamo.scan(params).promise().then(data => data.Items);
	}

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
		return dynamo.update({
			Key: {
				id: this.id
			},
			UpdateExpression: createUpdateExpression(this.data),
			ExpressionAttributeValues: {
				':user': this.data.user,
				':description': this.data.description,
				':priority': this.data.priority,
				':completed': this.data.completed
			}
		}).promise();
	}

	delete() {
		return dynamo.delete({
			Key: {
				id: this.id
			}
		}).promise();
	}
};
