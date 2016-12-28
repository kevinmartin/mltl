'use strict';

const Tasks = require('./models/tasks.js');

module.exports.handler = (event, context, cb) => {
	Tasks.filter('user', event.queryStringParameters.user).then(tasks => cb(null, {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify(tasks)
	}), error => {
		console.error(error);
		cb(new Error('[500] Internal Server Error'));
	});
};
