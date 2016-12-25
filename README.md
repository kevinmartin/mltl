# mltl
ML Serverless Assignment - Task List App

This app uses the [Serverless Framework](https://serverless.com).

Steps made to begin with the framework:

```bash
$ npm install -g serverless
$ cd path/to/mltl
$ serverless create --template aws-nodejs --name tasks --path .
```

## Swagger
I created my own custom Serverless Framework plugin for the app. It is located in the `.serverless_plugins` directory.

As an added benefit, you can run `serverless swag` from the Terminal to see the latest Swagger definition.

```bash
$ serverless swag > swagger.json
```
