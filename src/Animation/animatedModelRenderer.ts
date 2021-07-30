import { AnimatedModel } from "../animatedModel";
import { Camera } from "../Rendering/camera";
import { Matrix4 } from "../Rendering/matrix";
import { Vector3, Vector4 } from "../Rendering/vector";

export class AnimatedModelRenderer {
    private program: WebGLProgram;
    private context: WebGLRenderingContext;

    private positionAttributeLocation: number;
    private texCoordsAttributeLocation: number;
    private normalsAttributeLocation: number;
    private jointsAttributeLocation: number;
    private weightsAttributeLocation: number;

    private worldMatrixUniformLocation: WebGLUniformLocation;
    private viewMatrixUniformLocation: WebGLUniformLocation;
    private projectionMatrixUniformLocation: WebGLUniformLocation;
    private worldInverseTransposeMatrixLocation: WebGLUniformLocation;
    private reverseLightDirectionLocation: WebGLUniformLocation;
    private jointTextureLocation: WebGLUniformLocation; // data as texture
    private jointCountLocation: WebGLUniformLocation;


    constructor(context: WebGLRenderingContext, program: WebGLProgram) {
        this.context = context;
        this.program = program;

        //context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);

        this.positionAttributeLocation = context.getAttribLocation(program, "a_position");
        this.texCoordsAttributeLocation = context.getAttribLocation(program, "a_texcoord");
        this.normalsAttributeLocation = context.getAttribLocation(program, "a_normal");
        this.jointsAttributeLocation = context.getAttribLocation(program, "a_joints");
        this.weightsAttributeLocation = context.getAttribLocation(program, "a_weights");

        this.worldMatrixUniformLocation = context.getUniformLocation(program, "u_worldMatrix");
        this.viewMatrixUniformLocation = context.getUniformLocation(program, "u_viewMatrix");
        this.projectionMatrixUniformLocation = context.getUniformLocation(program, "u_projectionMatrix");
        this.worldInverseTransposeMatrixLocation = context.getUniformLocation(program, "u_worldInverseTransposeMatrix");
        this.reverseLightDirectionLocation = context.getUniformLocation(program, "u_reverseLightDirection");

        this.jointTextureLocation = context.getUniformLocation(program, "u_jointTexture");
        this.jointCountLocation = context.getUniformLocation(program, "u_numJoints");
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
    loadTexture2(color: Vector4) {
        let texture = this.context.createTexture();
        this.context.bindTexture(this.context.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
        this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);

        // Upload the image into the texture.
        this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, 1, 1, 0, this.context.RGBA, this.context.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
        //this.context.generateMipmap(this.context.TEXTURE_2D);

        return texture;
    }
    clear() {
        this.context.clearColor(0.5, 0.5, 0.5, 1);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }
    render(camera: Camera, model: AnimatedModel): void {
        let projectionMatrix = camera.getPerspectiveMatrix();
        let viewMatrix = Matrix4.makeViewMatrix(
            camera.transform.position,
            Vector3.add(camera.transform.position, camera.transform.forward),
            Vector3.up);
        // Tell WebGL how to convert from clip space to pixels
        this.context.viewport(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.useProgram(this.program);
        this.context.enable(this.context.CULL_FACE);
        this.context.enable(this.context.DEPTH_TEST);

        //set uniforms
        this.context.uniform1i(this.jointTextureLocation, 1);  // texture unit 1
        this.context.uniform1f(this.jointCountLocation, model.jointCount);  // texture unit 1
        this.context.uniformMatrix4fv(this.worldMatrixUniformLocation, false, model.transform.getWorldMatrix().flatten());
        this.context.uniformMatrix4fv(this.projectionMatrixUniformLocation, false, projectionMatrix.flatten());
        this.context.uniformMatrix4fv(this.viewMatrixUniformLocation, false, viewMatrix.flatten());
        
        this.context.uniform1f(this.jointCountLocation, model.jointCount);
        let worldInverse = Matrix4.inverse(model.transform.getWorldMatrix());
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
        this.context.bindBuffer(this.context.ARRAY_BUFFER, model.positions);
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

        this.context.bindBuffer(this.context.ARRAY_BUFFER, model.texCoords);
        this.context.enableVertexAttribArray(this.texCoordsAttributeLocation);
        this.context.vertexAttribPointer(
            this.texCoordsAttributeLocation,
            2,         // we are passing 2 components per iteration
            this.context.FLOAT,  // the type of each component
            false,     // should normalize?
            0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
            0          // 0 = start at the beginning of the buffer
        );

        this.context.bindBuffer(this.context.ARRAY_BUFFER, model.normals);
        this.context.enableVertexAttribArray(this.normalsAttributeLocation);
        this.context.vertexAttribPointer(
            this.normalsAttributeLocation,
            3,         // we are passing 3 components per iteration
            this.context.FLOAT,  // the type of each component
            false,     // should normalize?
            0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
            0          // 0 = start at the beginning of the buffer
        );

        this.context.bindBuffer(this.context.ARRAY_BUFFER, model.joints);
        this.context.enableVertexAttribArray(this.jointsAttributeLocation);
        this.context.vertexAttribPointer(
            this.jointsAttributeLocation,
            4,         // we are passing 4 components per iteration
            this.context.UNSIGNED_BYTE,  // the type of each component
            false,     // should normalize?
            0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
            0          // 0 = start at the beginning of the buffer
        );

        this.context.bindBuffer(this.context.ARRAY_BUFFER, model.weights);
        this.context.enableVertexAttribArray(this.weightsAttributeLocation);
        this.context.vertexAttribPointer(
            this.weightsAttributeLocation,
            4,         // we are passing 4 components per iteration
            this.context.FLOAT,  // the type of each component
            false,     // should normalize?
            0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
            0          // 0 = start at the beginning of the buffer
        );



        this.context.activeTexture(this.context.TEXTURE0);
        this.context.bindTexture(this.context.TEXTURE_2D, model.texture);
        this.context.activeTexture(this.context.TEXTURE1);
        this.context.bindTexture(this.context.TEXTURE_2D, model.boneTexture);


        this.context.drawElements(
            WebGLRenderingContext.TRIANGLES,
            model.indexCount,
            this.context.UNSIGNED_SHORT,
            0
        );

    }
}
