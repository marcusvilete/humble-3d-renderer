import { GameObject } from "./gameobject";
import { Matrix4 } from "./matrix";
import { Vector3 } from "./vector";

export class Renderer {
    private program: WebGLProgram;
    private context: WebGLRenderingContext;
    private vertexBuffer: WebGLBuffer;
    private normalBuffer: WebGLBuffer;
    private texCoordsBuffer: WebGLBuffer;

    private positionAttributeLocation: number;
    private texCoordsAttributeLocation: number;
    private normalsAttributeLocation: number;
    private worldViewMatrixUniformLocation: WebGLUniformLocation;
    private worldInverseTransposeMatrixLocation: WebGLUniformLocation;
    private reverseLightDirectionLocation: WebGLUniformLocation;

    constructor(context: WebGLRenderingContext, program: WebGLProgram) {
        this.context = context;
        this.program = program;
        //creating buffers
        this.vertexBuffer = this.context.createBuffer();
        this.normalBuffer = this.context.createBuffer();
        this.texCoordsBuffer = this.context.createBuffer();

        context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);

        this.positionAttributeLocation = context.getAttribLocation(program, "a_position");
        this.texCoordsAttributeLocation = context.getAttribLocation(program, "a_texcoord");
        this.normalsAttributeLocation = context.getAttribLocation(program, "a_normal");
        this.worldViewMatrixUniformLocation = context.getUniformLocation(program, "u_worldViewMatrix");
        this.worldInverseTransposeMatrixLocation = context.getUniformLocation(program, "u_worldInverseTransposeMatrix");
        this.reverseLightDirectionLocation = context.getUniformLocation(program, "u_reverseLightDirection");
    }
    getContext(): WebGLRenderingContext {
        return this.context;
    }
    loadTexture(img: HTMLImageElement): WebGLTexture {
        let texture = this.context.createTexture();
        this.context.bindTexture(this.context.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);

        // Upload the image into the texture.
        this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.context.RGBA, this.context.UNSIGNED_BYTE, img);
        this.context.generateMipmap(this.context.TEXTURE_2D);

        return texture;
    }
    bufferData(gameObjects: GameObject[]): void {
        let arrLen = 0;
        let arrIndex = 0;
        let vertexArr: Float32Array;
        let normalArr: Float32Array;
        let texCoordArr: Float32Array;
        //count vertices so we can initialize the array with a fixed len
        gameObjects.forEach(gameObj => {
            arrLen += gameObj.mesh.vertices.length * 3;
        });

        //lets "flatten" data single arrays
        vertexArr = new Float32Array(arrLen);
        gameObjects.forEach(gameObj => {
            gameObj.mesh.bufferOffset = arrIndex / 3;
            gameObj.mesh.vertices.forEach(vertex => {
                vertexArr[arrIndex++] = vertex.x;
                vertexArr[arrIndex++] = vertex.y;
                vertexArr[arrIndex++] = vertex.z;
            });
        });

        arrIndex = 0;
        normalArr = new Float32Array(arrLen);
        gameObjects.forEach(gameObj => {
            gameObj.mesh.normals.forEach(normal => {
                normalArr[arrIndex++] = normal.x;
                normalArr[arrIndex++] = normal.y;
                normalArr[arrIndex++] = normal.z;
            });
        });

        arrIndex = 0;
        texCoordArr = new Float32Array(arrLen);
        gameObjects.forEach(gameObj => {
            gameObj.mesh.uvCoords.forEach(texCoord => {
                texCoordArr[arrIndex++] = texCoord.x;
                texCoordArr[arrIndex++] = texCoord.y;
            });
        });

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, vertexArr, this.context.STATIC_DRAW);

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.texCoordsBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, texCoordArr, this.context.STATIC_DRAW);

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.normalBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, normalArr, this.context.STATIC_DRAW);
    }
    render(gameObjects: GameObject[]): void {
        // Tell WebGL how to convert from clip space to pixels
        this.context.viewport(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.useProgram(this.program);
        this.context.enable(this.context.CULL_FACE);
        this.context.enable(this.context.DEPTH_TEST);
        this.context.clearColor(0.5, 0.5, 0.5, 1);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        
        for (let i = 0; i < gameObjects.length; i++) {
            if (gameObjects[i].mesh === null) continue;

            //set uniforms
            this.context.uniformMatrix4fv(this.worldViewMatrixUniformLocation, false, gameObjects[i].transform.getWorldViewMatrix().flatten());
            let worldInverse = Matrix4.inverse(gameObjects[i].transform.getWorldMatrix());
            this.context.uniformMatrix4fv(this.worldInverseTransposeMatrixLocation, false, Matrix4.transpose(worldInverse).flatten());
            let reverseLightDirectionVector = Vector3.normalize(new Vector3(0.5, 0.7, 1));
            this.context.uniform3fv(
                this.reverseLightDirectionLocation,
                new Float32Array([
                    reverseLightDirectionVector.x,
                    reverseLightDirectionVector.y,
                    reverseLightDirectionVector.z])
            );

            //bind buffers
            this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);
            this.context.enableVertexAttribArray(this.positionAttributeLocation);
            //Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            this.context.vertexAttribPointer(
                this.positionAttributeLocation,
                3,          // we are passing 3 components per iteration
                this.context.FLOAT,   // the type of each component
                false,      // should normalize?
                0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
                0           // 0 = start at the beginning of the buffer
            );

            this.context.bindBuffer(this.context.ARRAY_BUFFER, this.texCoordsBuffer);
            this.context.enableVertexAttribArray(this.texCoordsAttributeLocation);
            this.context.vertexAttribPointer(
                this.texCoordsAttributeLocation,
                2,         // we are passing 2 components per iteration
                this.context.FLOAT,  // the type of each component
                false,     // should normalize?
                0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
                0          // 0 = start at the beginning of the buffer
            );

            this.context.bindBuffer(this.context.ARRAY_BUFFER, this.normalBuffer);
            this.context.enableVertexAttribArray(this.normalsAttributeLocation);
            this.context.vertexAttribPointer(
                this.normalsAttributeLocation,
                3,         // we are passing 3 components per iteration
                this.context.FLOAT,  // the type of each component
                false,     // should normalize?
                0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
                0          // 0 = start at the beginning of the buffer
            );
            this.context.activeTexture(this.context.TEXTURE0);
            this.context.bindTexture(this.context.TEXTURE_2D, gameObjects[i].mesh.texture);

            this.context.drawArrays(
                gameObjects[i].mesh.drawMode,
                gameObjects[i].mesh.bufferOffset,
                gameObjects[i].mesh.vertices.length
            );
        }
    }
}