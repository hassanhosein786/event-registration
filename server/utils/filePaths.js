const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const uploadsDir = path.join(projectRoot, "public", "uploads");
const signaturesDir = path.join(uploadsDir, "signatures");
const pdfsDir = path.join(uploadsDir, "pdfs");
const tempDir = path.join(uploadsDir, "temp");

const toPublicPath = (absolutePath) => {
  const normalized = absolutePath.replace(/\\/g, "/");
  const idx = normalized.indexOf("/public/");
  if (idx === -1) return normalized;
  return normalized.slice(idx + "/public".length);
};

module.exports = {
  projectRoot,
  uploadsDir,
  signaturesDir,
  pdfsDir,
  tempDir,
  toPublicPath
};
