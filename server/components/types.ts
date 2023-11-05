export type ComponentNameType =
  | "Body"
  | "Header"
  | "Main"
  | "Footer"
  | "LogoutForm"
  | "Login"
  | "UserSvg"
  | "Logo"
  | "EyeOpenSvg"
  | "EyeShutSvg"
  | "OnOffSvg";

export type ComponentType = {
  name: ComponentNameType;
  content: string;
};

type ItemType = {
  link: string;
  text: string;
  className?: string;
};

type InformativeContentAndButtonType = {
  paragraph: string;
  btnText: string;
  btnLink?: string;
};

export type InputType = {
  type: string;
  label?: string;
  placeholder?: string;
  name?: string;
  required?: string;
  value?: string;
  maxLength?: string;
  minLength?: string;
  accept?: string;
  autocomplete?: string;
};

export type PageType = {
  title: string;
  description: string;
};

export type HeaderType = {
  logo: ItemType;
  items: ItemType[];
  login: ItemType[];
};

export type FooterType = {
  basicItems: ItemType[];
  relatedItems: ItemType[];
};

export type FormType = {
  title: string;
  action: string;
  method: string;
  content: InputType[];
  changePhoto?: string;
};

export type FormProfilType = FormType & {
  deleteAccount: InformativeContentAndButtonType & {
    title: string;
    action: string;
    method: string;
  }
};

export type NotFoundType = InformativeContentAndButtonType & {
  title: string;
};
