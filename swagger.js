"use strict";

const fastifyStatic = require("fastify-static");
const yaml = require("js-yaml");
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath();
const fs = require("fs");
const path = require("path");

module.exports = function (fastify, options, done) {
  const swaggerYaml = fs.readFileSync(options.filepath);
  const swaggerObject = yaml.safeLoad(swaggerYaml);
  const swaggerOptions = `{
    url: "json",
    dom_id: "#swagger-ui",
    deepLinking: true
  }`;
  const swaggerIndex = fs.readFileSync(path.join(__dirname, "/swagger.html")).toString().replace("/*swaggerOptions*/", swaggerOptions);
  
  // Document files
  fastify.route({
    url: "/json",
    method: "GET",
    handler: function (request, reply) {
      reply.send(swaggerObject);
    }
  });
  
  fastify.route({
    url: "/yaml",
    method: "GET",
    handler: function (request, reply) {
      reply
        .type("application/x-yaml")
        .send(swaggerYaml);
    }
  });
  
  // Serve swagger UI static routes
  fastify.route({
    url: "/",
    method: "GET",
    handler: (request, reply) => {
      reply.type("text/html").send(swaggerIndex);
    }
  });
  
  fastify.register(fastifyStatic, {
    root: swaggerUiAssetPath
  });
  
  done();
};