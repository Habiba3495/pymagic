let setErrorCallback = null;

export function setErrorContextCallback(callback) {
  setErrorCallback = callback;
}

export function setBackendError(message, status) {
  if (setErrorCallback && message !== 'Network unavailable') {
    setErrorCallback({ message, status });
  }
}

export function clearError() {
  if (setErrorCallback) {
    setErrorCallback(null);
  }
}