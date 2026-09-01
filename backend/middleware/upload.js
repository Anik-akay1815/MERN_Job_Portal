const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, "uploads/resumes");
    } else if (file.fieldname === "profilePhoto") {
      cb(null, "uploads/profilePhotos");
    } else if (file.fieldname === "logo") {
      cb(null, "uploads/logos");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + req.user.id + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Resume must be a PDF file"), false);
    }
  }
  if (file.fieldname === "profilePhoto") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Profile photo must be an image"), false);
    }
  }
  if (file.fieldname === "logo") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Logo must be an image"), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;