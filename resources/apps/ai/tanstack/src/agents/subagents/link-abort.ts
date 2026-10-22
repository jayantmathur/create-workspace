export function linkAbort(signal: AbortSignal | undefined) {
  const abortController = new AbortController();
  if (signal === undefined) return abortController;
  if (signal.aborted) {
    abortController.abort();
    return abortController;
  }
  signal.addEventListener(
    "abort",
    () => {
      abortController.abort();
    },
    { once: true },
  );
  return abortController;
}
