import { useState } from "react";
import { toast } from "sonner";

type AsyncFn<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

function useFetch<TArgs extends unknown[], TResult>(
  cb: AsyncFn<TArgs, TResult>
) {
  const [data, setData] = useState<TResult | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fn = async (...args: TArgs): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
      const message =
        typeof err === "object" && err && "message" in err
          ? String(
              (err as { message?: unknown }).message ?? "An error occurred"
            )
          : "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}

export default useFetch;
