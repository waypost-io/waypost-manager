const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
const experimentController = require("../controllers/experimentController");
const metricsController = require("../controllers/metricsController");
const connectionController = require("../controllers/connectionController");
const sdkController = require("../controllers/sdkController");
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

router.get(
  "/flags/:id/experiments",
  experimentController.getExperimentsForFlag
);

router.delete(
  "/flags/:id",
  flagsController.deleteFlag,
  flagsController.setFlagsOnReq,
  flagsController.sendFlagsWebhook
);

router.get("/experiments/:id", experimentController.getExperiment);

router.put(
  "/experiments/:id",
  experimentController.editExperiment,
  experimentController.analyzeExperiment
);

router.post("/experiments", experimentController.createExperiment);

router.get("/metrics", metricsController.getMetrics);

router.get("/metrics/:id", metricsController.getMetric);

router.post("/metrics", metricsController.validateQuery, metricsController.createMetric);

router.put("/metrics/:id", metricsController.validateQuery, metricsController.editMetric);

router.delete("/metrics/:id", metricsController.deleteMetric);

router.post("/connection", connectionController.createConnection);

router.delete("/connection", connectionController.removeConnection);

router.get("/connection", connectionController.testConnection);

router.put("/experiments/exposures", experimentController.backfillData);

router.put("/experiments/:id/analysis", experimentController.analyzeExperiment);

router.put("/analysis", experimentController.analyzeAll);

router.post("/sdkKey", sdkController.removeKeys, sdkController.createKey);

router.get("/sdkKey", sdkController.fetchKey);

module.exports = router;
