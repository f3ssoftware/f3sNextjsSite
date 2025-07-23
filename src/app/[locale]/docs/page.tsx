"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocumentationPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch("/api/openapi")
      .then(res => res.json())
      .then(setSpec);
  }, []);

  if (!spec) return <div>Loading OpenAPI spec...</div>;

  return (
    <div style={{ background: "#fff", padding: 24, minHeight: "80vh" }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}
