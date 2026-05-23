const fs = require("fs/promises");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const sharp = require("sharp");
const { pdfsDir, toPublicPath } = require("../utils/filePaths");

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const loadLogoPng = async () => {
  const logoSvgPath = path.join(path.resolve(__dirname, ".."), "public", "logo.svg");
  const svg = await fs.readFile(logoSvgPath);
  return sharp(svg).resize(320, 320, { fit: "contain" }).png().toBuffer();
};

const addTextLine = (page, font, label, value, x, y, size = 11) => {
  page.drawText(`${label}: ${value || "-"}`, {
    x,
    y,
    size,
    font,
    color: rgb(0.1, 0.1, 0.1)
  });
};

const drawFieldPair = (page, font, left, right, y) => {
  const leftText = `${left[0]}: ${left[1] || "-"}`;
  const rightText = `${right[0]}: ${right[1] || "-"}`;

  page.drawText(leftText, {
    x: 50,
    y,
    size: 11,
    font,
    color: rgb(0.1, 0.1, 0.1)
  });
  page.drawText(rightText, {
    x: 300,
    y,
    size: 11,
    font,
    color: rgb(0.1, 0.1, 0.1)
  });
};

const drawLine = (page, x1, y, x2) => {
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    thickness: 1,
    color: rgb(0.1, 0.1, 0.1)
  });
};

const drawBox = (page, x, y, size = 20) => {
  page.drawRectangle({
    x,
    y,
    width: size,
    height: size,
    borderColor: rgb(0.1, 0.1, 0.1),
    borderWidth: 1,
    color: rgb(1, 1, 1)
  });
};

const drawWrappedField = (page, font, label, value, x, y, maxWidth, size = 9.5, lineHeight = 12) => {
  page.drawText(`${label}:`, {
    x,
    y,
    size,
    font,
    color: rgb(0.1, 0.1, 0.1)
  });

  const lines = wrapText(font, value || "-", maxWidth, size);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - lineHeight * (index + 1),
      size,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });
  });

  return y - lineHeight * (lines.length + 1) - 8;
};

const wrapText = (font, text, maxWidth, size) => {
  const words = String(text || "-").split(/\s+/).filter(Boolean);
  if (!words.length) return ["-"];

  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const testLine = `${currentLine} ${words[i]}`;
    if (font.widthOfTextAtSize(testLine, size) <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }

  lines.push(currentLine);
  return lines;
};

const formatCampType = (value) => {
  if (value === "junior-camp") return "Junior Camp";
  if (value === "stay-in-camp") return "Stay in Camp";
  return value || "-";
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "-";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "-";
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return String(age);
};

const fitFontSize = (font, text, maxWidth, startSize = 20, minSize = 13) => {
  let size = startSize;
  while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 1;
  }
  return size;
};

const createRegistrationPdf = async (registration) => {
  await ensureDir(pdfsDir);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const logoBytes = await loadLogoPng();
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.42);
  page.drawImage(logoImage, {
    x: (595 - logoDims.width) / 2,
    y: 675,
    width: logoDims.width,
    height: logoDims.height
  });

  const title = registration.eventName || "Montrose Muslim Association Islamic Summer Camp 2026";
  page.drawText(title, {
    x: 50,
    y: 610,
    size: fitFontSize(fontBold, title, 495, 20, 13),
    font: fontBold,
    color: rgb(0.08, 0.2, 0.45)
  });

  page.drawText(`Registration ID: ${registration.registrationId}`, {
    x: 50,
    y: 560,
    size: 12,
    font,
    color: rgb(0.25, 0.25, 0.25)
  });

  page.drawText(`Camp Type: ${formatCampType(registration.campType)}`, {
    x: 50,
    y: 525,
    size: 12,
    font,
    color: rgb(0.25, 0.25, 0.25)
  });

  const rowGap = 18;
  let y = 475;
  drawFieldPair(page, font, ["Full Name", registration.fullName], ["School", registration.school], y);
  y -= rowGap;
  drawFieldPair(page, font, ["Class Level", registration.classLevel], ["Date of Birth", registration.dateOfBirth ? new Date(registration.dateOfBirth).toLocaleDateString() : "-"], y);
  y -= rowGap;
  drawFieldPair(page, font, ["Age", registration.age ?? calculateAge(registration.dateOfBirth)], ["Gender", registration.gender], y);
  y -= rowGap;
  drawFieldPair(page, font, ["Phone", registration.phone], ["Email", registration.email], y);
  y -= rowGap;
  y = drawWrappedField(page, font, "Address", registration.address, 50, y, 485);
  y = drawWrappedField(page, font, "Medical Conditions", registration.medicalConditions || "-", 50, y, 485);
  y = drawWrappedField(page, font, "Parent/Guardian Name", registration.parentGuardianContact?.name || "-", 50, y, 485);
  y = drawWrappedField(page, font, "Relationship to Camper", registration.parentGuardianContact?.relationship || "-", 50, y, 485);
  y = drawWrappedField(page, font, "Contact Number", registration.parentGuardianContact?.contactNumber || "-", 50, y, 485);
  drawFieldPair(page, font, ["Consent Accepted", registration.consentAccepted ? "Yes" : "No"], ["Submitted At", new Date(registration.submittedAt || registration.createdAt).toLocaleString()], y);
  const footerTop = Math.max(185, Math.min(215, y - 25));
  const footerBoxY = footerTop - 4;

  page.drawText("Consent to rules and regulations", {
    x: 35,
    y: footerTop,
    size: 12,
    font
  });
  drawBox(page, 220, footerBoxY, 24);

  page.drawText("Consent to field trips", {
    x: 35,
    y: footerTop - 34,
    size: 12,
    font
  });
  drawBox(page, 220, footerTop - 38, 24);

  page.drawText("Fees Paid", {
    x: 385,
    y: footerTop,
    size: 12,
    font
  });
  drawBox(page, 475, footerBoxY, 24);

  drawLine(page, 50, 170, 205);
  page.drawText("Camper Signature", {
    x: 50,
    y: 156,
    size: 12,
    font
  });

  drawLine(page, 390, 170, 545);
  page.drawText("Parents Signature", {
    x: 390,
    y: 156,
    size: 12,
    font
  });

  drawLine(page, 170, 115, 420);
  page.drawText("Date", {
    x: 280,
    y: 107,
    size: 12,
    font,
    color: rgb(0.1, 0.1, 0.1)
  });

  const pdfBytes = await pdfDoc.save();
  const fileName = `${registration.registrationId}.pdf`;
  const absolutePath = path.join(pdfsDir, fileName);
  await fs.writeFile(absolutePath, pdfBytes);
  return { absolutePath, publicPath: toPublicPath(absolutePath) };
};

const mergePdfFiles = async (filePaths, outputName = "merged-registrations.pdf") => {
  await ensureDir(pdfsDir);

  const merged = await PDFDocument.create();
  for (const filePath of filePaths) {
    if (!filePath) continue;
    const localPath = path.isAbsolute(filePath) ? filePath : path.join(path.resolve(__dirname, ".."), "public", filePath.replace(/^\/+/, ""));
    const bytes = await fs.readFile(localPath);
    const doc = await PDFDocument.load(bytes);
    const copiedPages = await merged.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => merged.addPage(page));
  }

  const bytes = await merged.save();
  const absolutePath = path.join(pdfsDir, outputName);
  await fs.writeFile(absolutePath, bytes);
  return { absolutePath, publicPath: toPublicPath(absolutePath) };
};

module.exports = {
  createRegistrationPdf,
  mergePdfFiles
};
