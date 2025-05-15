import { useState, useMemo, useRef } from "react";
import useDebouncedValue from "./useDebouncedValue";

export interface TibiaItem {
  name: string;
  min_level: number;
  type: string;
  item_vocations?: any[];
  item_protections?: any[];
  item_bonus_skills?: any[];
  [key: string]: any;
}

export function useTibiaItemFilters(items: TibiaItem[], t: (key: string, opts?: any) => string) {
  const [selectedVocations, setSelectedVocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchToApply, setSearchToApply] = useState<string>("");
  const debouncedSearchName = useDebouncedValue(searchToApply, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [minLevel, setMinLevel] = useState<number | null>(8);
  const [maxLevel, setMaxLevel] = useState<number | null>(null);

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

  const filteredItems = useMemo(() => {
    const search = debouncedSearchName.trim().toLocaleLowerCase();
    return items.filter((item) => {
      const matchesName =
        !search || (item.name || "").toLocaleLowerCase().includes(search);
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
        (item.min_level ?? 0) >= min && (item.min_level ?? 0) <= max;
      return (
        matchesName &&
        matchesType &&
        matchesVocation &&
        matchesElement &&
        matchesLevel
      );
    });
  }, [items, debouncedSearchName, selectedTypes, selectedVocations, selectedElements, minLevel, maxLevel]);

  return {
    filteredItems,
    selectedVocations,
    setSelectedVocations,
    selectedTypes,
    setSelectedTypes,
    searchToApply,
    setSearchToApply,
    searchInputRef,
    selectedElements,
    setSelectedElements,
    minLevel,
    setMinLevel,
    maxLevel,
    setMaxLevel,
    allVocations,
    allTypes,
    allElements,
  };
} 