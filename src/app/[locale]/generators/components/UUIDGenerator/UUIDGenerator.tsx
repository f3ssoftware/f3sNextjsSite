"use client";

import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useTranslations } from "next-intl";
import { useIsClient } from "../../../../../../hooks/useIsClient";

interface UUIDGeneratorProps {
  onValueChange: (value: any) => void;
}

export default function UUIDGenerator({ onValueChange }: UUIDGeneratorProps) {
  const isClient = useIsClient();
  const [uuid, setUuid] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const t = useTranslations();

  const generateUUID = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generators/uuidGenerator`);
      const data = await res.json();
      setUuid(data.uuid);
      onValueChange({ uuid: data.uuid });
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
    if (uuid) {
      navigator.clipboard.writeText(uuid);
      toast.current?.show({
        severity: "success",
        summary: t("SUCCESS"),
        detail: t("UUID_COPIED"),
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
      <div className="flex gap-2">
        <InputText
          value={uuid}
          readOnly
          className="w-full"
          placeholder={t("GENERATED_UUID")}
        />
        <Button
          icon="pi pi-copy"
          rounded
          text
          severity="secondary"
          onClick={copyToClipboard}
          disabled={!uuid}
          tooltip={t("COPY_UUID")}
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-refresh"
          rounded
          text
          severity="secondary"
          onClick={generateUUID}
          loading={loading}
          tooltip={t("GENERATE_UUID")}
          tooltipOptions={{ position: "bottom" }}
        />
      </div>
    </div>
  );
}
