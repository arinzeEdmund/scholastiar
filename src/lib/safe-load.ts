import { unstable_rethrow } from "next/navigation";

/**
 * Load data for a section without letting a failure take down the whole page.
 * Render the result outside the try/catch (React can't catch render errors there).
 * Next.js control-flow errors (notFound, redirect, dynamic rendering bail-outs) are re-thrown.
 */
export async function safeLoad<T>(load: () => Promise<T>): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    unstable_rethrow(error);
    console.error(error);
    return { ok: false };
  }
}
