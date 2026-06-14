const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const generateQR = async (pickupId) => {
  const token = uuidv4();
  const fileName = `qr_pickup_${pickupId}_${token}.png`;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  await QRCode.toFile(filePath, `PICKUP-${pickupId}-${token}`);
  return `/uploads/${fileName}`;
};

module.exports = generateQR;
