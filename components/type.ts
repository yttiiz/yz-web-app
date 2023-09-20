export type ComponentNameType = 'Body' | 'Header' | 'Main' | 'Footer';

export type ComponentType = {
    name: ComponentNameType;
    content: string;
};

type ItemType = {
    link: string;
    text: string;
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