import * as layers from '../components/mod.ts';
import {
    RouterAppType,
    PageDataIdType,
    AuthPathType,
    RouterContextAppType
} from "./mod.ts";

export class DefaultController {
    router

    constructor(router: RouterAppType) {
        this.router = router
    }

    #file(kind: layers.ComponentNameType): string {
        if (kind === 'Body') {
            return layers.Body.content;
        }

        return layers[kind].content;
    }

    protected createComponents(...args: layers.ComponentNameType[]) {
        const components = [];

        for (const arg of args) {
            components.push(this.#file(arg));
        }

        return components;
    }

    protected response<T extends AuthPathType>(
        ctx: RouterContextAppType<T>,
        data: unknown
    ) {
        typeof data === 'string'
        ? ctx.response.body = data
        : ctx.response.body = JSON.stringify(data);
        
        ctx.response.status = 200;
    }

    protected createHtmlFile(id: PageDataIdType, title?: string) {
        let [page, header, main, footer] = this.createComponents('Body', 'Header', 'Main', 'Footer')

        title
        ? page = page.replace('</title>', ' ' + title + '</title>')
        : null;

        main = main.replace("{{ id }}", id);

        const content = '\n' + header + '\n' + main + '\n' + footer + '\n';
        page = page.replace('{{ application-content }}', content);

        return page;
    }
}