export type OrganismNameType = 
  | "Header"
  | "Main"
  | "Footer";
  
export type MoleculeNameType =
  | "DeleteAccount"
  | "DeleteAccountForm"
  | "Login"
  | "LogoutForm"
  | "NotFound";

export type AtomNameType =
  | "UserSvg"
  | "Logo"
  | "EyeOpenSvg"
  | "EyeShutSvg"
  | "CircleSvg"
  | "OnOffSvg"; 

export type ComponentType<
  T extends (OrganismNameType | MoleculeNameType | AtomNameType | "Body") = "Body" ,
  U extends (string | ((...args: unknown[]) => string)) = string
> = {
  name: T;
  html: U;
};

type ItemDataType = {
  link: string;
  text: string;
  className?: string;
};

type InformativeContentAndButtonType = {
  paragraph: string;
  btnText: string;
  btnLink?: string;
};

export type InputDataType = {
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

export type PageDataType = {
  title: string;
  description: string;
};

export type HeaderDataType = {
  logo: ItemDataType;
  items: ItemDataType[];
  login: ItemDataType[];
};

export type FooterDataType = {
  basicItems: ItemDataType[];
  relatedItems: ItemDataType[];
};

export type FormDataType = {
  title: string;
  action: string;
  method: string;
  content: InputDataType[];
  changePhoto?: string;
};

export type DeleteAccountDataType = {
  deleteAccount: InformativeContentAndButtonType & {
    title: string;
  };
  deleteModal: InformativeContentAndButtonType & {
    title: string;
    action: string;
    method: string;
  };
};

export type NotFoundDataType = InformativeContentAndButtonType & {
  title: string;
};
