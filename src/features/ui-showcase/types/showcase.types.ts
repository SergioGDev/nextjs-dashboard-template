export interface PropDoc {
  prop: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface SubnavItem {
  label: string;
  href: string;
  group?: string;
  disabled?: boolean;
}

export interface AnatomyPart {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}
