import { FormHelper } from "./FormHelper.js";

// deno-lint-ignore-file
export class Builder {
  getAge(date) {
    return new Date(Date.now() - new Date(date).getTime())
      .getFullYear() - 1970;
  }

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

  submitHandler = async (e) => {
    e.preventDefault();

    const res = await fetch(e.target.action, {
      method: "POST",
      body: new FormData(e.target),
    });

    console.log(e.target.dataset);

    FormHelper.removeInputsValues(e.target.children);

    res.ok && res.status === 200
      ? FormHelper.showLoginDetails(res)
      : alert(data.error.msg);
  };
}
