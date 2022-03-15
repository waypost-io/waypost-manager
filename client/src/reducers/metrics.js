export default function metrics(state = [], action) {
  switch (action.type) {
    case "FETCH_METRICS_SUCCESS": {
      return action.metrics;
    }
    case "EDIT_METRIC_SUCCESS": {
      return state.map(metric => {
        if (metric.id === action.metric.id) {
          return action.metric;
        } else {
          return metric;
        }
      });
    }
    case "DELETE_METRIC_SUCCESS": {
      return state.filter(metric => metric.id !== action.id);
    }
    default: {
      return state;
    }
  }
}