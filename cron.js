'use strict';

const Email	= require('./models/email.js');
const Tasks	= require('./models/tasks.js');

function sendEmail(user, tasks) {
	const today	= new Date();
	const list	= tasks
		.sort((taskA, taskB) => taskA.priority - taskB.priority)
		.map(task => `* ${task.description} (Priority ${task.priority})`)
		.join('\r\n');

	return Email.send({
		to: user,
		subject: `Task List - ${today.getUTCMonth()}/${today.getUTCDay()}/${today.getUTCFullYear()}`,
		body: `Hi!
Your pending tasks:
${list}

Happy Tasking!`
	}).catch(error => console.error(error));
}

module.exports.handler = (event, context, cb) => {
	Tasks.filter('attribute_not_exists(completed)').then(data => {
		const users = data.Items.reduce((obj, task) => {
			if (!obj[task.user]) {
				obj[task.user] = [];
			}

			obj[task.user].push(task);

			return obj;
		}, {});

		return Object.keys(users)
			.reduce((promise, user) => {
				const tasks = users[user];
				return promise.then(() => sendEmail(user, tasks));
			}, Promise.resolve());
	}).then(cb, cb);
};
