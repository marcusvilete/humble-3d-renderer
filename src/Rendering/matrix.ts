import { Vector3, Vector4 } from "./vector"

//remember webGL is right-handed
/**
 * This is a 4 ROWS(horizontal) by 4 COLUMNS matrix
 * 
 * | r0c0  r0c1  r0c2  r0c3 | // row 0
 * | r1c0  r1c1  r1c2  r1c3 | // row 1
 * | r2c0  r2c1  r2c2  r2c3 | // row 2
 * | r3c0  r3c1  r3c2  r3c3 | // row 3
 * 
 * BUT, the way WEBGL expects matrix data is as a single array, and "column major".
 * 
 * So our matrix will be something like:
 * | r0c0  r1c0  r2c0  r3c0 | // col 0
 * | r0c1  r1c1  r2c1  r3c1 | // col 1
 * | r0c2  r1c2  r2c2  r3c2 | // col 2
 * | r0c3  r1c3  r2c3  r3c3 | // col 3
 * 
 * or, in a single array: 
 * 
 * [ r0c0,  r1c0,  r2c0,  r3c0, r0c1,  r1c1,  r2c1,  r3c1,  r0c2,  r1c2,  r2c2,  r3c2, r0c3  r1c3  r2c3  r3c3 ]
 */
export class Matrix4 {
    elements: number[]

    constructor(r0c0?: number, r0c1?: number, r0c2?: number, r0c3?: number,
        r1c0?: number, r1c1?: number, r1c2?: number, r1c3?: number,
        r2c0?: number, r2c1?: number, r2c2?: number, r2c3?: number,
        r3c0?: number, r3c1?: number, r3c2?: number, r3c3?: number) {
        this.elements = [
            r0c0 ?? 0, r0c1 ?? 0, r0c2 ?? 0, r0c3 ?? 0, // thats actually a column, not a row, but i call it row!
            r1c0 ?? 0, r1c1 ?? 0, r1c2 ?? 0, r1c3 ?? 0,
            r2c0 ?? 0, r2c1 ?? 0, r2c2 ?? 0, r2c3 ?? 0,
            r3c0 ?? 0, r3c1 ?? 0, r3c2 ?? 0, r3c3 ?? 0,
        ];
    }
    /**
     * Get elements from the matrix at a given position.
     * @param row Rows are zero based!
     * @param col Columns are zero based!
     * @returns The value at that position
     */
    getElementAt(row: number, col: number): number {
        return this.elements[(col * 4) + row];
    }
    /**
     * Set the value at a given position in the matrix
     * @param row Rows are zero based!
     * @param col Columns are zero based!
     * @param value The value to be set
     */
    setElementAt(row: number, col: number, value: number): void {
        this.elements[(col * 4) + row] = value;
    }
    flatten(): number[] {
        return this.elements;
    }

