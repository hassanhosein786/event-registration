const fs = require("fs/promises");
const path = require("path");
const { createRegistrationPdf } = require("./pdfService");

const getAbsolutePdfPath = (generatedPdf) => {
  if (!generatedPdf) return "";
  return path.join(path.resolve(__dirname, ".."), "public", String(generatedPdf).replace(/^\/+/, ""));
};

const ensureRegistrationPdf = async (registration) => {
  const existingAbsolutePath = getAbsolutePdfPath(registration.generatedPdf);

  if (existingAbsolutePath) {
    try {
      await fs.access(existingAbsolutePath);
      return {
        absolutePath: existingAbsolutePath,
        publicPath: registration.generatedPdf,
        regenerated: false
      };
    } catch (error) {
      void error;
    }
  }

  const pdfResult = await createRegistrationPdf(registration);
  return {
    ...pdfResult,
    regenerated: true
  };
};

module.exports = {
  ensureRegistrationPdf,
  getAbsolutePdfPath
};
