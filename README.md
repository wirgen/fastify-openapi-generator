# fastify-openapi-generator

Fastify routes generator. Used [Swagger](https://swagger.io/) YAML specification. Supports schemas for describe models and validate response. 

Supports Fastify versions `>=2.0.0`.

<a name="install"></a>
## Install
```shell script
npm i fastify-openapi-generator --save
```

<a name="usage"></a>
## Usage
Add it to your project with `register` and pass it some basic options, then call the `swagger` api and you are done!

```JS
const fastify = require("fastify")();

fastify.register(require("fastify-openapi-generator"), {
  controllers: require("./controllers"),
  routeDocs: "/docs",
  yaml: "swagger.yaml"
});
```

<a name="api"></a>
## API

<a name="register.options"></a>
### register options
<a name="controllers"></a>
#### controllers
Array of handlers for fastify routes. Describe handlers in `operationId` with pattern `<controller>.<function>`. For example, you can collect all controllers from folder used `fs`:
```js
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

let controllers = {};
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf(".") !== 0) && file !== basename && (file.slice(-3) === ".js");
  })
  .forEach(file => {
    controllers[file.slice(0, -3)] = require(path.join(__dirname, file));
  });

module.exports = controllers;
```
<a name="routedocs"></a>
#### routeDocs
Prefix for swagger documentation. By default, `/docs`. Also, you can get JSON (`/docs/json`) and YAML (`/docs/yaml`) files.
<a name="yaml"></a>
#### yaml
Path for swagger specification file in YAML. By default, `swagger.yaml`.

<a name="security"></a>
### Security
Global security definitions and route level security provide documentation only. It does not implement authentication nor route security for you. Once your authentication is implemented, along with your defined security, users will be able to successfully authenticate and interact with your API using the user interfaces of the documentation.

<a name="license"></a>
## License

Licensed under [Apache 2.0](./LICENSE).