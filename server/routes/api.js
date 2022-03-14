const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
const experimentController = require("../controllers/experimentController");
const connectionController = require("../controllers/connectionController");
const { validateNewFlag } = require("../validators/validators");
// will implement later
// const { validateSDKKey, validateNewFlag } = require("../validators/validators");

router.get("/flags", flagsController.getAllFlags);
// router.get("/flags", validateSDKKey, flagsController.getAllFlags);
router.get("/flags/:id", flagsController.getFlag);

router.post(
  "/flags",
  validateNewFlag,
  flagsController.createFlag,
  flagsController.getAllFlagsData,
  flagsController.sendFlagsWebhook
);

router.put(
  "/flags/:id",
  flagsController.editFlag,
  flagsController.getAllFlagsData,
  flagsController.sendFlagsWebhook
);

router.delete(
  "/flags/:id",
  flagsController.deleteFlag,
  flagsController.getAllFlagsData,
  flagsController.sendFlagsWebhook
);

router.get("/experiments/:flagId", experimentController.getExperiments);

router.post("/connection", connectionController.createConnection);

router.delete("/connection", connectionController.removeConnection);

router.get("/connection", connectionController.testConnection);

module.exports = router;
