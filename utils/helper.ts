export class Helper {
    static async convertJsonToObject(path: string) {
        const decoder = new TextDecoder('utf-8');
        const file = await Deno.readFile(Deno.cwd() + path);

        return JSON.parse(decoder.decode(file));
    }
}