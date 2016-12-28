'use strict';

const assert	= require('assert');
const Task		= require('../../models/tasks.js');

describe('models/tasks.js', () => {
	it('should instantiate properly with no data', () => {
		const task = new Task();

		assert(task.data);
		assert(task.data.id);
	});

	it('should instantiate properly with only an id string', () => {
		const task = new Task('test');

		assert(task.data);
		assert.equal(task.data.id, 'test');
	});

	it('should instantiate properly with an object', () => {
		const task = new Task({});

		assert(task.data);
		assert(task.data.id);
	});

	it('should instantiate properly with an object and id', () => {
		const task = new Task({
			id: 'test'
		});

		assert(task.data);
		assert.equal(task.data.id, 'test');
	});

	it('should return an empty list when user has no tasks', () => {
		const promise = Task.filter('user', 'test@test.com');

		return promise.then(tasks => {
			assert.equal(tasks.length, 0);
		});
	});

	it('should return a list when using a filter expression', () => {
		const promise = Task.filter('attribute_not_exists(completed)');

		return promise.then(tasks => {
			assert(tasks);
			assert.equal(Array.isArray(tasks), true);
		});
	});

	it('should succeed in adding a task', () => {
		const task = new Task({
			id: 'test',
			user: 'test@test.com',
			description: 'Test description',
			priority: 5
		});

		return task.add().then(() => Task.filter('user', 'test@test.com')).then(tasks => {
			assert.equal(tasks.length, 1);
			assert.equal(tasks[0].id, 'test');
			assert.equal(tasks[0].description, 'Test description');
			assert.equal(tasks[0].priority, 5);
		});
	});

	it('should succeed in updating a task', () => {
		const task = new Task({
			user: 'test@test.com',
			id: 'test',
			priority: 6
		});

		return task.update().then(() => Task.filter('user', 'test@test.com')).then(tasks => {
			assert.equal(tasks.length, 1);
			assert.equal(tasks[0].id, 'test');
			assert.equal(tasks[0].description, 'Test description');
			assert.equal(tasks[0].priority, 6);
		});
	});

	it('should succeed in deleting a task', () => {
		const task = new Task('test');

		return task.delete().then(() => Task.filter('user', 'test@test.com')).then(tasks => {
			assert.equal(tasks.length, 0);
		});
	});
});
