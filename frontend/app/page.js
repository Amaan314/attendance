// app/page.js

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  // Display a message while the redirection is in progress
  return (
    <div>
      <h1>Redirecting...</h1>
      <p>
        If you are not redirected automatically, <a href="/login">click here</a>
        .
      </p>
    </div>
  );
}
