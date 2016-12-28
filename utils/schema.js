'use strict';

const Validator 	= require('jsonschema').Validator;
const taskSchema	= require('../schema/task.json');
const userSchema	= require('../schema/user.json');
const uuidSchema	= require('../schema/uuid.json');

const schema = new Validator();

schema.addSchema(userSchema, '/#/definitions/User');
schema.addSchema(taskSchema, '/#/definitions/Task');
schema.addSchema(uuidSchema, '/#/definitions/UUID');

module.exports = {
	Task: taskSchema,
	User: userSchema,
	UUID: uuidSchema,
	isValid: (...args) => !schema.validate(...args).errors.length
};
