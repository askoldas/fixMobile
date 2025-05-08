const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const next = require("next"); // ✅ use require, not import

const app = next({
  dev: false,
  conf: { distDir: ".next" }, // default Next.js build folder
});

const handle = app.getRequestHandler();

exports.nextApp = onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});
