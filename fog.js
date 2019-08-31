"use strict";

module.exports = function (fastify, options, done) {
  options = options || {};
  
  if (typeof options !== "object") {
    throw new TypeError("Options must be an object");
  }
  
  if (!options.hasOwnProperty("controllers")) {
    throw new TypeError("Property 'controllers' is required");
  }
  
  options.routeDocs = options.routeDocs || "/docs";
  options.yaml = options.yaml || "swagger.yaml";
  
  fastify.register(require("./routes"), {
    filepath: options.yaml,
    controllers: options.controllers
  });
  
  fastify.register(require("./swagger"), {
    prefix: options.routeDocs,
    filepath: options.yaml
  });
  
  done();
};