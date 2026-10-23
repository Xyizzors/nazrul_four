/** Turbopack/webpack loader (development + NZ_EDIT only): tags the values in data/<page>.json. See tags.js. */
const path = require("node:path");
const { tagData } = require("./tags.js");

module.exports = function tagLoader(source) {
  const page = path.basename(this.resourcePath, ".json");
  return JSON.stringify(tagData(page, JSON.parse(source)));
};
