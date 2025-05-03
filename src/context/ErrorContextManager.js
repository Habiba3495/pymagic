let setErrorCallback = null;

export function setErrorContextCallback(callback) {
  setErrorCallback = callback;
}

export function setBackendError(message, status) {
  if (setErrorCallback) {
    setErrorCallback({ message, status });
  } else {
    console.warn('ErrorContext callback not initialized');
  }
}

export function clearError() {
  if (setErrorCallback) {
    setErrorCallback(null);
  }
}