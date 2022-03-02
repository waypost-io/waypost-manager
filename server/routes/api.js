const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
// const {
//   validateBoard,
//   validateCard,
//   validateList,
//   validateEditList,
//   validateComment
// } = require("../validators/validators");

router.get("/flags/:sdk-key", flagsController.getAllFlags);

router.post("/flags", flagsController.createFlag);

router.put("/flags/:id", flagsController.editFlag);

router.delete("/flags/:id", flagsController.deleteFlag);

module.exports = router;
