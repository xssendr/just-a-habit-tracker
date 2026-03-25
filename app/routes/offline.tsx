import { Link } from "react-router";

export default function Offline() {
  return (
    <div className="container mx-auto p-8 text-center py-24">
      <h1 className="text-6xl font-bold mb-4">📱 Offline</h1>
      <p className="text-xl mb-8 max-w-md mx-auto">
        You're currently offline. Your habits are cached locally.
      </p>
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Go Home
        </Link>
        <p className="text-sm text-muted-foreground">
          Connection will be restored automatically.
        </p>
      </div>
    </div>
  );
}

