'use strict';

const AWS = require('aws-sdk');

const dynamo	= new AWS.DynamoDB.DocumentClient();
const ses		= new AWS.SES();

function sendEmail(user, tasks) {
	return new Promise(resolve => {
		const today	= new Date();
		const list	= tasks
			.sort((taskA, taskB) => taskA.priority - taskB.priority)
			.map(task => `* ${task.description} (Priority ${task.priority})`)
			.join('\r\n');

		ses.sendEmail({
			Source: process.env.MAIL_FROM,
			Destination: { ToAddresses: [user] },
			Message: {
				Subject: {
					Data: `Task List - ${today.getUTCMonth()}/${today.getUTCDay()}/${today.getUTCFullYear()}`
				},
				Body: {
					Text: {
						Data: `Hi!
Your pending tasks:
${list}

Happy Tasking!`
					}
				}
			}
		}, error => {
			if (error) {
				console.error(error);

				// Don't reject, in order to continue the chain.
				// reject(error);
			}

			resolve();
		});
	});
}

module.exports.handler = (event, context, cb) => {
	const params = {
		TableName: 'tasks-dev',
		FilterExpression: 'attribute_not_exists(completed)'
	};

	dynamo.scan(params, (error, data) => {
		if (error) {
			cb(error);
			return;
		}

		const users = data.Items.reduce((obj, task) => {
			if (!obj[task.user]) {
				obj[task.user] = [];
			}

			obj[task.user].push(task);

			return obj;
		}, {});

		Object.keys(users)
			.reduce((promise, user) => {
				const tasks = users[user];
				return promise.then(() => sendEmail(user, tasks));
			}, Promise.resolve())
			.then(cb)
			.catch(cb);
	});
};
