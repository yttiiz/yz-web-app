import { AdminFormHelper } from "../utils/AdminFormHelper.js";

export class AdminForm {
  initForm = () => {
    const section = document.querySelector("section");
    
    if (section.dataset.admin === "connected") {
      // Admin dashboard interface
      
    } else {  
      // Login interface
      const dialog = document.querySelector("dialog");
      
      // Init close event dialog modal.
      dialog.querySelector("button[data-close]")
      .addEventListener("click", () => {
        dialog.close();
      });
      
      document.querySelector("form")
      .addEventListener("submit", AdminFormHelper.loginHandler);
    }
  };
}