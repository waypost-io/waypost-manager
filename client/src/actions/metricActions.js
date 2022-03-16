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
    return apiClient.editMetric(id, updatedFields, (data) => {
      if (data.ok) {
        dispatch(editMetricSuccess(data));
        return true;
      }
      alert(`Editing metric failed: ${data.error_message}`);
      return false;
    });
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
    return apiClient.createMetric(fields, (data) => {
      if (data.ok) {
        dispatch(createMetricSuccess(data.metric));
        return true;
      }
      alert(`Creating metric failed: ${data.error_message}`);
      return false;
    });
  }
}

export function createMetricSuccess(metric) {
  return { type: "CREATE_METRIC_SUCCESS", metric };
}