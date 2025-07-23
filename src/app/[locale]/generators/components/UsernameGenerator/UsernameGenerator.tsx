"use client";

import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useTranslations } from "next-intl";
import { Checkbox } from "primereact/checkbox";
import { useIsClient } from "../../../../../../hooks/useIsClient";

interface UsernameGeneratorProps {
  onValueChange: (value: any) => void;
}

export default function UsernameGenerator({ onValueChange }: UsernameGeneratorProps) {
  const isClient = useIsClient();
  const [username, setUsername] = useState<string>("");
  const [withNumber, setWithNumber] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const t = useTranslations();

  if (!isClient) return null;

  const generateUsername = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generators/usernameGenerator?includeNumber=${withNumber}`);
      const data = await res.json();
      setUsername(data.username);
      onValueChange({ username: data.username });
    } catch (e) {
      toast.current?.show({
        severity: "error",
        summary: t("ERROR"),
        detail: t("UNKNOWN_ERROR"),
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (username) {
      navigator.clipboard.writeText(username);
      toast.current?.show({
        severity: "success",
        summary: t("SUCCESS"),
        detail: t("USERNAME_COPIED"),
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: t("ERROR"),
        detail: t("COPY_FAILED"),
        life: 3000,
      });
    }
  };

  return (
    <div className="flex flex-column gap-2">
      <Toast ref={toast} />
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        width: "100%",
        alignItems: "center"
      }}>
        <div style={{ flex: "0 0 180px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Checkbox
            inputId="withNumber"
            checked={withNumber}
            onChange={e => setWithNumber(e.checked!)}
          />
          <label htmlFor="withNumber" style={{ whiteSpace: "nowrap" }}>{t("INCLUDE_NUMBER")}</label>
        </div>
        <div style={{ flex: "1 1 auto" }}>
          <InputText
            value={username}
            readOnly
            style={{ width: '100%' }}
            placeholder={t("GENERATED_USERNAME")}
          />
        </div>
        <div style={{ flex: "0 0 auto", display: "flex", gap: "5px" }}>
          <Button
            icon="pi pi-copy"
            rounded
            text
            severity="secondary"
            onClick={copyToClipboard}
            disabled={!username}
            tooltip={t("COPY_USERNAME")}
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            icon="pi pi-refresh"
            rounded
            text
            severity="secondary"
            onClick={generateUsername}
            loading={loading}
            tooltip={t("GENERATE_USERNAME")}
            tooltipOptions={{ position: "bottom" }}
          />
        </div>
      </div>
    </div>
  );
} 