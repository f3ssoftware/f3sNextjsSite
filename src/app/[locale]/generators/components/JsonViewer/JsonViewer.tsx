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
    <div className="json-viewer-modern" style={{ 
      width: "100%", 
      backgroundColor: "transparent",
      border: "none",
      height: "fit-content"
    }}>
      {/* Header with controls */}
      <div className="json-controls">
        <div className="control-buttons">
          <Button
            icon={isEditMode ? "pi pi-check" : "pi pi-pencil"}
            rounded
            text
            size="small"
            severity={isEditMode ? "success" : "secondary"}
            tooltip={isEditMode ? t("SAVE_CHANGES") : t("EDIT_JSON")}
            tooltipOptions={{ position: "bottom" }}
            onClick={() => onEditModeChange(!isEditMode)}
            className="control-btn"
          />
          <Button
            icon={theme === "default" ? "pi pi-moon" : "pi pi-sun"}
            rounded
            text
            size="small"
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
            className="control-btn"
          />
          <Button
            icon="pi pi-copy"
            rounded
            text
            size="small"
            severity="secondary"
            tooltip={t("COPY_TO_CLIPBOARD")}
            tooltipOptions={{ position: "bottom" }}
            onClick={handleCopyToClipboard}
            className="control-btn"
          />
        </div>
      </div>
      
      {/* JSON content area */}
      <div className="json-content">
        <JsonView
          src={data}
          style={{
            backgroundColor: "transparent",
            padding: "0",
            borderRadius: "4px",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            color: "var(--text-color, #fff)",
          }}
          theme={theme}
          enableClipboard={true}
          collapsed={true}
          editable={isEditMode}
          onChange={handleJsonChange}
        />
      </div>
    </div>
  );
}; 