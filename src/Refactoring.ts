import { Camera } from "./Rendering/camera";
import { Matrix4 } from "./Rendering/matrix";
import { Vector3, Vector4 } from "./Rendering/vector";

interface Node {
    transform: Transform;
    parent: Node;
    children: Node[];
    setParent(parent: Node): void;
    addChild(child: Node): void;
    updateTransforms(): void;
}

interface Renderer {
    render(model: Model): void;
    getContext(): WebGLRenderingContext;
}

abstract class BaseRenderer implements Renderer {
    private program: WebGLProgram;
    private context: WebGLRenderingContext;

    constructor(context: WebGLRenderingContext, program: WebGLProgram) {
        this.context = context;
        this.program = program;
    }
    abstract render(model: Model): void;
    getContext(): WebGLRenderingContext {
        return this.context;
    }
}

//TODO: implement renderers
class StaticRenderer extends BaseRenderer {
    render(model: StaticModel): void {

    }
}
class AnimatedRenderer extends BaseRenderer {
    render(model: AnimatedModel): void {

    }
}

abstract class BaseNode implements Node {
    transform: Transform;
    parent: Node;
    children: Node[];

    constructor() {
        this.transform = new Transform();
    }

    setParent(parent: Node): void {
        //remove this node from previous parent
        if (this.parent) {
            let index = this.parent.children.indexOf(this);
            if (index >= 0) {
                this.parent.children.splice(index, 1);
            }
        }

        // Add this node as child of the new parent
        if (parent) {
            parent.addChild(this);
        }
        this.parent = parent;
    }
    addChild(child: Node): void {
        this.children.push(child);
    }
    updateTransforms(): void {
        this.transform.updateLocalMatrix();

        if (this.parent) {
            let parentMatrix = this.parent.transform.getWorldMatrix();
            this.transform.updateWorldMatrix(parentMatrix);
        } else {
            this.transform.updateWorldMatrix();
        }

        this.children.forEach(child => {
            child.updateTransforms();
        });
    }
}

abstract class Model extends BaseNode {
    renderer: Renderer;

    constructor(renderer: Renderer) {
        super();
        this.renderer = renderer;
    }
    protected bufferData(buffer: WebGLBuffer, data: BufferSource, bufferType: number) {
        let ctx = this.renderer.getContext();
        ctx.bindBuffer(bufferType, buffer);
        ctx.bufferData(bufferType, data, WebGLRenderingContext.STATIC_DRAW);
    }
    render(): void {
        this.renderer.render(this);
    }
    abstract update(): void;
}

// Not going to implement this right now
class StaticModel extends Model {
    positions: WebGLBuffer;
    normals: WebGLBuffer;
    textureCoords: WebGLBuffer;
    indices: WebGLBuffer;

    constructor(positions: Float32Array, normals: Float32Array, textureCoords: Float32Array, indices: Uint16Array, renderer: Renderer) {
        super(renderer);
        let ctx = this.renderer.getContext();
        this.positions = ctx.createBuffer();
        this.normals = ctx.createBuffer();
        this.textureCoords = ctx.createBuffer();
        this.indices = ctx.createBuffer();

        this.bufferData(this.indices, indices, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER);
        this.bufferData(this.positions, positions, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.normals, normals, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.textureCoords, textureCoords, WebGLRenderingContext.ARRAY_BUFFER);
    }

    update(): void {

    }
}


class AnimatedModel extends Model {
    //buffers... maybe make all of those into a dictionary of <attrLocations, buffers> 
    positions: WebGLBuffer;
    normals: WebGLBuffer;
    textureCoords: WebGLBuffer;
    indices: WebGLBuffer;
    joints: WebGLBuffer
    weights: WebGLBuffer


    //skin data
    boneTexture: WebGLTexture
    rootJoint: Joint

    update(): void {
        //TODO: animate here

    }
}


class Transform {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    private _up: Vector3;
    private _right: Vector3;
    private _forward: Vector3;
    private shouldComputeDirections: boolean;
    private worldMatrix: Matrix4;
    private localMatrix: Matrix4;

    get up(): Vector3 {
        this.computeDirectionVectors();
        return this._up;
    }

    get right(): Vector3 {
        this.computeDirectionVectors();
        return this._right;
    }

    get forward(): Vector3 {
        this.computeDirectionVectors();
        return this._forward;
    }

    constructor() {
        this.reset();
    }

