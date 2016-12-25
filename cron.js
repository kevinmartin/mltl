'use strict';

const AWS       = require('aws-sdk');
const dynamo    = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, cb) => {
	console.log(event, context);

	cb();
};
