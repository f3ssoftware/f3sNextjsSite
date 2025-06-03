"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useTranslations } from "next-intl";

interface AddressGeneratorProps {
  onValueChange: (value: any) => void;
}

export default function AddressGenerator({ onValueChange }: AddressGeneratorProps) {
  const [address, setAddress] = useState<string>("");
  const toast = useRef<Toast>(null);
  const t = useTranslations();

  const generateAddress = () => {
    const streets = ["Main St", "Broadway", "Park Ave", "Market St", "Oak St"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
    const states = ["NY", "CA", "IL", "TX", "AZ"];
    const zipCodes = ["10001", "90001", "60601", "77001", "85001"];

    const randomIndex = Math.floor(Math.random() * streets.length);
    const streetNumber = Math.floor(Math.random() * 1000) + 1;
    const newAddress = {
      street: `${streetNumber} ${streets[randomIndex]}`,
      city: cities[randomIndex],
      state: states[randomIndex],
      zipCode: zipCodes[randomIndex],
    };

    setAddress(JSON.stringify(newAddress, null, 2));
    onValueChange(newAddress);
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.current?.show({
        severity: "success",
        summary: t("SUCCESS"),
        detail: t("ADDRESS_COPIED"),
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
          value={address}
          readOnly
          className="w-full"
          placeholder={t("GENERATED_ADDRESS")}
        />
        <Button
          icon="pi pi-copy"
          rounded
          text
          severity="secondary"
          onClick={copyToClipboard}
          disabled={!address}
          tooltip={t("COPY_ADDRESS")}
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-refresh"
          rounded
          text
          severity="secondary"
          onClick={generateAddress}
          tooltip={t("GENERATE_ADDRESS")}
          tooltipOptions={{ position: "bottom" }}
        />
      </div>
    </div>
  );
}