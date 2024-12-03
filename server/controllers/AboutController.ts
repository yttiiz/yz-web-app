import { AboutService } from "@/server/services/about/AboutService.ts";
import { DefaultController } from "./DefaultController.ts";
import { RouterAppType } from "@controllers";

export class AboutController extends DefaultController {
	private service;

	constructor(router: RouterAppType) {
		super(router);
		this.service = new AboutService(this);
		this.getAbout();
	}

	private getAbout() {
		this.router?.get("/about", this.service.get);
	}
}
