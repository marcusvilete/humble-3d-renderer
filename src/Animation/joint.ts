import { Matrix4 } from "../Rendering/matrix";

export class Joint {
    id: number;
    name: string;
    children: Joint[];
    localBindMatrix: Matrix4; //original transform of this joint relative to parent("bone-space")
    inverseBindMatrix: Matrix4; // inverse of transform of this joint relative to origin("model-space"). This is so we move the joint to origin and then apply the new transformation
    animatedMatrix: Matrix4; // this is the matrix that actually gets sent to shader, this is calculated by the animator
    constructor(id: number, name: string, localBindMatrix: Matrix4, inverseBindMatrix: Matrix4) {
        this.id = id;
        this.name = name;
        this.localBindMatrix = localBindMatrix;
        this.inverseBindMatrix = inverseBindMatrix;
        this.animatedMatrix = Matrix4.multiplyMatrices4(inverseBindMatrix, localBindMatrix);
        
        //this.animatedMatrix = localBindMatrix;
        this.children = [];
    }

    /**
     * Call this once by the root joint after all joints are created.
     * @param parentMatrix When the joint is root, parent is the origin(or identity).
     */
    computeInverseBindMatrix(parentMatrix: Matrix4): void {
        let bindTransform = Matrix4.multiplyMatrices4(this.localBindMatrix, parentMatrix);
        this.inverseBindMatrix = Matrix4.inverse(bindTransform);

        this.children.forEach(joint => {
            joint.computeInverseBindMatrix(bindTransform);
        });
    }
}