    /**
     * Identity matrix is the equivalent of the number "1" in matrices.
     * In the sense that if we multiply any matrix 'M'by an Identity matrix 'I', the result will be 'M'.
     * 
     * M * I = M
     * 
     * @returns The identity matrix
     */
    static makeIdentity(): Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
    }
    /**
     * Make a scale matrix
     * @param x scale in x
     * @param y scale in y
     * @param z scale in z
     * @returns The scale matrix
     */
    static makeScale(x: number, y: number, z: number): Matrix4 {
        return new Matrix4(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        );
    }
    /**
     * Make a translation matrix
     * @param x translation in x
     * @param y translation in y
     * @param z translation in z
     * @returns The translation matrix
     */
    static makeTranslation(x: number, y: number, z: number): Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        );
    }
    /**
     * Make a rotation in X axis matrix
     * @param angleInRadians rotation angle in radians!
     * @returns The rotation matrix
     */
    static makeXRotation(angleInRadians: number): Matrix4 {
        let sine = Math.sin(angleInRadians);
        let cosine = Math.cos(angleInRadians);

        return new Matrix4(
            1, 0, 0, 0,
            0, cosine, sine, 0,
            0, -sine, cosine, 0,
            0, 0, 0, 1
        );
    }
    /**
     * Make a rotation in Y axis matrix
     * @param angleInRadians rotation angle in radians!
     * @returns The rotation matrix
     */
    static makeYRotation(angleInRadians: number): Matrix4 {
        let sine = Math.sin(angleInRadians);
        let cosine = Math.cos(angleInRadians);

        return new Matrix4(
            cosine, 0, -sine, 0,
            0, 1, 0, 0,
            sine, 0, cosine, 0,
            0, 0, 0, 1
        );
    }
    /**
     * Make a rotation in Z axis matrix
     * @param angleInRadians rotation angle in radians!
     * @returns The rotation matrix
     */
    static makeZRotation(angleInRadians: number): Matrix4 {
        let sine = Math.sin(angleInRadians);
        let cosine = Math.cos(angleInRadians);

        return new Matrix4(
            cosine, sine, 0, 0,
            -sine, cosine, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }
    /**
     * Make a perspective matrix
     * @param fovInRadians Field of view angle, in radians!
     * @param aspectRatio width/height ratio
     * @param zNear The near z coordinate
     * @param zFar The far z coordinate
     * @returns 
     */
    static makePerspective(fovInRadians: number, aspectRatio: number, zNear: number, zFar: number): Matrix4 {
        // let f = Math.tan(fovInRadians / 2);

        // return new Matrix4(
        //     1 / (aspectRatio * f), 0, 0, 0,
        //     0, 1 / f, 0, 0,
        //     0, 0, zFar / (zFar - zNear), -(zFar * zNear) / (zFar - zNear),
        //     0, 0, 0, 1);
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fovInRadians);
        let rangeInv = 1.0 / (zNear - zFar);

        return new Matrix4(
            f / aspectRatio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (zNear + zFar) * rangeInv, -1,
            0, 0, (zNear * zFar * rangeInv * 2), 0);

    }

    static makeLookAtMatrix(position: Vector3, target: Vector3, up: Vector3): Matrix4 {
        let zAxis = Vector3.normalize(Vector3.subtract(position, target));
        let xAxis = Vector3.normalize(Vector3.vectorCrossProduct(up, zAxis));
        var yAxis = Vector3.normalize(Vector3.vectorCrossProduct(zAxis, xAxis));

        return new Matrix4(
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            position.x, position.y, position.z, 1
        );
    }

    /**
     * Make a view(camera) matrix
     * @param eye The eye/camera position
     * @param target The "look at target" (position + direction)
     * @param up The UP vector
     * @returns The view(camera) matrix
     */
    static makeViewMatrix(eye: Vector3, target: Vector3, up: Vector3): Matrix4 {
        //TODO: maybe use look at matrix here
        let forwardZ = Vector3.normalize(Vector3.subtract(eye, target));
        let rightX = Vector3.normalize(Vector3.vectorCrossProduct(up, forwardZ));
        let upY = Vector3.vectorCrossProduct(forwardZ, rightX);
        //this matrix is result of multiplying a translate with rotation(inverse of) matrix:

        // | 1  0  0  eyeX |     | x.x  y.x  z.x  0 |(Inverse)
        // | 0  1  0  eyeY |  *  | x.y  y.y  z.y  0 |
        // | 0  0  1  eyeZ |     | x.z  y.z  z.z  0 |
        // | 0  0  0   1   |     |  0    0    0   1 |

        //since it is an orthogonal matrix, to compute the inverse we just transpose:
        // | 1  0  0  eyeX |     | x.x  x.y  x.z  0 |(Inverse)
        // | 0  1  0  eyeY |  *  | y.x  y.y  y.z  0 |
        // | 0  0  1  eyeZ |     | z.x  z.y  z.z  0 |
        // | 0  0  0   1   |     |  0    0    0   1 |

        // | x.x  x.y  x.z  -dot(x, eye) |
        // | y.x  y.y  y.z  -dot(y, eye) |
        // | z.x  y.z  z.z  -dot(z, eye) |
        // |  0    0    0        1       |

        // return new Matrix4(
        //     rightX.x,     rightX.y,     rightX.z,   -Vector3.dotProduct(rightX, eye),
        //     upY.x,           upY.y,        upY.z,      -Vector3.dotProduct(upY, eye),
        //     forwardZ.x, forwardZ.y,   forwardZ.z, -Vector3.dotProduct(forwardZ, eye),
        //     0,                   0,            0,                                  1
        // );
        return new Matrix4(
            rightX.x, upY.x, forwardZ.x, 0,
            rightX.y, upY.y, forwardZ.y, 0,
            rightX.z, upY.z, forwardZ.z, 0,
            -Vector3.dotProduct(rightX, eye), -Vector3.dotProduct(upY, eye), -Vector3.dotProduct(forwardZ, eye), 1
        );


    }
    /**
     * Multiply a Vector by a Matrix.
     * Can be thought of as "applying a transformation" to a vector
     * @param m The matrix
     * @param v The vector
     * @returns Transformed vector
     */
    static multiplyMatrix4ByVector4(m: Matrix4, v: Vector4): Vector4 {
        return new Vector4(
            // v.x * m.getElementAt(0, 0) + v.y * m.getElementAt(1, 0) + v.z * m.getElementAt(2, 0) + v.w * m.getElementAt(3, 0),
            // v.x * m.getElementAt(0, 1) + v.y * m.getElementAt(1, 1) + v.z * m.getElementAt(2, 1) + v.w * m.getElementAt(3, 1),
            // v.x * m.getElementAt(0, 2) + v.y * m.getElementAt(1, 2) + v.z * m.getElementAt(2, 2) + v.w * m.getElementAt(3, 2),
            // v.x * m.getElementAt(0, 3) + v.y * m.getElementAt(1, 3) + v.z * m.getElementAt(2, 3) + v.w * m.getElementAt(3, 3),
            v.x * m.getElementAt(0, 0) + v.y * m.getElementAt(0, 1) + v.z * m.getElementAt(0, 2) + v.w * m.getElementAt(0, 3),
            v.x * m.getElementAt(1, 0) + v.y * m.getElementAt(1, 1) + v.z * m.getElementAt(1, 2) + v.w * m.getElementAt(1, 3),
            v.x * m.getElementAt(2, 0) + v.y * m.getElementAt(2, 1) + v.z * m.getElementAt(2, 2) + v.w * m.getElementAt(2, 3),
            v.x * m.getElementAt(3, 0) + v.y * m.getElementAt(3, 1) + v.z * m.getElementAt(3, 2) + v.w * m.getElementAt(3, 3),
        );
    }
    /**
     * Multiply two matrices.
     * Can be thought of as "accumulating matrices transformations"
     * @param a Some matrix
     * @param b Some other matrix
     * @returns Multiplied matrix
     */
    static multiplyMatrices4(a: Matrix4, b: Matrix4): Matrix4 {
        let multiplied = new Matrix4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let value = (b.getElementAt(i, 0) * a.getElementAt(0, j)) +
                    (b.getElementAt(i, 1) * a.getElementAt(1, j)) +
                    (b.getElementAt(i, 2) * a.getElementAt(2, j)) +
                    (b.getElementAt(i, 3) * a.getElementAt(3, j));
                multiplied.setElementAt(i, j, value);
            }
        }
        return multiplied;
    }
    /**
     * Transpose a matrix. 
     * Rows become columns and vice versa
     * @param m the matrix
     * @returns transposed matrix
     */
    static transpose(m: Matrix4): Matrix4 {
        let transposed = new Matrix4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                transposed.setElementAt(i, j, m.getElementAt(j, i));
            }
        }
        return transposed;
    }

    static copy(m: Matrix4): Matrix4 {
        let copied = new Matrix4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                copied.setElementAt(i, j, m.getElementAt(i, j));
            }
        }
        return copied;
    }

    static inverse(m: Matrix4): Matrix4 {
        //matrix inverse from https://webglfundamentals.org/
        //this.elements[(col * 4) + row];
        let m00 = m.getElementAt(0, 0);
        let m01 = m.getElementAt(1, 0);
        let m02 = m.getElementAt(2, 0);
        let m03 = m.getElementAt(3, 0);
        let m10 = m.getElementAt(0, 1);
        let m11 = m.getElementAt(1, 1);
        let m12 = m.getElementAt(2, 1);
        let m13 = m.getElementAt(3, 1);
        let m20 = m.getElementAt(0, 2);
        let m21 = m.getElementAt(1, 2);
        let m22 = m.getElementAt(2, 2);
        let m23 = m.getElementAt(3, 2);
        let m30 = m.getElementAt(0, 3);
        let m31 = m.getElementAt(1, 3);
        let m32 = m.getElementAt(2, 3);
        let m33 = m.getElementAt(3, 3);

        let tmp_0 = m22 * m33;
        let tmp_1 = m32 * m23;
        let tmp_2 = m12 * m33;
        let tmp_3 = m32 * m13;
        let tmp_4 = m12 * m23;
        let tmp_5 = m22 * m13;
        let tmp_6 = m02 * m33;
        let tmp_7 = m32 * m03;
        let tmp_8 = m02 * m23;
        let tmp_9 = m22 * m03;
        let tmp_10 = m02 * m13;
        let tmp_11 = m12 * m03;
        let tmp_12 = m20 * m31;
        let tmp_13 = m30 * m21;
        let tmp_14 = m10 * m31;
        let tmp_15 = m30 * m11;
        let tmp_16 = m10 * m21;
        let tmp_17 = m20 * m11;
        let tmp_18 = m00 * m31;
        let tmp_19 = m30 * m01;
        let tmp_20 = m00 * m21;
        let tmp_21 = m20 * m01;
        let tmp_22 = m00 * m11;
        let tmp_23 = m10 * m01;

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return new Matrix4(
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        );
    }
    static compose(translation: Vector3, scale: Vector3, quaternion: Vector4): Matrix4 {
        let result = Matrix4.makeIdentity();

        const x2 = quaternion.x + quaternion.x;
        const y2 = quaternion.y + quaternion.y;
        const z2 = quaternion.z + quaternion.z;

        const xx = quaternion.x * x2;
        const xy = quaternion.x * y2;
        const xz = quaternion.x * z2;

        const yy = quaternion.y * y2;
        const yz = quaternion.y * z2;
        const zz = quaternion.z * z2;

        const wx = quaternion.w * x2;
        const wy = quaternion.w * y2;
        const wz = quaternion.w * z2;

        result.elements[0] = (1 - (yy + zz)) * scale.x;
        result.elements[1] = (xy + wz) * scale.x;
        result.elements[2] = (xz - wy) * scale.x;
        result.elements[3] = 0;
    
        result.elements[4] = (xy - wz) * scale.y;
        result.elements[5] = (1 - (xx + zz)) * scale.y;
        result.elements[6] = (yz + wx) * scale.y;
        result.elements[7] = 0;
    
        result.elements[8] = (xz + wy) * scale.z;
        result.elements[9] = (yz - wx) * scale.z;
        result.elements[10] = (1 - (xx + yy)) * scale.z;
        result.elements[11] = 0;
    
        result.elements[12] = translation.x;
        result.elements[13] = translation.y;
        result.elements[14] = translation.z;
        result.elements[15] = 1;
        
        return result;
    }
    
}