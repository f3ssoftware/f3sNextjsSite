"use client";
import { useTranslations } from "next-intl";
import { Button } from "primereact/button";

import "react18-json-view/src/style.css";
import "react18-json-view/src/dark.css";
import { useGenerators } from "../hooks/useGenerators";
import { GeneratorRow } from "./GeneratorRow/GeneratorRow";
import { JsonViewer } from "./JsonViewer/JsonViewer";
import { GeneratorOption } from "../types";
import { useState } from "react";

export default function Generators() {
  const t = useTranslations();
  const {
    rows,
    filteredOptions,
    jsonView,
    addRow,
    removeRow,
    updateRow,
    updateRowOutput,
  } = useGenerators();

  const [suggestions, setSuggestions] = useState<GeneratorOption[]>([]);

  const itemTemplate = (option: GeneratorOption) => {
    return (
      <div className="flex align-items-center gap-2">
        <i className={`${option.icon} text-xl`}></i>
        <div>
          <div className="font-bold">{option.label}</div>
          {option.parent && <small className="text-500">{option.parent}</small>}
        </div>
      </div>
    );
  };

  const searchOptions = (event: { query: string }) => {
    const query = event.query.toLowerCase();
    const filtered = filteredOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        (option.parent && option.parent.toLowerCase().includes(query))
    );
    setSuggestions(filtered);
  };

  return (
    <div className="card">
      <div className="flex flex-column gap-4">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "80%" }}>
            <div className="flex flex-column gap-4">
              {rows.map((row, index) => (
                <GeneratorRow
                  key={index}
                  index={index}
                  selectedOption={row.selectedOption}
                  filteredOptions={suggestions}
                  onOptionChange={(option) => updateRow(index, option)}
                  onRemove={() => removeRow(index)}
                  onValueChange={(value) => updateRowOutput(index, value)}
                  itemTemplate={itemTemplate}
                  searchOptions={searchOptions}
                />
              ))}
            </div>
          </div>
          <div style={{ width: "20%" }}>
            {jsonView && (
              <JsonViewer
                data={jsonView}
                onDataChange={() => {}}
                isEditMode={false}
                onEditModeChange={() => {}}
                theme="default"
                onThemeChange={() => {}}
              />
            )}
          </div>
        </div>
      </div>
      <Button
        label={t("ADD_GENERATOR")}
        icon="pi pi-plus"
        onClick={addRow}
        className="p-button-primary"
      />
    </div>
  );
}
