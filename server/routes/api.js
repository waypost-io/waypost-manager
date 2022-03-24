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

// -------- Flags --------
router.get("/flags",
  flagsController.getAllFlags,
  flagsController.setFlagsOnReq,
  cAssignmentController.setAssignmentsOnEachFlag,
  flagsController.sendFlagsWebhook
);

router.get("/flags/:id", flagsController.getFlag);

router.post(
  "/flags",
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

router.delete(
  "/flags/:id",
  flagsController.deleteFlag,
  flagsController.setFlagsOnReq,
  cAssignmentController.setAssignmentsOnEachFlag,
  flagsController.sendFlagsWebhook,
  logsController.logEvent
);

// -------- Custom Assignments --------
router.get(
  "/flags/:id/custom-assignments",
  cAssignmentController.fetchAssignmentsOnFlag
);

router.get("/custom-assignments", cAssignmentController.fetchAllAssignments);

router.post(
  "/flags/:id/custom-assignments",
  cAssignmentController.createAssignmentsOnFlag
);

router.delete(
  "/flags/:id/custom-assignments",
  cAssignmentController.deleteAssignmentsOnFlag
);

// -------- Experiments --------
router.get(
  "/flags/:id/experiments",
  experimentController.getExperimentsForFlag
);

router.get("/experiments/:id", experimentController.getExperiment);

router.put(
  "/experiments/:id",
  experimentController.editExperiment,
  experimentController.analyzeExperiment
);

router.post("/experiments", experimentController.createExperiment);

router.put("/experiments/:id/analysis", experimentController.analyzeExperiment);

// -------- Metrics --------
router.get("/metrics", metricsController.getMetrics);

router.get("/metrics/:id", metricsController.getMetric);

router.post(
  "/metrics",
  metricsController.validateQuery,
  metricsController.createMetric
);

router.put(
  "/metrics/:id",
  metricsController.validateQuery,
  metricsController.editMetric
);

router.delete("/metrics/:id", metricsController.deleteMetric);

// -------- Connection to Event DB --------
router.post("/connection", connectionController.createConnection);

router.delete("/connection", connectionController.removeConnection);

router.get("/connection", connectionController.testConnection);

// -------- Analysis --------
router.put("/exposures", exposuresController.backfillData);

router.put("/analysis", experimentController.analyzeAll);

// -------- Flag event logging --------
router.get("/log", logsController.getLog);

// -------- SDK Key --------
router.get("/sdkKey", sdkKeyController.fetchKey);

router.post(
  "/sdkKey",
  sdkKeyController.removeKeys,
  sdkKeyController.createKey,
  sdkKeyController.sendSdkWebhook
);

module.exports = router;
