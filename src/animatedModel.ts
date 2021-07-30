import { AnimatedModelRenderer } from "./Animation/animatedModelRenderer";
import { HumbleAnimation } from "./Animation/animation";
import { Animator } from "./Animation/animator";
import { Joint } from "./Animation/joint";
import { degToRad } from "./Etc/mathFunctions";
import { Camera } from "./Rendering/camera";
import { Matrix4 } from "./Rendering/matrix";
import { Transform } from "./Rendering/transform";
import { Vector3 } from "./Rendering/vector";

export class AnimatedModel {
    //mesh data
    //TODO: maybe turn all those arrays into a "mesh struct"?
    positions: WebGLBuffer;
    normals: WebGLBuffer;
    texCoords: WebGLBuffer;
    indices: WebGLBuffer; // attributes are going to be indexed(draw elements)
    indexCount: number;
    //skin data
    joints: WebGLBuffer; // joints that affects the vertices
    weights: WebGLBuffer;

    texture: WebGLTexture;
    boneTexture: WebGLTexture; //passing bone matrices as "data texture" to work around uniform limits in WEBGL

    rootJoint: Joint;
    jointCount: number;

    animator: Animator;
    renderer: AnimatedModelRenderer;
    transform: Transform;
    test = false;

    constructor(
        positions: Float32Array, normals: Float32Array, texCoords: Float32Array,
        indices: Uint16Array, joints: Uint8Array, weights: Float32Array, texture: WebGLTexture,
        rootJoint: Joint, jointCount: number, renderer: AnimatedModelRenderer) {
        this.renderer = renderer;
        let ctx = this.renderer.getContext();
        this.positions = ctx.createBuffer();
        this.normals = ctx.createBuffer();
        this.texCoords = ctx.createBuffer();
        this.indices = ctx.createBuffer();
        this.joints = ctx.createBuffer();
        this.weights = ctx.createBuffer();
        this.indexCount = indices.length;

        this.bufferData(this.indices, indices, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER);
        this.bufferData(this.positions, positions, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.normals, normals, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.texCoords, texCoords, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.joints, joints, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.weights, weights, WebGLRenderingContext.ARRAY_BUFFER);

        this.texture = texture ?? null;
        this.rootJoint = rootJoint ?? null;
        this.jointCount = jointCount ?? 0;
        //this.rootJoint.computeInverseBindMatrix(Matrix4.makeIdentity());
        this.animator = new Animator(this);

        this.transform = new Transform(
            new Vector3(0, 0, 0),
            new Vector3(degToRad(-45), 0, 0),
            new Vector3(1, 1, 1)
        );

        this.boneTexture = ctx.createTexture();
        ctx.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.boneTexture);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.NEAREST);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.NEAREST);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE);
    }

    private bufferData(buffer: WebGLBuffer, data: BufferSource, bufferType: number) {
        let ctx = this.renderer.getContext();
        ctx.bindBuffer(bufferType, buffer);
        ctx.bufferData(bufferType, data, WebGLRenderingContext.STATIC_DRAW);
    }

    //set, or reset an animation
    doAnimation(animation: HumbleAnimation) {
        this.animator.doAnimation(animation);
    }

    update(deltaTime: number, now: number) {
        let ctx = this.renderer.getContext();
        this.transform.updateLocalMatrix();
        this.transform.updateWorldMatrix();

        this.animator.update(deltaTime, now);
        let arr = new Float32Array(this.jointCount * 16);
        flattenJointMatrices(this.rootJoint);

        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);

        if (!this.test) {
            this.test = true;
            console.log("animatedModel: ", arr);
        }
        ctx.texImage2D(
            ctx.TEXTURE_2D, 0, ctx.RGBA, 4,
            this.jointCount, 0, ctx.RGBA, ctx.FLOAT, arr
        );


        function flattenJointMatrices(joint: Joint) {
            let offset = joint.id * 16;

            //let x = Matrix4.inverse(joint.localBindMatrix);

            //joint.animatedMatrix = Matrix4.multiplyMatrices4(x, joint.localBindMatrix);
            //joint.animatedMatrix = Matrix4.multiplyMatrices4(joint.animatedMatrix, joint.inverseBindMatrix);

            //joint.animatedMatrix = Matrix4.multiplyMatrices4(joint.inverseBindMatrix, joint.localBindMatrix);


            arr.set(joint.animatedMatrix.flatten(), offset);
            if (joint.children) {
                joint.children.forEach(child => {
                    flattenJointMatrices(child);
                });
            }
        }
        //console.log("Translation: ", this.rootJoint.animatedMatrix.elements[12], this.rootJoint.animatedMatrix.elements[13], this.rootJoint.animatedMatrix.elements[14]);

    }
    render(camera: Camera) {
        this.renderer.render(camera, this);
    }
}