"use client";

// Minimal global error boundary — renders outside locale layout
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1>Something went wrong</h1>
        <p style={{ color: "#666" }}>{error.message}</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </body>
    </html>
  );
}
