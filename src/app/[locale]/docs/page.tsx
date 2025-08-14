"use client";
import { useEffect, useState } from "react";
import "swagger-ui-react/swagger-ui.css";

export default function DocumentationPage() {
  const [spec, setSpec] = useState(null);
  const [SwaggerUI, setSwaggerUI] = useState<any>(null);

  useEffect(() => {
    // Import SwaggerUI component on the client side
    import("swagger-ui-react").then((module) => {
      setSwaggerUI(() => module.default);
    });

    // Fetch OpenAPI spec
    fetch("/api/openapi")
      .then(res => res.json())
      .then(setSpec);
  }, []);

  if (!spec || !SwaggerUI) return <div>Loading OpenAPI spec...</div>;

  return (
    <div style={{ background: "#fff", padding: 24, minHeight: "80vh" }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}
