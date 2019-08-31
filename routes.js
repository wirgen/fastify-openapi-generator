"use strict";

const yaml = require("js-yaml");
const fs = require("fs");

module.exports = function (fastify, options, done) {
  const swaggerObject = yaml.safeLoad(fs.readFileSync(options.filepath));
  
  // Add schemas
  for (let schema in swaggerObject.components.schemas) {
    if (swaggerObject.components.schemas.hasOwnProperty(schema)) {
      fastify.addSchema({
        $id: schema,
        ...swaggerObject.components.schemas[schema]
      });
    }
  }
  
  // Add routes
  for (let path in swaggerObject.paths) {
    if (swaggerObject.paths.hasOwnProperty(path)) {
      for (let method in swaggerObject.paths[path]) {
        if (swaggerObject.paths[path].hasOwnProperty(method)) {
          let responses = {};
          for (let response in swaggerObject.paths[path][method].responses) {
            if (swaggerObject.paths[path][method].responses.hasOwnProperty(response)) {
              responses[response] = swaggerObject.paths[path][method].responses[response].content["application/json"].schema;
            }
          }
          findKey(responses, "$ref");
          const handler = swaggerObject.paths[path][method].operationId.split(".");
          fastify.route({
            method: method.toUpperCase(),
            url: path,
            schema: {
              response: responses
            },
            handler: options.controllers[handler[0]][handler[1]]
          });
        }
      }
    }
  }
  
  done();
};

function findKey (obj, key) {
  if (obj.hasOwnProperty(key)) {
    let value = obj[key].split("/");
    obj[key] = value[value.length - 1] + "#";
  } else {
    for (let property in obj) {
      if (obj.hasOwnProperty(property) && typeof obj[property] == "object") {
        findKey(obj[property], key);
      }
    }
  }
}