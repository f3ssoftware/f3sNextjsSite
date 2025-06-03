import { useState, useEffect } from 'react';
import { GeneratorOption, GeneratorRow } from '../types';

const generatorOptions: GeneratorOption[] = [
  {
    key: '1.1',
    label: 'Address Generator',
    icon: 'pi pi-map-marker',
    parent: 'Location'
  },
  {
    key: '2.1',
    label: 'UUID Generator',
    icon: 'pi pi-hashtag',
    parent: 'Identification'
  },
  {
    key: '2.2',
    label: 'Password Generator',
    icon: 'pi pi-lock',
    parent: 'Security'
  }
];

export const useGenerators = () => {
  const [rows, setRows] = useState<GeneratorRow[]>([{ selectedOption: null }]);
  const [filteredOptions, setFilteredOptions] = useState<GeneratorOption[]>(generatorOptions);
  const [jsonView, setJsonView] = useState<any>({});

  useEffect(() => {
    setJsonView(rows.map((row) => row.selectedOption?.output));
  }, [rows]);

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
}; 