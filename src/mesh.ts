import { Vector2, Vector3, Vector4 } from "./vector"

export class Mesh {
    vertices: Vector3[];
    normals: Vector3[];
    faces: Face[];
    uvCoords: Vector2[]; //lets say x is u and y is v, ok?
    scale: Vector3;
    translation: Vector3;
    rotation: Vector3;
    color: Vector4;
    drawMode: DrawMode;
    bufferOffset: number;
    texture: WebGLTexture;
    flattenedVertices: Float32Array;
    flattenedNormals: Float32Array;
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

    static loadMeshFromFile(file: string): Mesh {
        //TODO: implement this
        let cubeMesh = new Mesh();

        cubeMesh.vertices = [
            //back t1
            new Vector3(-0.5, -0.5, -0.5),
            new Vector3(-0.5, 0.5, -0.5),
            new Vector3(0.5, -0.5, -0.5),
            //back t2
            new Vector3(-0.5, 0.5, -0.5),
            new Vector3(0.5, 0.5, -0.5),
            new Vector3(0.5, -0.5, -0.5),

            //front t1
            new Vector3(-0.5, -0.5, 0.5),
            new Vector3(0.5, -0.5, 0.5),
            new Vector3(-0.5, 0.5, 0.5),
            //front t2
            new Vector3(-0.5, 0.5, 0.5),
            new Vector3(0.5, -0.5, 0.5),
            new Vector3(0.5, 0.5, 0.5),
            //top t1
            new Vector3(-0.5, 0.5, -0.5),
            new Vector3(-0.5, 0.5, 0.5),
            new Vector3(0.5, 0.5, -0.5),
            //top t2
            new Vector3(-0.5, 0.5, 0.5),
            new Vector3(0.5, 0.5, 0.5),
            new Vector3(0.5, 0.5, -0.5),
            //bot t1
            new Vector3(-0.5, -0.5, -0.5),
            new Vector3(0.5, -0.5, -0.5),
            new Vector3(-0.5, -0.5, 0.5),
            //bot t2
            new Vector3(-0.5, -0.5, 0.5),
            new Vector3(0.5, -0.5, -0.5),
            new Vector3(0.5, -0.5, 0.5),
            //left t1
            new Vector3(-0.5, -0.5, -0.5),
            new Vector3(-0.5, -0.5, 0.5),
            new Vector3(-0.5, 0.5, -0.5),
            //left t2
            new Vector3(-0.5, -0.5, 0.5),
            new Vector3(-0.5, 0.5, 0.5),
            new Vector3(-0.5, 0.5, -0.5),

            new Vector3(0.5, -0.5, -0.5),
            new Vector3(0.5, 0.5, -0.5),
            new Vector3(0.5, -0.5, 0.5),

            new Vector3(0.5, -0.5, 0.5),
            new Vector3(0.5, 0.5, -0.5),
            new Vector3(0.5, 0.5, 0.5),
        ];

        cubeMesh.normals = [
            //back
            new Vector3(0, 0, -1),
            new Vector3(0, 0, -1),
            new Vector3(0, 0, -1),
            //back
            new Vector3(0, 0, -1),
            new Vector3(0, 0, -1),
            new Vector3(0, 0, -1),
            //front
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
            //front
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
            //top
            new Vector3(0, 1, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 1, 0),
            //top
            new Vector3(0, 1, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 1, 0),
            //bot
            new Vector3(0, -1, 0),
            new Vector3(0, -1, 0),
            new Vector3(0, -1, 0),
            //bot
            new Vector3(0, -1, 0),
            new Vector3(0, -1, 0),
            new Vector3(0, -1, 0),
            //left
            new Vector3(-1, 0, 0),
            new Vector3(-1, 0, 0),
            new Vector3(-1, 0, 0),
            //left
            new Vector3(-1, 0, 0),
            new Vector3(-1, 0, 0),
            new Vector3(-1, 0, 0),
            //right
            new Vector3(1, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(1, 0, 0),
            //right
            new Vector3(1, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(1, 0, 0)
        ];

        cubeMesh.uvCoords = [
            new Vector2(0.662061, 0.986184),
            new Vector2(0.337939, 0.986184),
            new Vector2(0.662061, 0.517092),

            new Vector2(0.337939, 0.986184),
            new Vector2(0.337939, 0.517092),
            new Vector2(0.662061, 0.517092),

            new Vector2(0.337939, 0.013816),
            new Vector2(0.662061, 0.013816),
            new Vector2(0.337939, 0.482908),

            new Vector2(0.337939, 0.482908),
            new Vector2(0.662061, 0.013816),
            new Vector2(0.662061, 0.482908),

            new Vector2(0.337939, 0.986184),
            new Vector2(0.013816, 0.986184),
            new Vector2(0.337939, 0.517092),

            new Vector2(0.013816, 0.986184),
            new Vector2(0.013816, 0.517092),
            new Vector2(0.337939, 0.517092),

            new Vector2(0.662061, 0.986184),
            new Vector2(0.662061, 0.517092),
            new Vector2(0.986184, 0.986184),

            new Vector2(0.986184, 0.986184),
            new Vector2(0.662061, 0.517092),
            new Vector2(0.986184, 0.517092),

            new Vector2(0.013816, 0.013816),
            new Vector2(0.337939, 0.013816),
            new Vector2(0.013816, 0.482908),

            new Vector2(0.337939, 0.013816),
            new Vector2(0.337939, 0.482908),
            new Vector2(0.013816, 0.482908),

            new Vector2(0.986184, 0.013816),
            new Vector2(0.986184, 0.482908),
            new Vector2(0.662061, 0.013816),

            new Vector2(0.662061, 0.013816),
            new Vector2(0.986184, 0.482908),
            new Vector2(0.662061, 0.482908)
        ]

        cubeMesh.color = new Vector4(80, 70, 200, 255);
        cubeMesh.drawMode = DrawMode.SolidColor;

        return cubeMesh;

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
    flattenNormalsArray(): Float32Array {
        if (!this.flattenedNormals) {
            let arraySize = this.normals.length * 3;
            let arr = new Array<number>(arraySize);
            let arrIndex = 0;
            for (let i = 0; i < this.normals.length; i++) {
                arr[arrIndex++] = this.normals[i].x;
                arr[arrIndex++] = this.normals[i].y;
                arr[arrIndex++] = this.normals[i].z;
            }
            this.flattenedNormals = new Float32Array(arr);
        }
        return this.flattenedNormals;
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
