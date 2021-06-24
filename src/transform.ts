import { Matrix4 } from "./matrix";
import { Vector3, Vector4 } from "./vector";

export class Transform {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    up: Vector3;
    right: Vector3;
    forward: Vector3;
    private worldViewMatrix: Matrix4;
    constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3, up?: Vector3, right?: Vector3, forward?: Vector3) {
        this.position = position ?? new Vector3();
        this.rotation = rotation ?? new Vector3();
        this.scale = scale ?? new Vector3(1, 1, 1);
        this.up = up ?? Vector3.up;
        this.right = right ?? Vector3.right;
        this.forward = forward ?? Vector3.forward;
    }
    reset(): void {
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);
    }
    rotate(angles: Vector3): void {
        this.rotation = Vector3.add(this.rotation, angles);
        //1. make rotation matrices
        //2. multiply direction vectors by the matrix
        this.computeDirectionVectors();
    }
    //TODO: make sure directions are computed only when needed, but always when needed
    computeDirectionVectors(): void {
        //1. make rotation matrices
        let rotationZMatrix = Matrix4.makeZRotation(this.rotation.z);
        let rotationYMatrix = Matrix4.makeYRotation(this.rotation.y);
        let rotationXMatrix = Matrix4.makeXRotation(this.rotation.x);

        let rotationMatrix = Matrix4.multiplyMatrices4(rotationYMatrix, rotationZMatrix);
        rotationMatrix = Matrix4.multiplyMatrices4(rotationXMatrix, rotationMatrix);
        //2. multiply direction vectors by the matrix
        this.up = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.up) as Vector3;
        this.forward = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.forward) as Vector3;
        this.right = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.right) as Vector3;
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
    translate(translation: Vector3): void {
        this.position = Vector3.add(this.position, translation);
    }
    computeWorldViewMatrix(viewProjectionMatrix: Matrix4): void {
        let transformMatrix = Matrix4.makeIdentity();
        let translationMatrix = Matrix4.makeTranslation(this.position.x, this.position.y, this.position.z);
        let XRotationMatrix = Matrix4.makeXRotation(this.rotation.x);
        let yRotationMatrix = Matrix4.makeYRotation(this.rotation.y);
        let zRotationMatrix = Matrix4.makeZRotation(this.rotation.z);
        let scaleMatrix = Matrix4.makeScale(this.scale.x, this.scale.y, this.scale.z);

        transformMatrix = Matrix4.multiplyMatrices4(translationMatrix, transformMatrix);
        transformMatrix = Matrix4.multiplyMatrices4(XRotationMatrix, transformMatrix);
        transformMatrix = Matrix4.multiplyMatrices4(yRotationMatrix, transformMatrix);
        transformMatrix = Matrix4.multiplyMatrices4(zRotationMatrix, transformMatrix);
        transformMatrix = Matrix4.multiplyMatrices4(scaleMatrix, transformMatrix);

        //worldMatrix = Matrix4.multiplyMatrices4(gameObject.transform.getTransformMatrix(), worldMatrix);

        this.worldViewMatrix = Matrix4.multiplyMatrices4(transformMatrix, viewProjectionMatrix);
    }
    getWorldViewMatrix(): Matrix4 {
        return this.worldViewMatrix;
    }
    lookAt(target: Vector3, up: Vector3): void {
        let lookAtMatrix = Matrix4.makeLookAtMatrix(this.position, target, Vector3.up);
        this.rotation = Matrix4.multiplyMatrix4ByVector4(lookAtMatrix, new Vector4(this.rotation.x, this.rotation.y, this.rotation.z)) as Vector3;
    }
}
