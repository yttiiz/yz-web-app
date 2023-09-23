// deno-lint-ignore-file
export class PageBuilder {

  createHTMLElements(...elts) {
    const temp = [];
    for (const el of elts) {
      temp.push(document.createElement(el));
    }
    return temp;
  }

  setSameHTMLElementAttributes(attr, value, ...args) {
    if (args.length === 1) {
      value === true ? args[0].setAttribute(attr, "") : args[0][attr] = value;
      return;
    }

    for (const arg of args) {
      value === true ? arg.setAttribute(attr, "") : arg[attr] = value;
    }
  }

  insertChildren(root, ...children) {
    for (const child of children) {
      root.appendChild(child);
    }
  }
  
}
