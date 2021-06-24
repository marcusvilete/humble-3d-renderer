import { Vector2, Vector3, Vector4 } from "./vector"

export class Mesh {
    vertices: Vector3[];
    faces: Face[];
    uvCoords: Vector2[]; //lets say x is u and y is v, ok?
    scale: Vector3;
    translation: Vector3;
    rotation: Vector3;
    color: Vector4;
    drawMode: DrawMode;
    flattenedVertices: Float32Array;
    flattenedFaces: Uint8Array;
    flattenedColors: Uint8Array;
    flattenedTexCoords: Float32Array;

    constructor(vertices?: Vector3[], faces?: Face[], color?: Vector4, drawMode?: DrawMode) {
        this.vertices = vertices ?? null;
        this.faces = faces ?? null;
        this.color = color ?? new Vector4(0, 255, 0, 255);
        this.drawMode = drawMode ?? DrawMode.Wireframe;
    };

    getVertexCount(): number {
        return this.vertices.length * 3;
    }

    loadMeshFromFile(file: string): void {
        //TODO: implement this
    }
    loadTextureFromFile(file: string): void {
        //TODO: implement this
    }

    flattenFacesArray(): Uint8Array {
        if (!this.flattenedFaces) {
            let arraySize = this.faces.length * 3;
            let arr = new Array<number>(arraySize);
            let arrIndex = 0;
            for (let i = 0; i < this.faces.length; i++) {
                arr[arrIndex++] = this.faces[i].a;
                arr[arrIndex++] = this.faces[i].b;
                arr[arrIndex++] = this.faces[i].c;
            }
            this.flattenedFaces = new Uint8Array(arr);
        }
        return this.flattenedFaces;
    }
    flattenPositionArray(): Float32Array {
        if (!this.flattenedVertices) {
            let arraySize = this.vertices.length * 3;
            let arr = new Array<number>(arraySize);
            let arrIndex = 0;
            for (let i = 0; i < this.vertices.length; i++) {
                arr[arrIndex++] = this.vertices[i].x;
                arr[arrIndex++] = this.vertices[i].y;
                arr[arrIndex++] = this.vertices[i].z;
            }
            this.flattenedVertices = new Float32Array(arr);
        }
        return this.flattenedVertices;
    }
    flattenColorArray(): Uint8Array {
        if (!this.flattenedColors) {
            let arraySize = this.vertices.length * 4;
            let arr = new Array<number>(arraySize);

            let arrIndex = 0;
            for (let i = 0; i < this.vertices.length; i++) {
                arr[arrIndex++] = this.color.x; //R
                arr[arrIndex++] = this.color.y; //G
                arr[arrIndex++] = this.color.z; //B
                arr[arrIndex++] = this.color.w; //A
            }
            this.flattenedColors = new Uint8Array(arr);
        }

        return this.flattenedColors;
    }
    flattenTexCoords(): Float32Array {
        if (!this.flattenedTexCoords) {
            let arraySize = this.uvCoords.length * 2;
            let arr = new Array<number>(arraySize);
            let arrIndex = 0;
            for (let i = 0; i < this.uvCoords.length; i++) {
                arr[arrIndex++] = this.uvCoords[i].x;
                arr[arrIndex++] = this.uvCoords[i].y;
            }
            this.flattenedTexCoords = new Float32Array(arr);
        }
        return this.flattenedTexCoords;
    }
}

export class Face {
    a: number;
    b: number;
    c: number;

    constructor(a: number, b: number, c: number) {
        this.a = a;
        this.b = b;
        this.c = c;
    };
}

export enum DrawMode {
    Point = WebGLRenderingContext.POINTS,
    Wireframe = WebGLRenderingContext.LINE_STRIP,
    SolidColor = WebGLRenderingContext.TRIANGLES,
    Texture = WebGLRenderingContext.TRIANGLES
}