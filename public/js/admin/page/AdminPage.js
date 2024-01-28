import {
  AdminLoginHelper,
  AdminProfilHelper,
  AdminContentHelper
} from "../utils/mod.js";

export class AdminPage {
  init = () => {
    const section = document.querySelector("section");
    const dialog = document.querySelector("dialog");
      
    // Init close event dialog modal.
    dialog.querySelector("button[data-close]")
    .addEventListener("click", () => {
      dialog.close();
    });
    
    if (section.dataset.admin === "connected") {
      //==========| Dashboard interface |==========//
      
      // Init profil dialog modal.
      const buttons = document.querySelectorAll("#user-session button[type=\"button\"]");
      AdminProfilHelper.init(buttons);
      
      // Init content page.
      AdminContentHelper.init();
      
    } else {  
      //==========| Login interface |==========//
      
      AdminLoginHelper.handleShowPassword();

      document.querySelector("form")
      .addEventListener("submit", AdminLoginHelper.loginHandler);
    }
  }
}