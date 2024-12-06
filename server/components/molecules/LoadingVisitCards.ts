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
	html: () => {
    let content = "";
    
    for (let i = 0; i < 4; i++) {
      content += `
      <li class="loader">
        <div></div>
        <div>
          <h3>&nbsp;</h3>
          <p>&nbsp;</p>
          <span>&nbsp;</span>
        </div>
      </li>`;
    }

    return content;
  }
};
