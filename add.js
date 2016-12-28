'use strict';

const Task		= require('./models/tasks.js');
const schema	= require('./utils/schema.js');

module.exports.handler = (event, context, cb) => {
	const body = JSON.parse(event.body);

	if (!schema.isValid(body, schema.Task)) {
		cb(new Error('[400] Bad Request'));
		return;
	}

	const task = new Task(body);

	task.add().then(() => cb(null, {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			id: task.id
		})
	}), error => {
		console.error(error);
		cb(new Error('[500] Internal Server Error'));
	});
};
