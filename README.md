# mltl
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Build Status](https://travis-ci.org/KevinMartin/mltl.svg?branch=master)](https://travis-ci.org/KevinMartin/mltl)
[![Coverage Status](https://coveralls.io/repos/github/KevinMartin/mltl/badge.svg?branch=master)](https://coveralls.io/github/KevinMartin/mltl?branch=master)
![dependencies](https://david-dm.org/KevinMartin/mltl.svg)

ML Serverless Assignment - Task List App

This app uses the [Serverless Framework](https://serverless.com).

Steps made to begin with the framework:

```bash
$ npm install -g serverless
$ cd path/to/mltl
$ serverless create --template aws-nodejs --name tasks --path .
...
$ serverless deploy --verbose
```

## Usage
```bash
$ git clone git@github.com:KevinMartin/mltl.git
$ cd mltl
$ npm install
$ npm install -g serverless
$ serverless deploy
```

### For production deployments
```bash
$ npm prune --production
$ serverless deploy --stage prod
```

## Tests and Coverage
Tests are done with `mocha` and coverage is reported with `nyc`.

```bash
$ AWS_REGION=us-east-1 MAIL_FROM=[email] npm test
$ AWS_REGION=us-east-1 MAIL_FROM=[email] npm run test-cov
```

The coverage report is found in the `./coverage/` directory after running the command.

## Swagger + API Gateway Extentions
The Swagger + API Gateway Extensions file is located in [swagger.gateway.json](swagger.gateway.json).

## Swagger Plugin
I also created my own custom Serverless Framework plugin for the app which also outputs a valid Swagger definition file. The plugin is located in the `.serverless_plugins` directory.

The Swagger Plugin file is located in [swagger.plugin.json](swagger.plugin.json).

As an added benefit, you can run `serverless swag` from the Terminal to see the latest Swagger definition.

```bash
$ serverless swag > swagger.plugin.json
```
