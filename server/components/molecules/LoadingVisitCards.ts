// deno-fmt-ignore-file
import {
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";

export const LoadingVisitCards: ComponentType<
  MoleculeNameType,
  () => string
> = {
	name: "LoadingVisitCards",
	html: () => (
		`<li>
      <figure>
        <img src="" alt="loading image"/>
      </figure>
      <div>
        <h3>Loading subtitle</h3>
        <p>Loading text</p>
        <a href="/" target="_blank">En savoir plus</a>
      </div>
    </li>`
    ),
};
