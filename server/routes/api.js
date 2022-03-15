const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
const experimentController = require("../controllers/experimentController");
const metricsController = require("../controllers/metricsController");
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
  flagsController.setFlagsOnReq,
  flagsController.sendFlagsWebhook
);

router.put(
  "/flags/:id",
  flagsController.editFlag,
  flagsController.setFlagsOnReq,
  flagsController.sendFlagsWebhook
);

router.get("/flags/:id/experiments", experimentController.getExperimentsForFlag);

router.put("/flags/:id", flagsController.editFlag, flagsController.getAllFlagsData,
flagsController.sendFlagsWebhook);

router.delete(
  "/flags/:id",
  flagsController.deleteFlag,
  flagsController.setFlagsOnReq,
  flagsController.sendFlagsWebhook
);

router.get("/experiments/:id", experimentController.getExperiment);

router.put("/experiments/:id", experimentController.editExperiment, experimentController.getAnalysis);

router.post("/experiments", experimentController.createExperiment);

router.put("/experiments/:id/data", experimentController.updateExperimentData);

router.get("/experiments/:id/analysis", experimentController.getAnalysis);

router.get("/metrics", metricsController.getMetrics);

router.get("/metrics/:id", metricsController.getMetric);

router.post("/metrics", metricsController.createMetric);

router.put("/metrics/:id", metricsController.editMetric);

router.delete("/metrics/:id", metricsController.deleteMetric);

router.post("/connection", connectionController.createConnection);

router.delete("/connection", connectionController.removeConnection);

router.get("/connection", connectionController.testConnection);

module.exports = router;
