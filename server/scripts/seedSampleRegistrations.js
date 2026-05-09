const fs = require("fs/promises");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const connectDB = require("../config/db");
const Registration = require("../models/Registration");
const sample = require("../data/sampleRegistrations.json");
const { signaturesDir, pdfsDir } = require("../utils/filePaths");

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2V0S8AAAAASUVORK5CYII=",
  "base64"
);

const ensureDemoFiles = async () => {
  await fs.mkdir(signaturesDir, { recursive: true });
  await fs.mkdir(pdfsDir, { recursive: true });

  const signaturePath = path.join(signaturesDir, "sample-signature.png");
  const pdfPath = path.join(pdfsDir, "sample-registration.pdf");

  await fs.writeFile(signaturePath, transparentPng);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText("Sample Registration Preview", {
    x: 60,
    y: 760,
    size: 22,
    font,
    color: rgb(0.1, 0.2, 0.45)
  });
  page.drawText("This is a demo PDF created by the sample data seeder.", {
    x: 60,
    y: 720,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0.2, 0.2, 0.2)
  });
  const bytes = await pdfDoc.save();
  await fs.writeFile(pdfPath, bytes);
};

const run = async () => {
  await connectDB();
  await ensureDemoFiles();

  const docs = sample.map((item) => ({
    ...item,
    signatureImage: item.signatureImage,
    generatedPdf: item.generatedPdf
  }));

  await Registration.deleteMany({});
  await Registration.insertMany(docs);
  console.log(`Seeded ${docs.length} sample registrations`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
