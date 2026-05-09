const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { uploadsDir, tempDir } = require("../utils/filePaths");

for (const dir of [uploadsDir, tempDir, path.join(uploadsDir, "signatures"), path.join(uploadsDir, "pdfs")]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const stamp = Date.now();
    const safeName = file.originalname.replace(/[^a-z0-9_.-]/gi, "_");
    cb(null, `${stamp}-${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, WEBP, and PDF files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 4
  }
});

module.exports = upload;
