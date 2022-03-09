const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
const connectionController = require("../controllers/connectionController");
const { validateNewFlag } = require("../validators/validators");
// will implement later
// const { validateSDKKey, validateNewFlag } = require("../validators/validators");

router.get("/flags", flagsController.getAllFlags);
// router.get("/flags", validateSDKKey, flagsController.getAllFlags);
router.get("/flags/:id", flagsController.getFlag);

router.post("/flags", validateNewFlag, flagsController.createFlag);

router.put("/flags/:id", flagsController.editFlag);

router.delete("/flags/:id", flagsController.deleteFlag);

router.post("/connection", connectionController.createConnection);

router.delete("/connection", connectionController.removeConnection);

module.exports = router;
