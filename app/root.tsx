import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ThemeProvider } from "~/components/theme-provider"
import { BottomTabs } from "~/components/bottom-tabs";
import { PwaInit } from "~/components/pwa-init"; 
import { useEffect } from "react";
import { useHabitStore } from "stores/habits";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "manifest", href: "/manifest.json" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Prevent SSR/client hydration mismatches caused by persisted client state.
    void useHabitStore.persist.rehydrate();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="8ZK2sFdYAeJPKE3nk86qUfME7p9ftZHiTwHxAkzQ6-0" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="bg-background min-h-dvh pb-[calc(var(--bottom-tabs-height)+env(safe-area-inset-bottom))]">
            <PwaInit />
            <main >
              <div className="flex-1 pb-4">{children}</div>
            </main>
          </div>
          {/* <BottomTabs /> */}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
