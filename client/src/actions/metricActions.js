import apiClient from '../lib/ApiClient';

export function fetchMetrics() {
  return function(dispatch) {
    apiClient.getMetrics(data => dispatch(fetchMetricsSuccess(data)));
  }
}

export function fetchMetricsSuccess(metrics) {
  return { type: "FETCH_METRICS_SUCCESS", metrics };
}

export function editMetric(id, updatedFields) {
  return function(dispatch) {
    apiClient.editMetric(id, updatedFields, data => dispatch(editMetricSuccess(data)));
  }
}

export function editMetricSuccess(metric) {
  return { type: "EDIT_METRIC_SUCCESS", metric };
}

export function deleteMetric(id) {
  return function(dispatch) {
    apiClient.deleteMetric(id, () => dispatch(deleteMetricSuccess(id)));
  }
}

export function deleteMetricSuccess(id) {
  return { type: "DELETE_METRIC_SUCCESS", id: id };
}

export function createMetric(fields) {
  return function(dispatch) {
    apiClient.createMetric(fields, (data) => dispatch(createMetricSuccess(data)));
  }
}

export function createMetricSuccess(metric) {
  return { type: "CREATE_METRIC_SUCCESS", metric };
}