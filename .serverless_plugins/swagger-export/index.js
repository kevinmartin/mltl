'use strict';

const pkg = require('../../package.json');

class SwaggerExport {
	constructor(config) {
		this.commands = {
			swag: {
				description: 'Export a Swagger compliant configuration based on the serverless.yml',
				lifecycleEvents: ['serverless']
			}
		};

		this.hooks = {
			'swag:serverless': () => this.export(config)
		};
	}

	export(config) {
		const swagger = {
			swagger: '2.0',
			info: {
				title: config.service.custom.title || pkg.name,
				description: config.service.custom.description || pkg.description,
				version: pkg.version
			},
			host: 'localhost',
			basePath: `/${config.service.provider.stage}`,
			schemes: ['https'],
			tags: [],
			securityDefinitions: {},
			paths: {},
			definitions: {}
		};

		Object.keys(config.service.functions).forEach(fn => {
			config.service.functions[fn].events
				.filter(event => event.http)
				.forEach(event => this.exportEvent(swagger, fn, event.http));
		});

		if (config.service.custom && config.service.custom.swag) {
			Object.keys(config.service.custom.swag).forEach(key => {
				swagger[key] = config.service.custom.swag[key];
			});
		}

		console.log(JSON.stringify(swagger, null, 2));
	}

	exportEvent(swagger, fn, event) {
		const url		= `/${event.path}`.replace(/^\/\//, '/');
		const endpoint	= {
			tags: [],
			summary: '',
			description: '',
			operationId: `${event.method}-${event.path}`,
			consumes: ['application/json'],
			produces: ['application/json'],
			schemes: ['https'],
			parameters: [],
			responses: {}
		};

		if (!swagger.paths[url]) {
			swagger.paths[url] = {};
		}

		swagger.paths[url][event.method] = endpoint;

		this.exportParameters(endpoint, event);

		if (event.swag) {
			Object.keys(event.swag).forEach(key => {
				endpoint[key] = event.swag[key];
			});
		}
	}

	exportParameters(endpoint, event) {
		if (!event.request || !event.request.parameters) {
			return;
		}

		const params = event.request.parameters;

		Object.keys(params).filter(type => type !== 'body').forEach(type => {
			Object.keys(params[type]).forEach(name => {
				endpoint.parameters.push({
					name,
					in: this.getSwaggerParameterType(type),
					required: params[type][name],
					type: 'string'
				});
			});
		});

		if (params.body) {
			endpoint.parameters.push({
				name: 'body',
				in: 'body',
				required: true,
				schema: {
					$ref: `#/definitions/${params.body}`
				}
			});
		}
	}

	getSwaggerParameterType(type) {
		switch (type) {
			case 'querystrings':
				return 'query';

			case 'headers':
				return 'header';

			case 'paths':
				return 'path';

			default:
				return type;
		}
	}
}

module.exports = SwaggerExport;
