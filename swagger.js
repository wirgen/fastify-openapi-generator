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
  const swaggerTemplate = options.template || path.join(__dirname, "swagger.html");
  const swaggerIndex = fs.readFileSync(swaggerTemplate).toString().replace("/*swaggerOptions*/", swaggerOptions);
  
  const redocUrl = "../json";
  const redocTemplate = options.redocTemplate || path.join(__dirname, "redoc.html");
  const redocIndex = fs.readFileSync(redocTemplate).toString().replace("/*redocUrl*/", redocUrl);
  
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
        .send(yaml.safeDump(swaggerObject));
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
  
  // Serve redoc static routes
  fastify.route({
    url: "/redoc/",
    method: "GET",
    handler: (request, reply) => {
      reply.type("text/html").send(redocIndex);
    }
  });
  
  fastify.register(fastifyStatic, {
    root: path.dirname(require.resolve("redoc")),
    prefix: "/redoc",
    decorateReply: false
  });
  
  done();
};