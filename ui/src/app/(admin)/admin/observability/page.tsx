export default function AdminObservabilityPage() {
  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold tracking-tight">Observability</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Open SigNoz to inspect traces, metrics, and logs for this marketplace.
      </p>
      <div className="mt-4">
        <a
          href="http://localhost:8080"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Open SigNoz dashboard
        </a>
      </div>
    </div>
  );
}

