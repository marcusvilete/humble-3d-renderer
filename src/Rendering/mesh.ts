import { Vector2, Vector3 } from "./vector"

export class Mesh {
    vertices: Vector3[];
    normals: Vector3[];
    uvCoords: Vector2[]; //lets say x is u and y is v, ok?
    scale: Vector3;
    translation: Vector3;
    rotation: Vector3;
    drawMode: DrawMode;
    bufferOffset: number;
    texture: WebGLTexture;
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.uvCoords = [];
        this.drawMode = DrawMode.Texture;
    };
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
