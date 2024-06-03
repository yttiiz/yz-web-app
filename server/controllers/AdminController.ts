import { DefaultController } from "./DefaultController.ts";
import { dynamicRoutes } from "@dynamic-routes";
import { type RouterAppType, type RouterContextAppType } from "./mod.ts";
import { AdminService, LogService } from "@services";

export class AdminController extends DefaultController {
  private log;
  private service;

  constructor(router: RouterAppType) {
    super(router);
    this.log = new LogService(this);
    this.service = new AdminService(this);
    this.getAdmin();
    this.postAdminLogin();
    this.postAdminLogout();
    this.postCreateProduct();
    this.putUser();
    this.putProduct();
    this.putBooking();
    this.deleteUser();
    this.deleteProduct();
    this.deleteBooking();
  }

  private getAdmin() {
    this.router?.get("/admin", this.service.getAdminHandler);
  }

  private postAdminLogin() {
    this.router?.post("/admin", this.log.loginHandler);
  }

  private postAdminLogout() {
    this.router?.post("/admin-logout", this.log.logoutHandler);
  }

  private postCreateProduct() {
    this.router?.post(
      "/admin-create-product",
      this.service.createProductHandler,
    );
  }

  private putUser() {
    const userRoute = `/${dynamicRoutes.get("user")}:id`; // "/user/:id"

    this.router?.put(userRoute, this.service.putUserHandler);
  }

  private putProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.put(productRoute, this.service.putProductHandler);
  }

  private putBooking() {
    const bookingRoute = `/${dynamicRoutes.get("booking")}:id`; // "/booking/:id"

    this.router?.put(bookingRoute, this.service.putBookingHandler);
  }

  private deleteUser() {
    this.router?.delete("/user", async (ctx: RouterContextAppType<"/user">) => {
      return await this.service.deleteItem({
        ctx,
        collection: "users",
        identifier: "L'utilisateur",
      });
    });
  }

  private deleteProduct() {
    this.router?.delete(
      "/product",
      async (ctx: RouterContextAppType<"/product">) => {
        return await this.service.deleteItem({
          ctx,
          collection: "products",
          identifier: "L'appartement",
        });
      },
    );
  }

  private deleteBooking() {
    this.router?.delete(
      "/booking",
      async (ctx: RouterContextAppType<"/booking">) => {
        return await this.service.deleteItem({
          ctx,
          collection: "bookings",
          identifier: "La réservation de",
        });
      },
    );
  }
}
