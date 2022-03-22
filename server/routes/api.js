const express = require("express");
const router = express.Router();
const flagsController = require("../controllers/flagsController");
const experimentController = require("../controllers/experimentController");
const metricsController = require("../controllers/metricsController");
const connectionController = require("../controllers/connectionController");
const sdkKeyController = require("../controllers/sdkKeyController");
const exposuresController = require("../controllers/exposuresController");
const logsController = require("../controllers/logsController");
const cAssignmentController = require("../controllers/cAssignmentController");
const { validateNewFlag } = require("../validators/validators");

router.get("/flags/:id/custom-assignments", cAssignmentController.fetchAssignmentsOnFlag);

router.post("/flags/:id/custom-assignments", cAssignmentController.createAssignments);

router.delete("/flags/:id/custom-assignments", cAssignmentController.deleteAssignments);

router.get("/flags", flagsController.getAllFlags);

router.get("/flags/:id", flagsController.getFlag);

router.post(
  "/flags",
  validateNewFlag,
  flagsController.createFlag,
  flagsController.setFlagsOnReq,
  cAssignmentController.setAssignmentsOnEachFlag,
  flagsController.sendFlagsWebhook,
  logsController.logEvent
);

router.put(
  "/flags/:id",
  flagsController.editFlag,
  flagsController.setFlagsOnReq,
  cAssignmentController.setAssignmentsOnEachFlag,
  flagsController.sendFlagsWebhook,
  logsController.logEvent
);

router.get(
  "/flags/:id/experiments",
  experimentController.getExperimentsForFlag
);

router.delete(
  "/flags/:id",
  flagsController.deleteFlag,
  flagsController.setFlagsOnReq,
  cAssignmentController.setAssignmentsOnEachFlag,
  flagsController.sendFlagsWebhook,
  logsController.logEvent
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

router.put("/exposures", exposuresController.backfillData);

router.put("/experiments/:id/analysis", experimentController.analyzeExperiment);

router.put("/analysis", experimentController.analyzeAll);

router.get("/log", logsController.getLog);

router.get("/sdkKey", sdkKeyController.fetchKey);

router.post(
  "/sdkKey",
  sdkKeyController.removeKeys,
  sdkKeyController.createKey,
  sdkKeyController.sendSdkWebhook
);

module.exports = router;
