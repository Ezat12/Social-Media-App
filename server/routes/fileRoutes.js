const express = require("express");
const upload = require("../middleware/uploadFile");
const { cloudinaryUploadFiles } = require("../controller/upload-controller");
const router = express.Router();

router.route("/upload-file").post(upload, cloudinaryUploadFiles);

module.exports = router;
