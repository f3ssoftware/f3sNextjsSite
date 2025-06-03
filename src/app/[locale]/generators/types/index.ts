export interface GeneratorOption {
  key: string;
  label: string;
  icon: string;
  parent?: string;
  output?: any;
}

export interface GeneratorRow {
  selectedOption: GeneratorOption | null;
}

export interface GeneratorProps {
  onValueChange?: (value: any) => void;
}

export interface JsonViewProps {
  data: any[];
  onDataChange: (newData: any[]) => void;
  isEditMode: boolean;
  theme: 'default' | 'winter-is-coming';
  onThemeChange: (theme: 'default' | 'winter-is-coming') => void;
  onEditModeChange: (isEditMode: boolean) => void;
} 