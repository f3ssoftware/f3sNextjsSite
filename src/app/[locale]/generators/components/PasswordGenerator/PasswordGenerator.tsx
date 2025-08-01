"use client";

import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useTranslations } from "next-intl";
import { InputNumber } from "primereact/inputnumber";
import { useIsClient } from "../../../../../../hooks/useIsClient";

interface PasswordGeneratorProps {
  onValueChange: (value: any) => void;
}

export default function PasswordGenerator({ onValueChange }: PasswordGeneratorProps) {
  const isClient = useIsClient();
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(16);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const t = useTranslations();

  const generatePassword = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generators/passwordGenerator?length=${length}`);
      const data = await res.json();
      setPassword(data.password);
      onValueChange({ password: data.password });
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
    if (password) {
      navigator.clipboard.writeText(password);
      toast.current?.show({
        severity: "success",
        summary: t("SUCCESS"),
        detail: t("PASSWORD_COPIED"),
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

  if (!isClient) return null;

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
          <label htmlFor="passwordLength" style={{ whiteSpace: "nowrap" }}>{t("PASSWORD_LENGTH")}:</label>
          <InputNumber
            id="passwordLength"
            value={length}
            onValueChange={(e) => setLength(e.value || 16)}
            min={4}
            max={64}
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-secondary"
            incrementButtonClassName="p-button-secondary"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: "1 1 auto" }}>
          <InputText
            value={password}
            readOnly
            style={{ width: '100%' }}
            placeholder={t("GENERATED_PASSWORD")}
          />
        </div>
        <div style={{ flex: "0 0 auto", display: "flex", gap: "5px" }}>
          <Button
            icon="pi pi-copy"
            rounded
            text
            severity="secondary"
            onClick={copyToClipboard}
            disabled={!password}
            tooltip={t("COPY_PASSWORD")}
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            icon="pi pi-refresh"
            rounded
            text
            severity="secondary"
            onClick={generatePassword}
            loading={loading}
            tooltip={t("GENERATE_PASSWORD")}
            tooltipOptions={{ position: "bottom" }}
          />
        </div>
      </div>
    </div>
  );
}