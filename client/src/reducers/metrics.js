export default function metrics(state = [], action) {
  switch (action.type) {
    case "FETCH_METRICS_SUCCESS": {
      return action.metrics;
    }
    default: {
      return state;
    }
  }
}