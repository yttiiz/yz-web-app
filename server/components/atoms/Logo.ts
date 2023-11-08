import { AtomNameType, ComponentType } from "../mod.ts";

export const Logo: ComponentType<AtomNameType> = {
  name: "Logo",
  html: `
  <svg
    width="1"
    height="1"
    viewBox="0 0 1 1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 0.5,0 A 0.5,0.5 0 0 0 0.23242188,0.08007812 c 0.0477879,0.07051292 0.12007477,0.1610904 0.23242187,0.2734375 C 0.5928823,0.29616801 0.75560207,0.26145971 0.9375,0.2578125 A 0.5,0.5 0 0 0 0.5,0 Z M 0.13671875,0.15820312 A 0.5,0.5 0 0 0 0,0.5 0.5,0.5 0 0 0 0.16601562,0.87109375 C 0.30190969,0.85093411 0.65497487,0.76970488 0.35546875,0.4765625 0.23116213,0.35489707 0.1675311,0.24621258 0.13671875,0.15820312 Z M 0.97070312,0.328125 C 0.81555211,0.34835842 0.6756412,0.39036032 0.5703125,0.45117188 0.78778313,0.65751988 0.81991136,0.7621344 0.81054688,0.890625 A 0.5,0.5 0 0 0 1,0.5 0.5,0.5 0 0 0 0.97070312,0.328125 Z" />
  </svg>`,
};
