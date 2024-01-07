import { AdminFormHelper } from "../utils/AdminFormHelper.js";

export class AdminForm {
  initForm = () => {
    const section = document.querySelector("section");
    
    if (section.dataset.admin === "connected") {
      // Admin dashboard interface
      
    } else {  
      // Login interface
      document.querySelector("form")
      .addEventListener("submit", AdminFormHelper.loginHandler);
    }
  };
}