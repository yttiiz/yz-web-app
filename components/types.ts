export type ComponentNameType =
  | "Body"
  | "Header"
  | "Main"
  | "Footer"
  | "UserSvg";

export type ComponentType = {
  name: ComponentNameType;
  content: string;
};

type ItemType = {
  link: string;
  text: string;
};

type InputType = {
  type: string;
  placeholder?: string;
  name?: string;
  required?: string;
  value?: string;
  maxLength?: string;
  minLength?: string;
  accept?: string;
};

export type PageType = {
  title: string;
  description: string;
};

export type HeaderType = {
  logo: ItemType;
  items: ItemType[];
};

export type FooterType = {
  basicItems: ItemType[];
  relatedItems: ItemType[];
};

export type FormType = {
  title: string;
  action: string;
  content: InputType[];
};