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
    return filtered;
  };

  return (
    <div className="generators-page">
      {/* Header Section */}
      <div className="generators-header">
        <div className="header-content">
          <h1 className="page-title">
            {t("GENERATORS")}
          </h1>
          <p className="page-subtitle">
            Generate various types of data for development and testing purposes
          </p>
        </div>
        <Button
          label={t("ADD_GENERATOR")}
          icon="pi pi-plus"
          onClick={addRow}
          className="p-button-primary add-generator-btn"
          size="large"
        />
      </div>

      {/* API Information Section */}
      <div className="api-info-section">
        <div className="info-content">
          <div>
            <h3 className="info-title">API Endpoints Available</h3>
            <p className="info-text">
              All generators are available via API endpoints at <code className="api-endpoint">/api/generators/&lt;generatorName&gt;</code>
            </p>
            <p className="info-subtext">
              Use these endpoints in your applications or test them directly in the browser
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="generators-content">
        {/* Left Side - Generators List */}
        <div className="generators-section">
          <div className="section-header">
            <h2 className="section-title">
              Active Generators
            </h2>
            <span className="generator-count">{rows.length} generator{rows.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="generators-list">
            {rows.length === 0 ? (
              <div className="empty-state">
                <h3 className="text-xl font-semibold mb-2">No generators yet</h3>
                <p className="text-500 mb-4">Click the &ldquo;Add Generator&rdquo; button to get started</p>
              </div>
            ) : (
              rows.map((row, index) => (
                <div key={index} className="generator-item-wrapper">
                  <GeneratorRow
                    index={index}
                    selectedOption={row.selectedOption}
                    filteredOptions={filteredOptions}
                    onOptionChange={(option) => updateRow(index, option)}
                    onRemove={() => removeRow(index)}
                    onValueChange={(value) => updateRowOutput(index, value)}
                    itemTemplate={itemTemplate}
                    searchOptions={searchOptions}
                    onRequestAPI={(generatorName) => {
                      const url = `${window.location.origin}/api/generators/${generatorName}`;
                      window.open(url, '_blank');
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Side - JSON Output */}
        <div className="output-section">
          <div className="section-header">
            <h2 className="section-title">
              Generated Output
            </h2>
            {jsonView && Object.keys(jsonView).length > 0 && (
              <span className="output-count">{Object.keys(jsonView).length} item{Object.keys(jsonView).length !== 1 ? 's' : ''}</span>
            )}
          </div>
          
          <div className="output-content">
            {jsonView && Object.keys(jsonView).length > 0 ? (
              <JsonViewer
                data={jsonView}
                onDataChange={() => {}}
                isEditMode={false}
                onEditModeChange={() => {}}
                theme="default"
                onThemeChange={() => {}}
              />
            ) : (
              <div className="output-placeholder">
                <h3 className="text-lg font-semibold mb-2">No output yet</h3>
                <p className="text-500 text-center">
                  Generate some data using the generators on the left to see the JSON output here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Add Generator Button */}
      <div className="bottom-add-section">
        <Button
          label={t("ADD_GENERATOR")}
          icon="pi pi-plus"
          onClick={addRow}
          className="p-button-primary add-generator-btn"
          size="large"
        />
      </div>
    </div>
  );
}
