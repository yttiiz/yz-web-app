import { AdminLoginHelper } from "../utils/AdminLoginHelper.js";
import { AdminProfilHelper } from "../utils/AdminProfilHelper.js";
import { AdminContentHelper } from "../utils/AdminContentHelper.js";

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
      AdminProfilHelper.profilHandler(buttons);
      
      // Init content page.
      AdminContentHelper.initContent();
      
    } else {  
      //==========| Login interface |==========//
      
      AdminLoginHelper.handleShowPassword();

      document.querySelector("form")
      .addEventListener("submit", AdminLoginHelper.loginHandler);
    }
  }
}