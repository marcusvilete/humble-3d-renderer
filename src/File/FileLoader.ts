import { ObjParser } from "./ObjFile";

export class FileLoader {
    
    static async loadOBJ(url: string) {
        let text = await this.loadText(url);
        return ObjParser.parse(text);
    }

    static async loadText(url: string) {
        let response = await fetch(url);
        return response.text();
    }

    static async loadJson<T>(url: string) {
        let response = await fetch(url);
        return response.json() as Promise<T>;
    }

    static async loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.addEventListener('load', () => {
                resolve(img);
            });
            img.src = url;
        });
    }
}