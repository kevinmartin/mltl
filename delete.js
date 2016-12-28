'use strict';

const Task = require('./models/tasks.js');

module.exports.handler = (event, context, cb) => {
	const task = new Task(event.pathParameters.id);

	task.delete().then(() => cb(null, {
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
