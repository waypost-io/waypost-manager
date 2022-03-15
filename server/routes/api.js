const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
const experimentController = require("../controllers/experimentController");
const connectionController = require("../controllers/connectionController");
const streamController = require("../controllers/streamController");
const { validateNewFlag } = require("../validators/validators");
// will implement later
// const { validateSDKKey, validateNewFlag } = require("../validators/validators");

router.get("/flags", flagsController.getAllFlags);
// router.get("/flags", validateSDKKey, flagsController.getAllFlags);
router.get("/flags/:id", flagsController.getFlag);

router.get("/stream", streamController.handleNewConnection);

router.get("/status", streamController.status);

router.post(
  "/flags",
  validateNewFlag,
  flagsController.createFlag,
  streamController.sendUpdate
);

router.put("/flags/:id", flagsController.editFlag, streamController.sendUpdate);

router.delete(
  "/flags/:id",
  flagsController.deleteFlag,
  streamController.sendUpdate
);

router.get("/experiments/:flagId", experimentController.getExperiments);

router.post("/experiments", experimentController.createExperiment)

router.post("/connection", connectionController.createConnection);

router.delete("/connection", connectionController.removeConnection);

router.get("/connection", connectionController.testConnection);

module.exports = router;
