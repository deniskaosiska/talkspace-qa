export async function pollUntil<T>(
  fn: () => Promise<T | null | undefined>,
  options: { timeoutMs: number; intervalMs: number; label?: string },
): Promise<T> {
  const deadline = Date.now() + options.timeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, options.intervalMs));
  }

  throw new Error(
    options.label
      ? `Timed out waiting for ${options.label}${lastError ? `: ${lastError}` : ''}`
      : 'Polling timed out',
  );
}
