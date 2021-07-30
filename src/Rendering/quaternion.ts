import { lerp } from "../Etc/mathFunctions";
import { Matrix4 } from "./matrix";
import { Vector3, Vector4 } from "./vector";

//Quaternions are a way to represent rotation
//for future reference: 
// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/
// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
// https://www.youtube.com/watch?v=d4EgbgTm0Bg
export class Quaternion {
    //TODO: im scared of Quaternions!
    // i might come back here later(maybe rework the rotation part at transform?), but for now we can:
    // - create a quaternion from a matrix
    // - create a rotation matrix from a quaternion
    // - interpolate between quaternions(since it is easier to interpolate rotations this way!)
    
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.normalize();
    }
    normalize(): void {
        //vector-like normalization...
        //find the "vector" magnitude, then divide by magnitude
        const magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));

        if (magnitude > 0) {
            this.x /= magnitude;
            this.y /= magnitude;
            this.z /= magnitude;
            this.w /= magnitude;
        }
    }
    /**
     * Convert from quaternion to a rotation matrix
     * @returns 
     */
    toMatrix4(): Matrix4 {
        let m = Matrix4.makeIdentity();
        const xx = this.x * this.x;
        const xy = this.x * this.y;
        const xz = this.x * this.z;
        const xw = this.x * this.w;

        const yy = this.y * this.y;
        const yz = this.y * this.z;
        const yw = this.y * this.w;

        const zz = this.z * this.z;
        const zw = this.z * this.w;

        m = new Matrix4(
            (1 - 2 * (yy + zz)), (2 * (xy - zw)), (2 * (xz + yw)), 0,
            (2 * (xy + zw)), (1 - 2 * (xx + zz)), (2 * (yz - xw)), 0,
            (2 * (xz - yw)), (2 * (yz + xw)), (1 - 2 * (xx + yy)), 0,
            0, 0, 0, 1,
        );

        return m;
    };


    /**
     * Extracts rotation components from a matrix 4x4
     * @param m 
     * @returns 
     */
    static fromMatrix4(m: Matrix4): Quaternion {
        let x: number;
        let y: number;
        let z: number;
        let w: number;

        const diagonal = m.getElementAt(0, 0) + m.getElementAt(1, 1) + m.getElementAt(2, 2);
        if (diagonal > 0) {
            let w4 = (Math.sqrt(diagonal + 1) * 2);
            x = (m.getElementAt(2, 1) - m.getElementAt(1, 2)) / w4;
            y = (m.getElementAt(0, 2) - m.getElementAt(2, 0)) / w4;
            z = (m.getElementAt(1, 0) - m.getElementAt(0, 1)) / w4;
            w = w4 / 4;
        } else if ((m.getElementAt(0, 0) > m.getElementAt(1, 1)) && (m.getElementAt(0, 0) > m.getElementAt(2, 2))) {
            const x4 = (Math.sqrt(1 + m.getElementAt(0, 0) - m.getElementAt(1, 1) - m.getElementAt(2, 2)) * 2);
            x = x4 / 4;
            y = (m.getElementAt(0, 1) + m.getElementAt(1, 0)) / x4;
            z = (m.getElementAt(0, 2) + m.getElementAt(2, 0)) / x4;
            w = (m.getElementAt(2, 1) - m.getElementAt(1, 2)) / x4;
        } else if (m.getElementAt(1, 1) > m.getElementAt(2, 2)) {
            const y4 = (Math.sqrt(1 + m.getElementAt(1, 1) - m.getElementAt(0, 0) - m.getElementAt(2, 2)) * 2);
            x = (m.getElementAt(0, 1) + m.getElementAt(1, 0)) / y4;
            y = y4 / 4;
            z = (m.getElementAt(1, 2) + m.getElementAt(2, 1)) / y4;
            w = (m.getElementAt(0, 2) - m.getElementAt(2, 0)) / y4;
        } else {
            const z4 = (Math.sqrt(1 + m.getElementAt(2, 2) - m.getElementAt(0, 0) - m.getElementAt(1, 1)) * 2);
            x = (m.getElementAt(0, 2) + m.getElementAt(2, 0)) / z4;
            y = (m.getElementAt(1, 2) + m.getElementAt(2, 1)) / z4;
            z = z4 / 4;
            w = (m.getElementAt(1, 0) - m.getElementAt(0, 1)) / z4;
        }
        return new Quaternion(x, y, z, w);
    };

    /**
     * 
     * @param a 'from' parameter
     * @param b 'to' parameter
     * @param step step between 0 ~ 1. 0 returns a, 1 returns b, 0.5 returns the midpoint between a and b
     * @returns 
     */
    static interpolate(a: Quaternion, b: Quaternion, step: number): Quaternion {
        let q = new Quaternion(0, 0, 0, 1);
        //vector-like dot product
        const dotProduct = (a.x * b.x) + (a.y * b.y) + (a.z * b.z) + (a.w * b.w);

        if (dotProduct < 0) {
            q.x = lerp(a.x, -b.x, step);
            q.y = lerp(a.x, -b.y, step);
            q.z = lerp(a.x, -b.z, step);
            q.w = lerp(a.x, -b.w, step);
        } else {
            q.x = lerp(a.x, b.x, step);
            q.y = lerp(a.x, b.y, step);
            q.z = lerp(a.x, b.z, step);
            q.w = lerp(a.x, b.w, step);
        }
        q.normalize();
        return q;
    }

}