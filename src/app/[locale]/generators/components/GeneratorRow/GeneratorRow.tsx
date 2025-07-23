"use client";

import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { useTranslations } from "next-intl";
import { GeneratorOption } from "../../types";
import UUIDGenerator from "../UUIDGenerator/UUIDGenerator";
import PasswordGenerator from "../PasswordGenerator/PasswordGenerator";
import AddressGenerator from "../AddressGenerator/AddressGenerator";
import UsernameGenerator from "../UsernameGenerator/UsernameGenerator";
import { useState } from "react";

interface GeneratorRowProps {
  index: number;
  selectedOption: GeneratorOption | null;
  filteredOptions: GeneratorOption[];
  onOptionChange: (option: GeneratorOption | null) => void;
  onRemove: () => void;
  onValueChange: (value: any) => void;
  itemTemplate: (option: GeneratorOption) => JSX.Element;
  searchOptions: (event: { query: string }) => GeneratorOption[];
}

export const GeneratorRow = ({
  index,
  selectedOption,
  filteredOptions,
  onOptionChange,
  onRemove,
  onValueChange,
  itemTemplate,
  searchOptions,
}: GeneratorRowProps) => {
  const t = useTranslations();
  const [suggestions, setSuggestions] = useState<GeneratorOption[]>(filteredOptions);

  const handleSearch = (event: { query: string }) => {
    const results = searchOptions(event);
    setSuggestions(results);
  };

  const renderComponent = (option: GeneratorOption) => {
    switch (option?.key) {
      case "1.1":
        return (
          <div className="w-full">
            <AddressGenerator onValueChange={onValueChange} />
          </div>
        );
      case "2.1":
        return (
          <div className="w-full">
            <UUIDGenerator onValueChange={onValueChange} />
          </div>
        );
      case "2.2":
        return (
          <div className="w-full">
            <PasswordGenerator onValueChange={onValueChange} />
          </div>
        );
      case "2.3":
        return (
          <div className="w-full">
            <UsernameGenerator onValueChange={onValueChange} />
          </div>
        );
      default:
        return (
          <div className="w-20rem">
            <div className="surface-card p-4 border-round">
              <div className="flex align-items-center gap-2 mb-3">
                <i className={`${option.icon} text-xl`}></i>
                <span className="font-bold">{option.label}</span>
              </div>
              <div className="text-500">{option.parent}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        marginBottom: "5vh",
        borderRadius: "6px",
        padding: "0.5rem",
        minHeight: "20vh",
        backgroundColor: index % 2 === 0 ? "#2B2F38" : "#3B3F48",
        alignItems: "center",
      }}
    >
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        onClick={onRemove}
        className="flex-shrink-0"
      />
      <AutoComplete
        value={selectedOption || undefined}
        suggestions={suggestions}
        completeMethod={handleSearch}
        field="label"
        onChange={(e) => onOptionChange(e.value)}
        itemTemplate={itemTemplate}
        className="w-20rem flex-shrink-0"
        placeholder={t("SELECT_GENERATOR")}
        dropdown
        delay={300}
        style={{
          height: "20%",
        }}
      />
      {selectedOption && renderComponent(selectedOption)}
    </div>
  );
};
