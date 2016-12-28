'use strict';

const AWS = require('aws-sdk');

const ses = new AWS.SES();

module.exports = class Email {
	static send(email) {
		return ses.sendEmail({
			Source: process.env.MAIL_FROM,
			Destination: { ToAddresses: [email.to] },
			Message: {
				Subject: {
					Data: email.subject
				},
				Body: {
					Text: email.body
				}
			}
		}).promise();
	}
};
