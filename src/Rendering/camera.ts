import { Matrix4 } from "./matrix";
import { Transform } from "./transform";

//TODO: this camera class can only represent a perspective camera...
//      make so we can represent other types(like ortho?) of cameras...
//      maybe, create specialized types extending this 'base' camera?
export class Camera {
    transform: Transform;
    fieldOfView: number;
    aspectRatio: number;
    near: number;
    far: number;
    private perspectiveMatrix: Matrix4;
    private static activeCamera: Camera = null;
    constructor(fieldOfView: number, aspectRatio: number, near: number, far: number) {
        this.fieldOfView = fieldOfView;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
        this.transform = new Transform();

        if (Camera.getActiveCamera() === null) {
            Camera.setActiveCamera(this);
        }
    }
    computePerspectiveMatrix(): void {
        this.perspectiveMatrix = Matrix4.makePerspective(
            this.fieldOfView,
            this.aspectRatio,
            this.near,
            this.far
        );
    }
    getPerspectiveMatrix(): Matrix4 {
        return this.perspectiveMatrix;
    }
    static getActiveCamera(): Camera {
        return Camera.activeCamera;
    }
    static setActiveCamera(camera: Camera): void {
        Camera.activeCamera = camera;
    }
}

