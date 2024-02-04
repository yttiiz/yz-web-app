import {
  AdminLoginHelper,
  AdminProfilHelper,
  AdminContentHelper,
  insertPictureIn,
} from "../utils/mod.js";

export class AdminPage {
  init = () => {
    const section = document.querySelector("section");
    const dialogs = document.querySelectorAll("dialog");
      
    // Init close event dialog modals.
    for (const dialog of dialogs) {
      dialog.querySelector("button[data-close]")
      .addEventListener("click", () => {
        dialog.close();
      });

      if (dialog.dataset.hasOwnProperty("products")) {
        insertPictureIn(dialog);
      }
    }
    
    if (section.dataset.admin === "connected") {
      //==========| Dashboard interface |==========//
      
      // Init profil dialog modal.
      const buttons = document.querySelectorAll(
        "#user-session button[type=\"button\"]",
      );
      AdminProfilHelper.init(buttons);
      
      // Init content page & modal.
      AdminContentHelper.init();
      
    } else {  
      //==========| Login interface |==========//
      
      AdminLoginHelper.handleShowPassword();

      document.querySelector("form")
      .addEventListener("submit", AdminLoginHelper.loginHandler);
    }
  }
}