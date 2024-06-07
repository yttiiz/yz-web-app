import { DefaultController } from "./DefaultController.ts";
import { dynamicRoutes } from "@dynamic-routes";
import { type RouterAppType, type RouterContextAppType } from "./mod.ts";
import { AdminService, BookingService, LogService, ProductService } from "@services";

export class AdminController extends DefaultController {
  private logService;
  private adminService;
  private bookingService;
  private productService;

  constructor(router: RouterAppType) {
    super(router);
    this.logService = new LogService(this);
    this.adminService = new AdminService(this);
    this.bookingService = new BookingService(this);
    this.productService = new ProductService(this);
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
    this.router?.get("/admin", this.adminService.getAdminHandler);
  }

  private postAdminLogin() {
    this.router?.post("/admin", this.logService.loginHandler);
  }

  private postAdminLogout() {
    this.router?.post("/admin-logout", this.logService.logoutHandler);
  }

  private postCreateProduct() {
    this.router?.post(
      "/admin-create-product",
      this.productService.postCreate,
    );
  }

  private putUser() {
    const userRoute = `/${dynamicRoutes.get("user")}:id`; // "/user/:id"

    this.router?.put(userRoute, this.adminService.putUserHandler);
  }

  private putProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.put(productRoute, this.productService.putHandler);
  }

  private putBooking() {
    const bookingRoute = `/${dynamicRoutes.get("booking")}:id`; // "/booking/:id"

    this.router?.put(bookingRoute, this.bookingService.putHandler);
  }

  private deleteUser() {
    this.router?.delete("/user", async (ctx: RouterContextAppType<"/user">) => {
      return await this.adminService.deleteItem({
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
        return await this.adminService.deleteItem({
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
        return await this.adminService.deleteItem({
          ctx,
          collection: "bookings",
          identifier: "La réservation de",
        });
      },
    );
  }
}