    reset(): void {
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);
    }

    computeDirectionVectors(): void {
        if (!this.shouldComputeDirections) return;

        //1. make rotation matrices
        let rotationZMatrix = Matrix4.makeZRotation(this.rotation.z);
        let rotationYMatrix = Matrix4.makeYRotation(this.rotation.y);
        let rotationXMatrix = Matrix4.makeXRotation(this.rotation.x);

        let rotationMatrix = Matrix4.multiplyMatrices4(rotationYMatrix, rotationZMatrix);
        rotationMatrix = Matrix4.multiplyMatrices4(rotationXMatrix, rotationMatrix);
        //2. multiply direction vectors by the matrix
        this._up = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.up) as Vector3;
        this._forward = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.forward) as Vector3;
        this._right = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.right) as Vector3;
        this.shouldComputeDirections = false;
    }

    translate(translation: Vector3): void {
        this.position = Vector3.add(this.position, translation);
    }

    rotate(angles: Vector3): void {
        this.rotation = Vector3.add(this.rotation, angles);
        this.shouldComputeDirections = true; //direction vectors will be computed lazily when needed
    }

    rotateAround(angles: number, target: Vector3, axis: Vector3): void {
        let rotateAroundMatrix = Matrix4.makeIdentity();

        let toTargetTranslationMatrix = Matrix4.makeTranslation(-target.x, -target.y, -target.z);
        let backInplaceMatrix = Matrix4.makeTranslation(target.x, target.y, target.z);

        let xRotationMatrix = Matrix4.makeXRotation(axis.x * angles);
        let yRotationMatrix = Matrix4.makeYRotation(axis.y * angles);
        let zRotationMatrix = Matrix4.makeZRotation(axis.z * angles);

        rotateAroundMatrix = Matrix4.multiplyMatrices4(backInplaceMatrix, rotateAroundMatrix);
        rotateAroundMatrix = Matrix4.multiplyMatrices4(zRotationMatrix, rotateAroundMatrix);
        rotateAroundMatrix = Matrix4.multiplyMatrices4(yRotationMatrix, rotateAroundMatrix);
        rotateAroundMatrix = Matrix4.multiplyMatrices4(xRotationMatrix, rotateAroundMatrix);
        rotateAroundMatrix = Matrix4.multiplyMatrices4(toTargetTranslationMatrix, rotateAroundMatrix);

        this.position = Matrix4.multiplyMatrix4ByVector4(rotateAroundMatrix, new Vector4(this.position.x, this.position.y, this.position.z)) as Vector3;

        //this.computeDirectionVectors();
    }

    updateLocalMatrix(): void {
        this.localMatrix = Matrix4.makeIdentity();
        let translationMatrix = Matrix4.makeTranslation(this.position.x, this.position.y, this.position.z);
        let XRotationMatrix = Matrix4.makeXRotation(this.rotation.x);
        let yRotationMatrix = Matrix4.makeYRotation(this.rotation.y);
        let zRotationMatrix = Matrix4.makeZRotation(this.rotation.z);
        let scaleMatrix = Matrix4.makeScale(this.scale.x, this.scale.y, this.scale.z);

        this.localMatrix = Matrix4.multiplyMatrices4(translationMatrix, this.localMatrix);
        this.localMatrix = Matrix4.multiplyMatrices4(XRotationMatrix, this.localMatrix);
        this.localMatrix = Matrix4.multiplyMatrices4(yRotationMatrix, this.localMatrix);
        this.localMatrix = Matrix4.multiplyMatrices4(zRotationMatrix, this.localMatrix);
        this.localMatrix = Matrix4.multiplyMatrices4(scaleMatrix, this.localMatrix);
    }

    updateWorldMatrix(parentMatrix?: Matrix4): void {
        if (parentMatrix)
            this.worldMatrix = Matrix4.multiplyMatrices4(this.localMatrix, parentMatrix);
        else
            this.worldMatrix = Matrix4.copy(this.localMatrix);
    }

    getWorldMatrix(): Matrix4 {
        return this.worldMatrix;
    }

    lookAt(target: Vector3, up: Vector3): void {
        let lookAtMatrix = Matrix4.makeLookAtMatrix(this.position, target, Vector3.up);
        this.rotation = Matrix4.multiplyMatrix4ByVector4(lookAtMatrix, new Vector4(this.rotation.x, this.rotation.y, this.rotation.z)) as Vector3;
    }
}


class Joint implements Node {
    transform: Transform;
    parent: Node;
    children: Node[];
    setParent(parent: Node): void {
        throw new Error("Method not implemented.");
    }
    addChild(child: Node): void {
        throw new Error("Method not implemented.");
    }
    updateTransforms(parent: Node): void {
        throw new Error("Method not implemented.");
    }
}


class Scene {
    activeCamera: Camera;
    globalLightDirection: Vector3;
    rootNodes: Node[];
    update(): void {
        //TODO: update local and world transforms
    }
    render(): void {
        //TODO: foreach node, render if it is renderable
        this.rootNodes.forEach(rootNode => {
            rootNode.updateTransforms(null);
        });
    }
}