"use client";

import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useTranslations } from "next-intl";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { useIsClient } from "../../../../../../hooks/useIsClient";

interface JWTGeneratorProps {
  onValueChange: (value: any) => void;
}

interface JWTConfig {
  algorithm: string;
  expiresIn: number;
  includeIssuer: boolean;
  includeAudience: boolean;
  includeSubject: boolean;
  includeJTI: boolean;
  includeIAT: boolean;
  includeNBF: boolean;
}

export default function JWTGenerator({ onValueChange }: JWTGeneratorProps) {
  const isClient = useIsClient();
  const [jwt, setJwt] = useState<string>("");
  const [decodedJWT, setDecodedJWT] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<JWTConfig>({
    algorithm: "HS256",
    expiresIn: 3600,
    includeIssuer: true,
    includeAudience: true,
    includeSubject: true,
    includeJTI: true,
    includeIAT: true,
    includeNBF: false,
  });
  const toast = useRef<Toast>(null);
  const t = useTranslations();

  const algorithms = [
    { label: "HS256 (HMAC SHA256)", value: "HS256" },
    { label: "HS384 (HMAC SHA384)", value: "HS384" },
    { label: "HS512 (HMAC SHA512)", value: "HS512" },
    { label: "RS256 (RSA SHA256)", value: "RS256" },
    { label: "RS384 (RSA SHA384)", value: "RS384" },
    { label: "RS512 (RSA SHA512)", value: "RS512" },
    { label: "ES256 (ECDSA SHA256)", value: "ES256" },
    { label: "ES384 (ECDSA SHA384)", value: "ES384" },
    { label: "ES512 (ECDSA SHA512)", value: "ES512" },
  ];

  const generateJWT = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generators/jwtGenerator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      setJwt(data.jwt);
      setDecodedJWT(data.decoded);
      onValueChange({ jwt: data.jwt, decoded: data.decoded });
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

  const copyJWT = () => {
    if (jwt) {
      navigator.clipboard.writeText(jwt);
      toast.current?.show({
        severity: "success",
        summary: t("SUCCESS"),
        detail: "JWT copied to clipboard",
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

  const copyDecoded = () => {
    if (decodedJWT) {
      navigator.clipboard.writeText(JSON.stringify(decodedJWT, null, 2));
      toast.current?.show({
        severity: "success",
        summary: t("SUCCESS"),
        detail: "Decoded JWT copied to clipboard",
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
    <div className="flex flex-column gap-3">
      <Toast ref={toast} />
      
      {/* Configuration Section */}
      <div className="surface-card p-4 border-round">
        <h3 className="text-lg font-semibold mb-3">JWT Configuration</h3>
        <div className="grid">
          <div className="col-12 md:col-6">
            <label className="block text-900 font-medium mb-2">Algorithm</label>
            <Dropdown
              value={config.algorithm}
              options={algorithms}
              onChange={(e) => setConfig({ ...config, algorithm: e.value })}
              placeholder="Select Algorithm"
              className="w-full"
            />
          </div>
          <div className="col-12 md:col-6">
            <label className="block text-900 font-medium mb-2">Expires In (seconds)</label>
            <InputNumber
              value={config.expiresIn}
              onValueChange={(e) => setConfig({ ...config, expiresIn: e.value || 3600 })}
              min={60}
              max={31536000}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="grid mt-3">
          <div className="col-12 md:col-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="includeIssuer"
                checked={config.includeIssuer}
                onChange={(e) => setConfig({ ...config, includeIssuer: e.checked })}
              />
              <label htmlFor="includeIssuer" className="ml-2">Include Issuer</label>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="includeAudience"
                checked={config.includeAudience}
                onChange={(e) => setConfig({ ...config, includeAudience: e.checked })}
              />
              <label htmlFor="includeAudience" className="ml-2">Include Audience</label>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="includeSubject"
                checked={config.includeSubject}
                onChange={(e) => setConfig({ ...config, includeSubject: e.checked })}
              />
              <label htmlFor="includeSubject" className="ml-2">Include Subject</label>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="includeJTI"
                checked={config.includeJTI}
                onChange={(e) => setConfig({ ...config, includeJTI: e.checked })}
              />
              <label htmlFor="includeJTI" className="ml-2">Include JTI</label>
            </div>
          </div>
        </div>
        
        <div className="grid mt-2">
          <div className="col-12 md:col-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="includeIAT"
                checked={config.includeIAT}
                onChange={(e) => setConfig({ ...config, includeIAT: e.checked })}
              />
              <label htmlFor="includeIAT" className="ml-2">Include IAT</label>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="includeNBF"
                checked={config.includeNBF}
                onChange={(e) => setConfig({ ...config, includeNBF: e.checked })}
              />
              <label htmlFor="includeNBF" className="ml-2">Include NBF</label>
            </div>
          </div>
        </div>
      </div>

      {/* Generated JWT Section */}
      <div className="surface-card p-4 border-round">
        <h3 className="text-lg font-semibold mb-3">Generated JWT</h3>
        <div className="flex flex-column gap-3">
          <div>
            <label className="block text-900 font-medium mb-2">JWT Token</label>
            <div className="flex gap-2">
              <InputText
                value={jwt}
                readOnly
                className="w-full"
                placeholder="Generated JWT will appear here"
              />
              <Button
                icon="pi pi-copy"
                rounded
                text
                severity="secondary"
                onClick={copyJWT}
                disabled={!jwt}
                tooltip="Copy JWT"
                tooltipOptions={{ position: "bottom" }}
              />
            </div>
          </div>
          
          {decodedJWT && (
            <div>
              <label className="block text-900 font-medium mb-2">Decoded JWT</label>
              <div className="flex gap-2">
                <InputText
                  value={JSON.stringify(decodedJWT, null, 2)}
                  readOnly
                  className="w-full"
                />
                <Button
                  icon="pi pi-copy"
                  rounded
                  text
                  severity="secondary"
                  onClick={copyDecoded}
                  tooltip="Copy Decoded JWT"
                  tooltipOptions={{ position: "bottom" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-content-end gap-2">
        <Button
          icon="pi pi-refresh"
          label="Generate JWT"
          onClick={generateJWT}
          loading={loading}
          className="p-button-primary"
        />
      </div>
    </div>
  );
}
