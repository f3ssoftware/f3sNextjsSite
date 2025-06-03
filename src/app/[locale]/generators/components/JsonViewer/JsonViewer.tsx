"use client";

import { Button } from "primereact/button";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import "react18-json-view/src/dark.css";
import { useTranslations } from "next-intl";
import { JsonViewProps } from "../../types";

export const JsonViewer = ({
  data,
  onDataChange,
  isEditMode,
  theme,
  onThemeChange,
  onEditModeChange,
}: JsonViewProps) => {
  const t = useTranslations();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleJsonChange = (params: any) => {
    const newData = [...data];
    const { indexOrName, type, src } = params;
    
    if (type === 'edit') {
      newData[indexOrName] = src;
    } else if (type === 'delete') {
      newData.splice(indexOrName, 1);
    } else if (type === 'add') {
      newData.push(src);
    }
    
    onDataChange(newData);
  };

  return (
    <div className="surface-card p-4 border-round" style={{ width: "100%" }}>
      <div className="flex align-items-center justify-content-between mb-3">
        <div className="flex gap-2">
          <Button
            icon={isEditMode ? "pi pi-check" : "pi pi-pencil"}
            rounded
            text
            severity={isEditMode ? "success" : "secondary"}
            tooltip={isEditMode ? t("SAVE_CHANGES") : t("EDIT_JSON")}
            tooltipOptions={{ position: "bottom" }}
            onClick={() => onEditModeChange(!isEditMode)}
          />
          <Button
            icon={theme === "default" ? "pi pi-moon" : "pi pi-sun"}
            rounded
            text
            severity="secondary"
            tooltip={
              theme === "default"
                ? t("SWITCH_TO_LIGHT_THEME")
                : t("SWITCH_TO_DARK_THEME")
            }
            tooltipOptions={{ position: "bottom" }}
            onClick={() =>
              onThemeChange(theme === "default" ? "winter-is-coming" : "default")
            }
          />
          <Button
            icon="pi pi-copy"
            rounded
            text
            severity="secondary"
            tooltip={t("COPY_TO_CLIPBOARD")}
            tooltipOptions={{ position: "bottom" }}
            onClick={handleCopyToClipboard}
          />
        </div>
      </div>
      <div
        className="border-round overflow-auto"
        style={{ maxHeight: "70vh" }}
      >
        <JsonView
          src={data}
          style={{
            backgroundColor: theme === "default" ? "transparent" : "white",
            padding: "1rem",
            borderRadius: "6px",
            fontSize: "1rem",
            lineHeight: "1.5",
          }}
          theme={theme}
          enableClipboard={true}
          collapsed={false}
          editable={isEditMode}
          onChange={handleJsonChange}
        />
      </div>
    </div>
  );
}; 