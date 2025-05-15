"use client";
import { PrimeReactProvider } from "primereact/api";
import GameNews from "../components/GameNews";
import GameFilter from "../components/GameFilter";
import "./tibia.css";
import NavigationBredCrumb from "@/app/shared/NavigationBredCrumb";
import { useTibiaItems } from "../hooks/useTibiaItems";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useEffect, useState, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function GamesTibia() {
  const { items, isLoading, error } = useTibiaItems();
  const t = useTranslations();

  // Applied filter state
  const [selectedVocations, setSelectedVocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchToApply, setSearchToApply] = useState<string>("");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [minLevel, setMinLevel] = useState<number | null>(null);
  const [maxLevel, setMaxLevel] = useState<number | null>(null);

  // Pending filter state (UI inputs)
  const [pendingVocations, setPendingVocations] = useState<string[]>([]);
  const [pendingTypes, setPendingTypes] = useState<string[]>([]);
  const [pendingSearch, setPendingSearch] = useState<string>("");
  const [pendingElements, setPendingElements] = useState<string[]>([]);
  const [pendingMinLevel, setPendingMinLevel] = useState<number | null>(null);
  const [pendingMaxLevel, setPendingMaxLevel] = useState<number | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allVocations = useMemo(
    () =>
      Array.from(
        new Set(
          items.flatMap((item) =>
            (item.item_vocations || []).map((voc: any) => voc.vocation)
          )
        )
      )
        .filter((voc) => voc && voc !== "")
        .map((voc) => ({
          label: t(voc, { defaultMessage: voc }),
          value: voc,
        })),
    [items, t]
  );

  const allTypes = useMemo(
    () =>
      Array.from(new Set(items.map((item) => item.type)))
        .filter((type) => type && type !== "")
        .map((type) => ({
          label: t(type, { defaultMessage: type }),
          value: type,
        })),
    [items, t]
  );

  const allElements = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .flatMap((item) =>
              (item.item_protections || []).map((prot: any) => prot.element)
            )
            .filter((el) => el && el !== "")
        )
      ).map((el) => ({
        label: t(el, { defaultMessage: el }),
        value: el,
      })),
    [items, t]
  );

  // Filtering logic uses only the applied state
  const filteredItems = useMemo(() => {
    const search = searchToApply.trim().toLocaleLowerCase();
    return items.filter((item) => {
      const matchesName =
        !search || (item.item.name || "").toLocaleLowerCase().includes(search);
      const matchesType =
        selectedTypes.length === 0 ? true : selectedTypes.includes(item.type);
      const matchesVocation =
        selectedVocations.length === 0
          ? true
          : (item.item_vocations || []).some((voc: any) =>
              selectedVocations.includes(voc.vocation)
            );
      const matchesElement =
        selectedElements.length === 0
          ? true
          : (item.item_protections || []).some((prot: any) =>
              selectedElements.includes(prot.element)
            );
      const min = minLevel ?? -Infinity;
      const max = maxLevel ?? Infinity;
      const matchesLevel =
        (item.item.min_level ?? 0) >= min && (item.item.min_level ?? 0) <= max;
      return matchesName && matchesType && matchesVocation && matchesElement && matchesLevel;
    });
  }, [items, searchToApply, selectedTypes, selectedVocations, selectedElements, minLevel, maxLevel]);

  // Handlers for Filter and Clear
  const handleFilter = () => {
    setIsSearching(true);
    setSearchToApply(pendingSearch);
    setSelectedTypes(pendingTypes);
    setSelectedVocations(pendingVocations);
    setSelectedElements(pendingElements);
    setMinLevel(pendingMinLevel);
    setMaxLevel(pendingMaxLevel);
  };
  const handleClear = () => {
    setPendingSearch("");
    setPendingTypes([]);
    setPendingVocations([]);
    setPendingElements([]);
    setPendingMinLevel(null);
    setPendingMaxLevel(null);
    setSearchToApply("");
    setSelectedTypes([]);
    setSelectedVocations([]);
    setSelectedElements([]);
    setMinLevel(null);
    setMaxLevel(null);
    if (searchInputRef.current) searchInputRef.current.value = "";
  };

  useEffect(() => {
    if (isSearching) {
      setIsSearching(false);
    }
  }, [searchToApply, selectedTypes, selectedVocations, selectedElements, minLevel, maxLevel]);

  return (
    <PrimeReactProvider>
      <section className="tibia">
        <NavigationBredCrumb />
        <div className="tibia-container">
          <h1>Tibia</h1>
          <h2 style={{ marginTop: "2rem" }}>Tibia Items</h2>
          <div>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                gap: 8,
                width: "100%",
              }}
            >
              <InputText
                className="p-column-filter"
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value)}
                ref={searchInputRef}
                placeholder={t("SEARCH_BY_NAME", {
                  defaultMessage: "Search by name",
                })}
                style={{ width: "100%" }}
              />
            </div>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                gap: 8,
                width: "100%",
              }}
            >
              <MultiSelect
                value={pendingTypes}
                options={allTypes}
                onChange={(e) => setPendingTypes(e.value)}
                placeholder={t("Select Types", { defaultMessage: "Select Types" })}
                className="p-column-filter"
                display="chip"
                style={{ minWidth: "12rem" }}
              />
              <MultiSelect
                value={pendingVocations}
                options={allVocations}
                onChange={(e) => setPendingVocations(e.value)}
                placeholder={t("Select Vocations", { defaultMessage: "Select Vocations" })}
                className="p-column-filter"
                display="chip"
                style={{ minWidth: "12rem" }}
              />
              <MultiSelect
                value={pendingElements}
                options={allElements}
                onChange={(e) => setPendingElements(e.value)}
                placeholder={t("SELECT_ELEMENTS", { defaultMessage: "Select Elements" })}
                className="p-column-filter"
                display="chip"
                style={{ minWidth: "12rem" }}
              />
            </div>
            <div
              style={{ display: "flex", gap: 8, alignItems: "center", minWidth: "12rem", marginBottom: "1rem" }}
            >
              <InputNumber
                value={typeof pendingMinLevel === 'number' ? pendingMinLevel : null}
                onValueChange={(e) => {
                  if (e.value !== pendingMinLevel) setPendingMinLevel(e.value ?? null);
                }}
                placeholder={t("MIN_LEVEL", { defaultMessage: "Min Level" })}
                min={1}
                style={{ width: "100%" }}
              />
              <span>-</span>
              <InputNumber
                value={typeof pendingMaxLevel === 'number' ? pendingMaxLevel : null}
                onValueChange={(e) => {
                  if (e.value !== pendingMaxLevel) setPendingMaxLevel(e.value ?? null);
                }}
                placeholder={t("MAX_LEVEL", { defaultMessage: "Max Level" })}
                min={pendingMinLevel ?? 0}
                style={{ width: "100%" }}
              />
            </div>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                gap: 8,
                width: "100%",
              }}
            >
              <Button
                icon="pi pi-search"
                label={t("FILTER", { defaultMessage: "Filter" })}
                onClick={handleFilter}
                style={{
                  width: "100%",
                  backgroundColor: "#FB993E",
                  color: "#fff",
                  border: "none",
                }}
              />
              <Button
                icon="pi pi-times"
                label={t("CLEAR", { defaultMessage: "Clear" })}
                onClick={handleClear}
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "2px solid #FB993E",
                  color: "#FB993E",
                }}
              />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            {(isLoading || isSearching) && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(255,255,255,0.7)",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProgressSpinner style={{ width: 50, height: 50 }} />
              </div>
            )}
            <TreeTable
              value={filteredItems.map((item, i) => ({
                key: i.toString(),
                data: item,
                children: [],
              }))}
              tableStyle={{ minWidth: "50rem" }}
              scrollable
              scrollHeight="600px"
            >
              <Column
                field="type"
                header="Type"
                sortable
                showFilterMenu={false}
                body={(rowData) => t(rowData.data.type, { defaultMessage: rowData.data.type })}
              ></Column>
              <Column
                field="item.name"
                header="Name"
                
                sortable
              ></Column>
              <Column field="item.weight" header="Weight" sortable></Column>
              <Column field="item.atk" header="Atk" sortable></Column>
              <Column field="item.def" header="Def" sortable></Column>
              <Column field="item.def_mod" header="Def Mod" sortable></Column>
              <Column
                field="item.imbuement_slots"
                header="Imbuement Slots"
              ></Column>
              <Column
                field="item.tier"
                header="Tier"
                sortable
              ></Column>
              <Column
                field="item.min_level"
                header="Min Level"
                sortable
              ></Column>
              <Column
                field="item_protections"
                header="Protections"
                body={(rowData) => {
                  const protections = rowData.data.item_protections || [];
                  if (!protections.length) return "-";
                  return protections
                    .map((prot: any) => `${prot.element}: ${prot.value}`)
                    .join(", ");
                }}
              ></Column>
              <Column
                field="item_bonus_skills"
                header="Bonus Skills"
                body={(rowData) => {
                  const skills = rowData.data.item_bonus_skills || [];
                  if (!skills.length) return "-";
                  return skills
                    .map((skill: any) => `${skill.skill}: ${skill.value}`)
                    .join(", ");
                }}
              ></Column>
              <Column
                field="item_vocations"
                header="Vocations"
                body={(rowData) => {
                  return rowData.data.item_vocations
                    .map((voc: any) =>
                      t(voc.vocation, { defaultMessage: voc.vocation })
                    )
                    .join(", ");
                }}
                
                showFilterMenu={false}
              ></Column>
            </TreeTable>
          </div>
          {error && <div style={{ color: "red" }}>Error: {error}</div>}
        </div>
      </section>
    </PrimeReactProvider>
  );
}
