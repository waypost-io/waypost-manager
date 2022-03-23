import experiments from "../reducers/experiments";
import {
  fetchExperimentsSuccess,
  createExperimentSuccess,
  editExperimentSuccess,
  updateStatsSuccess,
} from "../actions/exptActions";

const testExpts = [
  {
    id: 1,
    flag_id: 1,
    duration: 14,
    name: "Test Experiment 1",
    description: "Testing",
    metrics: [
      {
        metric_id: 1,
        name: "Signups",
        type: "binomial",
      },
    ],
  },
  {
    id: 2,
    flag_id: 1,
    duration: 21,
    name: "Test Experiment 2",
    description: "Testing",
    metrics: [
      {
        metric_id: 2,
        name: "Time on Site",
        type: "duration",
      },
    ],
  },
];
describe("Experiments reducer", () => {
  it("returns the initial state", () => {
    expect(experiments(undefined, {})).toEqual([]);
  });

  it("returns fetched experiments", () => {
    expect(experiments([], fetchExperimentsSuccess(testExpts))).toEqual(
      testExpts
    );
  });

  it("handles new experiment added to empty list", () => {
    const previousState = [];
    const newExpt = testExpts[0];
    expect(
      experiments(previousState, createExperimentSuccess(newExpt))
    ).toEqual([newExpt]);
  });

  it("handles new experiment added to existing list", () => {
    const previousState = [testExpts[0]];
    const newExpt = testExpts[1];
    expect(
      experiments(previousState, createExperimentSuccess(newExpt))
    ).toEqual(testExpts);
  });

  it("handles editing of experiment", () => {
    const previousState = testExpts;
    const updatedExpt = {
      id: 2,
      flag_id: 1,
      duration: 20,
      name: "Changed name",
      description: "Changed description",
      metrics: [
        {
          metric_id: 2,
          name: "Time on Site",
          type: "duration",
        },
      ],
    };
    expect(
      experiments(previousState, editExperimentSuccess(updatedExpt))
    ).toEqual([
      {
        id: 1,
        flag_id: 1,
        duration: 14,
        name: "Test Experiment 1",
        description: "Testing",
        metrics: [
          {
            metric_id: 1,
            name: "Signups",
            type: "binomial",
          },
        ],
      },
      {
        id: 2,
        flag_id: 1,
        duration: 20,
        name: "Changed name",
        description: "Changed description",
        metrics: [
          {
            metric_id: 2,
            name: "Time on Site",
            type: "duration",
          },
        ],
      },
    ]);
  });

  it("updates the stats on the metrics", () => {
    const previousState = testExpts;
    const data = [
      {
        experiment_id: 1,
        metric_id: 1,
        name: "Signups",
        type: "binomial",
        mean_test: 0.86,
        mean_control: 0.84,
        interval_start: null,
        interval_end: null,
        p_value: 0.6841,
      },
    ];
    const newState = experiments(previousState, updateStatsSuccess(data));
    const updatedMetrics = newState.find((expt) => expt.id === 1).metrics;
    for (let i = 0; i < updatedMetrics.length; i++) {
      expect(updatedMetrics[i].mean_test).toBeDefined();
      expect(updatedMetrics[i].mean_control).toBeDefined();
      expect(updatedMetrics[i].p_value).toBeDefined();
    }
  });
});
