const PGTable = require("../db/PGTable");
const { EXPERIMENTS_TABLE_NAME, EXPERIMENT_METRICS_TABLE_NAME, EXPOSURES_TABLE_NAME, GET_EXPERIMENTS_QUERY } = require("../constants/db");
const { getNowString } = require("../utils");

const experimentsTable = new PGTable(EXPERIMENTS_TABLE_NAME);
experimentsTable.init();
const experimentMetricsTable = new PGTable(EXPERIMENT_METRICS_TABLE_NAME);
experimentMetricsTable.init();
const exposuresTable = new PGTable(EXPOSURES_TABLE_NAME);
exposuresTable.init();

const getExperiment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const experiment = await experimentsTable.getRow(id);
    res.status(200).send(experiment);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

// takes arr of joined expt and metric_id data with duplicate experiments
// returns arr with no duplicate experiments and metric_ids property is an arr
const transformMetricExptData = (experiments) => {
  let idMap = {};
  experiments.forEach((expt) => {
    if (idMap[expt.id]) {
      idMap[expt.id].push(expt.metric_id)
    } else {
      idMap[expt.id] = [expt.metric_id];
    }
  });

  return = Object.keys(idMap).map((exptId) => {
    const { metric_id, ...expt } = experiments.find((e) => e.id === Number(exptId));
    expt.metric_ids = idMap[exptId];
    return expt;
  })
}

const getExperimentsForFlag = async (req, res, next) => {
  const flagId = req.params.id;
  try {
    let { rows: experiments } = await experimentsTable.query(GET_EXPERIMENTS_QUERY, [flagId]);
    experiments = transformMetricExptData(experiments);
    res.status(200).send(experiments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const createExperiment = async (req, res, next) => {
  try {
    const hash_offset = Math.floor(Math.random() * 100);
    const exptObj = {
      flag_id: req.body.flag_id,
      duration: req.body.duration,
      name: req.body.name || '',
      description: req.body.description || '',
      hash_offset
    };
    const newExpt = await experimentsTable.insertRow(exptObj);
    // Add each metric_id to experiment_metrics with the experiment_id
    req.body.metric_ids.forEach(async (metricId) => {
        await experimentMetricsTable.insertRow({ experiment_id: newExpt.id, metric_id: metricId });
    });
    newExpt.metric_ids = req.body.metric_ids;
    res.status(200).send(newExpt);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const editExperiment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedFields = req.body;
    if (updatedFields.date_ended) {
      updatedFields.date_ended = getNowString();
    }
    const updatedExpt = await experimentsTable.editRow(updatedFields, { id: id });
    req.updatedExpt = updatedExpt;
    // If regular edit, not stopping experiment, just send back updated expt
    if (!updatedFields.date_ended) {
      res.status(200).send(updatedExpt);
      return;
    }
    // Else if stopping experiment, go to getAnalysis()
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message)
  }
};

const updateExperimentData = async (req, res, next) => {
  const id = req.params.id;
  // Adds row for test group and control group in the exposures table
  // Updates the test mean and control mean in the experiment_metrics table
  res.status(200).send("Todo");
};

const getAnalysis = async (req, res, next) => {
  const id = req.params.id;
  // Statistics and fill in the data in the experiments table
  res.status(200).send(req.updatedExpt); // use for now until analysis is created
  // res.status(200).send("Analysis")
};

exports.getExperimentsForFlag = getExperimentsForFlag;
exports.getExperiment = getExperiment;
exports.createExperiment = createExperiment;
exports.editExperiment = editExperiment;
exports.updateExperimentData = updateExperimentData;
exports.getAnalysis = getAnalysis;
