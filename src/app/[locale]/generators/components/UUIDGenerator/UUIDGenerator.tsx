"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useTranslations } from "next-intl";

interface UUIDGeneratorProps {
  onValueChange: (value: any) => void;
}

export default function UUIDGenerator({ onValueChange }: UUIDGeneratorProps) {
  const [uuid, setUuid] = useState<string>("");
  const toast = useRef<Toast>(null);
  const t = useTranslations();

  const generateUUID = () => {
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
    onValueChange({ uuid: newUuid });
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
          tooltip={t("GENERATE_UUID")}
          tooltipOptions={{ position: "bottom" }}
        />
      </div>
    </div>
  );
}
