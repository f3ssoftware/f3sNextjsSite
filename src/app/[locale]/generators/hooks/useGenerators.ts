import { useState, useEffect, useMemo } from 'react';
import { GeneratorOption, GeneratorRow } from '../types';
import { useTranslations } from "next-intl";

export function useGenerators() {
  const t = useTranslations();
  const [rows, setRows] = useState<GeneratorRow[]>([{ selectedOption: null }]);
  const [jsonView, setJsonView] = useState<any>({});

  const generatorOptions: GeneratorOption[] = useMemo(() => [
    {
      key: '1.1',
      label: t('ADDRESS_GENERATOR'),
      icon: 'pi pi-map-marker',
      parent: t('LOCATION')
    },
    {
      key: '2.1',
      label: t('UUID_GENERATOR'),
      icon: 'pi pi-hashtag',
      parent: t('IDENTIFICATION')
    },
    {
      key: '2.2',
      label: t('PASSWORD_GENERATOR'),
      icon: 'pi pi-lock',
      parent: t('SECURITY')
    },
    {
      key: '2.3',
      label: t('USERNAME_GENERATOR'),
      icon: 'pi pi-user',
      parent: t('SECURITY')
    }
  ], [t]);

  const [filteredOptions, setFilteredOptions] = useState<GeneratorOption[]>(generatorOptions);

  useEffect(() => {
    setJsonView(rows.map((row) => row.selectedOption?.output));
  }, [rows]);

  useEffect(() => {
    setFilteredOptions(generatorOptions);
  }, [generatorOptions]);

  const addRow = () => {
    setRows((prev) => [...prev, { selectedOption: null }]);
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, selectedOption: GeneratorOption | null) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, selectedOption } : row
      )
    );
  };

  const updateRowOutput = (index: number, output: any) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index && row.selectedOption
          ? {
              ...row,
              selectedOption: { ...row.selectedOption, output },
            }
          : row
      )
    );
  };

  const reorderRows = (sourceIndex: number, destinationIndex: number) => {
    const items = Array.from(rows);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);
    setRows(items);
  };

  return {
    rows,
    filteredOptions,
    jsonView,
    setFilteredOptions,
    addRow,
    removeRow,
    updateRow,
    updateRowOutput,
    reorderRows,
  };
} 