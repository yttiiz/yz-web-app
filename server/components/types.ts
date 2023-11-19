export type TemplateNameType =
  | "Header"
  | "Main"
  | "Footer";

export type OrganismNameType =
  | "SectionAuthForm"
  | "SectionsProfilForm"
  | "SectionProduct"
  | "ProductsHome";

export type MoleculeNameType =
  | "DeleteAccount"
  | "DeleteAccountForm"
  | "InputsForm"
  | "Login"
  | "LogoutForm"
  | "NotFound"
  | "PicturesSlider";

export type AtomNameType =
  | "LikeSvg"
  | "ShareSvg"
  | "StarSvg"
  | "UserSvg"
  | "Logo"
  | "EyeOpenSvg"
  | "EyeShutSvg"
  | "CircleSvg"
  | "OnOffSvg";

export type ComponentType<
  T extends (
    | TemplateNameType
    | OrganismNameType
    | MoleculeNameType
    | AtomNameType
    | "Body"
  ) = "Body",
  U extends (
    | string
    | (<A>(...args: A[]) => string | Promise<string>)
  ) = string,
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
  title: string;
  paragraph: string;
  btnText: string;
  btnLink?: string;
};

export type HomePageDataType = Pick<
  InformativeContentAndButtonType,
  "title" | "paragraph"
>;

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

export type HeadPageDataType = {
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
  deleteAccount: InformativeContentAndButtonType;
  deleteModal: InformativeContentAndButtonType & {
    action: string;
    method: string;
  };
};

export type NotFoundDataType = InformativeContentAndButtonType;
