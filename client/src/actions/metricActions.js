import apiClient from '../lib/ApiClient';

export function fetchMetrics() {
  return function(dispatch) {
    apiClient.getMetrics(data => dispatch(fetchMetricsSuccess(data)));
  }
}

export function fetchMetricsSuccess(metrics) {
  return { type: "FETCH_METRICS_SUCCESS", metrics };
}