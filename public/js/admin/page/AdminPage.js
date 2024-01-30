import {
  AdminLoginHelper,
  AdminProfilHelper,
  AdminContentHelper
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