'use strict';

const Email = require('../../models/email.js');

describe('models/email.js', () => {
	it('should send an email successfully', () => Email.send({
		to: 'success@simulator.amazonses.com',
		subject: 'Test Subject',
		body: 'Test Body'
	}));
});
