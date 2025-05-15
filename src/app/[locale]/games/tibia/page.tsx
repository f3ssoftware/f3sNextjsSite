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

  const [selectedVocations, setSelectedVocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchToApply, setSearchToApply] = useState<string>("");
  const debouncedSearchName = useDebouncedValue(searchToApply, 300);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

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

  // Collect all unique elements from item_protections
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

  const vocationFilterElement = (
    <MultiSelect
      value={selectedVocations}
      options={allVocations}
      onChange={(e) => setSelectedVocations(e.value)}
      placeholder={t("Select Vocations", {
        defaultMessage: "Select Vocations",
      })}
      className="p-column-filter"
      display="chip"
      style={{ minWidth: "12rem" }}
    />
  );

  const typeFilterElement = (
    <MultiSelect
      value={selectedTypes}
      options={allTypes}
      onChange={(e) => setSelectedTypes(e.value)}
      placeholder={t("Select Types", { defaultMessage: "Select Types" })}
      className="p-column-filter"
      display="chip"
      style={{ minWidth: "12rem" }}
    />
  );

  const elementFilterElement = (
    <MultiSelect
      value={selectedElements}
      options={allElements}
      onChange={(e) => setSelectedElements(e.value)}
      placeholder={t("SELECT_ELEMENTS", { defaultMessage: "Select Elements" })}
      className="p-column-filter"
      display="chip"
      style={{ minWidth: "12rem" }}
    />
  );

  // Improved: AND logic, debounced search, locale-insensitive
  const filteredItems = useMemo(() => {
    const search = debouncedSearchName.trim().toLocaleLowerCase();
    return items.filter((item) => {
      // Name search
      const matchesName =
        !search || (item.item.name || "").toLocaleLowerCase().includes(search);
      // Type filter
      const matchesType =
        selectedTypes.length === 0 ? true : selectedTypes.includes(item.type);
      // Vocation filter
      const matchesVocation =
        selectedVocations.length === 0
          ? true
          : (item.item_vocations || []).some((voc: any) =>
              selectedVocations.includes(voc.vocation)
            );
      // Elemental protection filter
      const matchesElement =
        selectedElements.length === 0
          ? true
          : (item.item_protections || []).some((prot: any) =>
              selectedElements.includes(prot.element)
            );
      // Only return items that match ALL active filters
      return matchesName && matchesType && matchesVocation && matchesElement;
    });
  }, [items, debouncedSearchName, selectedTypes, selectedVocations, selectedElements]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  useEffect(() => {
    if (isSearching) {
      setIsSearching(false);
    }
  }, [debouncedSearchName]);

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
                defaultValue={searchToApply}
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
              {typeFilterElement}
              {vocationFilterElement}
              {elementFilterElement}
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
                onClick={() => {
                  setIsSearching(true);
                  setSearchToApply(searchInputRef.current?.value || "");
                }}
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
                onClick={() => {
                  if (searchInputRef.current) searchInputRef.current.value = "";
                  setSearchToApply("");
                }}
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
            >
              <Column
                field="type"
                header="Type"
                sortable
                
                showFilterMenu={false}
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
