export type TemplateNameType =
  | "Header"
  | "Main"
  | "Footer";

export type OrganismNameType =
  | "SectionAuthForm"
  | "SectionAdmin"
  | "SectionsProfilForm"
  | "SectionsBooking"
  | "SectionsProduct"
  | "SectionProductsHome"
  | "SectionErrorHome"
  | "BookingCard"
  | "AdminDashboard"
  | "ProductCard";

export type MoleculeNameType =
  | "BookingForm"
  | "BookingDetails"
  | "DeleteAccount"
  | "DeleteAccountForm"
  | "InputsForm"
  | "InputsGroupForm"
  | "HeaderNavigation"
  | "HeaderUserSession"
  | "HeaderAdminSession"
  | "TextAreaForm"
  | "Login"
  | "LogoutUserForm"
  | "LogoutAdminForm"
  | "ProductDetails"
  | "ProductFigure"
  | "RateStars"
  | "Dialog"
  | "ReviewsDetails"
  | "FormReview"
  | "FormAdmin"
  | "Text"
  | "NotFound"
  | "PicturesSlider";

export type AtomNameType =
  | "LikeSvg"
  | "ShareSvg"
  | "ShareForm"
  | "StarSvg"
  | "UserSvg"
  | "Logo"
  | "LoginRegister"
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

export type ItemDataType = {
  link: string;
  text: string;
  className?: string;
};

export type ItemDataTypeAndUserRelationship =
  ItemDataType & {
  isRelatedToUser: boolean;
};

export type TitleAndDescriptionType = {
  title: string;
  paragraph: string;
};

export type ButtonType = {
  btnText: string;
  btnLink?: string;
};

export type InformativeContentAndButtonType = (
  ButtonType &
  TitleAndDescriptionType
);

export type FormAttributesType = {
  action: string;
  method: string;
};

export type ProductDescriptionType = {
  type: string;
  area: string;
  rooms: string;
};

export type HomePageDataType = TitleAndDescriptionType;

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

export type OpenGraphDataType = {
  title: string;
  type: string;
  url: string;
  image: {
    url: string;
    type: string;
    width: string;
    height: string;
  };
};

export type HeadPageDataType = {
  title: string;
  description?: string;
  openGraph?: OpenGraphDataType;
};

export type HeaderDataType = {
  logo: ItemDataType;
  items: ItemDataTypeAndUserRelationship[];
  login: ItemDataType[];
};

export type FooterDataType = {
  basicItems: ItemDataType[];
  relatedItems: ItemDataType[];
  copyrights: string;
};

export type DialogDataType = {
  component?: string;
};

export type FormDataType = FormAttributesType & {
  title: string;
  content: InputDataType[];
  changePhoto?: string;
};

export type DeleteAccountDataType = {
  deleteAccount: InformativeContentAndButtonType;
  deleteModal: InformativeContentAndButtonType &
  FormAttributesType
};

export type CancelBookingFormType = 
  FormAttributesType & 
  Pick<ButtonType, "btnText">;

export type BookingCardDataType = {
  createdAtTitle: string;
  periodTitle: string;
  details: ProductDescriptionType;
  amount: string;
  cancelBookingForm: CancelBookingFormType;
};

export type BookingDataType = {
  title: string;
  card: BookingCardDataType;
};

export type ProductDataType = {
  images: {
    legend: string;
  };
  description: {
    title: string;
    infos: ProductDescriptionType;
  };
  booking: FormDataType;
  reviewsAndRate: {
    title: string;
    empty: string;
  };
  conditions: {
    title: string;
    content: string;
  };
  reviewForm: FormDataType;
};

export type NotFoundDataType = InformativeContentAndButtonType;
