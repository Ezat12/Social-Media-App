const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);

    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${file.originalname.split(".")[0]}-${uniqueSuffix}.${
      file.mimetype.split("/")[1]
    }`;
    console.log("fileName", fileName);

    cb(null, fileName);
  },
});

const upload = multer({ storage }).fields([{ name: "images", maxCount: "5" }]);

module.exports = upload;
