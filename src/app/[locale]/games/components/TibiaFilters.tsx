import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { RefObject } from "react";

interface Option { label: string; value: string; }

interface TibiaFiltersProps {
  searchToApply: string;
  setSearchToApply: (v: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  onSearch: () => void;
  onClear: () => void;
  selectedVocations: string[];
  setSelectedVocations: (v: string[]) => void;
  allVocations: Option[];
  selectedTypes: string[];
  setSelectedTypes: (v: string[]) => void;
  allTypes: Option[];
  selectedElements: string[];
  setSelectedElements: (v: string[]) => void;
  allElements: Option[];
  minLevel: number | null;
  setMinLevel: (v: number | null) => void;
  maxLevel: number | null;
  setMaxLevel: (v: number | null) => void;
  t: (key: string, opts?: any) => string;
}

export default function TibiaFilters({
  searchToApply,
  setSearchToApply,
  searchInputRef,
  onSearch,
  onClear,
  selectedVocations,
  setSelectedVocations,
  allVocations,
  selectedTypes,
  setSelectedTypes,
  allTypes,
  selectedElements,
  setSelectedElements,
  allElements,
  minLevel,
  setMinLevel,
  maxLevel,
  setMaxLevel,
  t,
}: TibiaFiltersProps) {
  return (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", gap: 8, width: "100%" }}>
        <InputText
          className="p-column-filter"
          defaultValue={searchToApply}
          ref={searchInputRef}
          placeholder={t("SEARCH_BY_NAME", { defaultMessage: "Search by name" })}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: "1rem", display: "flex", gap: 8, width: "100%" }}>
        <MultiSelect
          value={selectedTypes}
          options={allTypes}
          onChange={(e) => setSelectedTypes(e.value)}
          placeholder={t("Select Types", { defaultMessage: "Select Types" })}
          className="p-column-filter"
          display="chip"
          style={{ minWidth: "12rem" }}
        />
        <MultiSelect
          value={selectedVocations}
          options={allVocations}
          onChange={(e) => setSelectedVocations(e.value)}
          placeholder={t("Select Vocations", { defaultMessage: "Select Vocations" })}
          className="p-column-filter"
          display="chip"
          style={{ minWidth: "12rem" }}
        />
        <MultiSelect
          value={selectedElements}
          options={allElements}
          onChange={(e) => setSelectedElements(e.value)}
          placeholder={t("SELECT_ELEMENTS", { defaultMessage: "Select Elements" })}
          className="p-column-filter"
          display="chip"
          style={{ minWidth: "12rem" }}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: "12rem" }}>
          <InputNumber
            value={minLevel}
            onValueChange={(e) => setMinLevel(e.value ?? null)}
            placeholder={t("MIN_LEVEL", { defaultMessage: "Min Level" })}
            min={0}
            style={{ width: "100%" }}
          />
          <span>-</span>
          <InputNumber
            value={maxLevel}
            onValueChange={(e) => setMaxLevel(e.value ?? null)}
            placeholder={t("MAX_LEVEL", { defaultMessage: "Max Level" })}
            min={0}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div style={{ marginBottom: "1rem", display: "flex", gap: 8, width: "100%" }}>
        <Button
          icon="pi pi-search"
          label={t("FILTER", { defaultMessage: "Filter" })}
          onClick={onSearch}
          style={{ width: "100%", backgroundColor: "#FB993E", color: "#fff", border: "none" }}
        />
        <Button
          icon="pi pi-times"
          label={t("CLEAR", { defaultMessage: "Clear" })}
          onClick={onClear}
          style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #FB993E", color: "#FB993E" }}
        />
      </div>
    </>
  );
} 