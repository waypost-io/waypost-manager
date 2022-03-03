const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
const { validateNewFlag } = require("../validators/validators");
// will implement later
// const { validateSDKKey, validateNewFlag } = require("../validators/validators");

router.get("/flags", flagsController.getAllFlags);
// router.get("/flags", validateSDKKey, flagsController.getAllFlags);

router.post("/flags", validateNewFlag, flagsController.createFlag);

router.put("/flags/:id", flagsController.editFlag);

router.delete("/flags/:id", flagsController.deleteFlag);

module.exports = router;
