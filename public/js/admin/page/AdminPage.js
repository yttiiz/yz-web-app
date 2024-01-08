import { AdminFormHelper } from "../utils/AdminFormHelper.js";
import { AdminProfilHelper } from "../utils/AdminProfilHelper.js";

export class AdminPage {
  initForm = () => {
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
      const buttons = document.querySelectorAll("#user-session button[type=\"button\"]")
      AdminProfilHelper.profilHandler(buttons)
      
    } else {  
      //==========| Login interface |==========//
      
      document.querySelector("form")
      .addEventListener("submit", AdminFormHelper.loginHandler);
    }
  };
}