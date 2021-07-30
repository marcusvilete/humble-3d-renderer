import { lerp } from "../Etc/mathFunctions";

//TODO: add functions to do math in place?
export class Vector2 {
    x: number;
    y: number;
    /**
    * 
    * @param x If not supplied, defaults to 0
    * @param y If not supplied, defaults to 0
    */
    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
    /**
     * 
     * The magnitude of a vector can be thought of the hypotenuse 
     * 
     * of the triangle formed by the x and y components.
     *        
     *           
     *                 /| 
     *                / | 
     *               /  | 
     *          |v| /   | y 
     *             /    | 
     *            /_____|
     *                x 
     * 
     * @param v The Vector
     * @returns The length(magnitude) of the vector
     */
    static magnitude(v: Vector2): number {
        return Math.sqrt((v.x * v.x) + (v.y * v.y));
    }
    /**
     * Compute the unit vector for a given vector.
     * 
     * @param v The vector
     * @returns A new unit vector
     */
    static normalize(v: Vector2): Vector2 {
        let len = Vector2.magnitude(v);
        if (len > 0) {
            return Vector2.divide(v, len);
        } else {
            return new Vector2(0, 0);
        }
    }
    /**
     * Simple vector addition. 
     * Just add each component of both vectors together.
     * 
     * @param a First vector
     * @param b Second Vector
     * @returns Result vector from a + b
     */
    static add(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(
            a.x + b.x,
            a.y + b.y);
    }
    /**
    * Simple vector subtraction. 
    * Just subtract each component of both vectors together.
    * 
    * @param a First vector
    * @param b Second Vector
    * @returns Result vector from a - b
    */
    static subtract(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(
            a.x - b.x,
            a.y - b.y);
    }
    /**
     * Multiply each vector component by a scalar factor.
     * Can be thought of scaling a vector by a factor.
     * 
     * @param v The vector
     * @param scalar The scaling factor
     * @returns New scaled vector
     */
    static multiply(v: Vector2, scalar: number): Vector2 {
        return new Vector2(
            v.x * scalar,
            v.y * scalar);
    }
    /**
     * Divide each vector component by a scalar factor.
     * Can be thought of "inverse" of scaling a vector by a factor.
     * 
     * @param v The vector
     * @param scalar The "inverse" scaling factor
     * @returns New scaled vector
     */
    static divide(v: Vector2, scalar: number): Vector2 {
        if (scalar !== 0) {
            return new Vector2(
                v.x / scalar,
                v.y / scalar);
        } else {
            console.error("Can't divide by zero, Vector2 was not divided!")
            return v;
        }
    }
    /**
     * Can be thought of as "how aligned are two vectors".
     * 
     * Or like a projection(or the sadow) of a vector into another
     * 
     * of the triangle formed by the x and y components.
     * 
     *               
     *               
     *              Y|     B
     *               |     /|
     *               |    / | 
     *               |   /  |
     *               |  /   |
     *               | /    |
     *               |/     |
     *               |------>A.B---------->A
     *               |----------------------->	
     *                                        X
     * 
     * 
     * @param a Some vector
     * @param b Some other vector
     * @returns The result of the dot product
     */
    static dotProduct(a: Vector2, b: Vector2): number {
        return (a.x * b.x) + (a.y * b.y);
    }
}

//TODO: add functions to do math in place?
export class Vector3 extends Vector2 {
    z: number;
    /**
     * 
     * @param x If not supplied, defaults to 0
     * @param y If not supplied, defaults to 0
     * @param z If not supplied, defaults to 0
     */
    constructor(x?: number, y?: number, z?: number) {
        super(x ?? 0, y ?? 0);
        this.z = z ?? 0;
    }
    static zero: Vector3 = new Vector3(0, 0, 0);
    static forward: Vector3 = new Vector3(0, 0, -1);
    static backward: Vector3 = new Vector3(0, 0, 1);
    static up: Vector3 = new Vector3(0, 1, 0);
    static down: Vector3 = new Vector3(0, -1, 0);
    static left: Vector3 = new Vector3(-1, 0, 0);
    static right: Vector3 = new Vector3(1, 0, 0);

    /**
     *
     * Short explanation: same as vector2 magnitude, but with 3 components:
     * 
     * |v|² = x²+ y² + z²
     * 
     * Long explanation:
     * 
     *                          TOP-VIEW                         SIDE-VIEW
     *                              /|                               /|   
     *                             / |                              / |   
     *                            /  |                             /  |   
     *       "projection" of z   /   | z                      |v| /   | y 
     *                          /    |                           /    | 
     *                         /_____|                          /_____|
     *                            x                         "projection" of z
     *
     *
     *    ("projection" of z)²  = x² + z²
     *
     *      |v|² = ("projection" of z)² + y²
     *      |v|² = x²+ y² + z²
     * 
     * 
     * 
     * 
     * 
     * @param v The Vector
     * @returns The length(magnitude) of the vector
     */
    static magnitude(v: Vector3): number {
        return Math.sqrt((v.x * v.x) + (v.y * v.y) + (v.z * v.z));
    }
    /**
     * Compute the unit vector for a given vector.
     * 
     * @param v The vector
     * @returns A new unit vector
     */
    static normalize(v: Vector3): Vector3 {
        let len = Vector3.magnitude(v);
        if (len > 0) {
            return Vector3.divide(v, len);
        } else {
            return new Vector3(0, 0, 0);
        }
    }
    /**
     * Simple vector addition. 
     * Just add each component of both vectors together.
     * 
     * @param a First vector
     * @param b Second Vector
     * @returns Result vector from a + b
     */
    static add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z);
    }
    /**
     * Simple vector subtraction. 
     * Just subtract each component of both vectors together.
     * 
     * @param a First vector
     * @param b Second Vector
     * @returns Result vector from a - b
     */
    static subtract(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z);
    }
    /**
     * Multiply each vector component by a scalar factor.
     * Can be thought of scaling a vector by a factor.
     * 
     * @param v The vector
     * @param scalar The scaling factor
     * @returns New scaled vector
     */
    static multiply(v: Vector3, scalar: number): Vector3 {
        return new Vector3(
            v.x * scalar,
            v.y * scalar,
            v.z * scalar
        );
    }
    /**
     * Divide each vector component by a scalar factor.
     * Can be thought of "inverse" of scaling a vector by a factor.
     * 
     * @param v The vector
     * @param scalar The "inverse" scaling factor
     * @returns New scaled vector
     */
    static divide(v: Vector3, scalar: number): Vector3 {
        if (scalar !== 0) {
            return new Vector3(
                v.x / scalar,
                v.y / scalar,
                v.z / scalar
            );
        } else {
            console.error("Can't divide by zero, Vector3 was not divided!");
            return v;
        }
    }
    /**
     * Can be thought of as "how aligned are two vectors".
     * 
     * Or like a projection(or the sadow) of a vector into another
     * 
     * of the triangle formed by the x and y components.
     * 
     *               
     *               
     *              Y|     B
     *               |     /|
     *               |    / | 
     *               |   /  |
     *               |  /   |
     *               | /    |
     *               |/     |
     *               |------>A.B---------->A
     *               |----------------------->	
     *                                        X
     * 
     * PS.: compare 2D and 3D vector magnitude comments to clarify how the third component(z) affects the calculation
     * 
     * 
     * @param a Some vector
     * @param b Some other vector
     * @returns The result of the dot product
     */
    static dotProduct(a: Vector3, b: Vector3): number {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }
    /**
     * Computes the cross product between two vectors.
     * The result of a cross product is a third vector which is orthogonal(90º) to A and B
     * It can be thought of computing the normal vector to a plane described by A and B
     * 
     * @param a Some vector
     * @param b Some other vector
     * @returns A new orthogonal vector to A and B
     */
    static vectorCrossProduct(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            (a.y * b.z) - (a.z * b.y),
            (a.z * b.x) - (a.x * b.z),
            (a.x * b.y) - (a.y * b.x)
        );
    }
    static interpolate(a: Vector3, b: Vector3, step: number): Vector3 {
        let x = lerp(a.x, b.x, step);
        let y = lerp(a.y, b.y, step);
        let z = lerp(a.z, b.z, step);

        return new Vector3(x, y, z);
    }
}

export class Vector4 extends Vector3 {
    w: number;
    /**
     * 
     * @param x If not supplied, defaults to 0
     * @param y If not supplied, defaults to 0
     * @param z If not supplied, defaults to 0
     * @param w If not supplied, defaults to 1
     */
    constructor(x?: number, y?: number, z?: number, w?: number) {
        super(x ?? 0, y ?? 0, z ?? 0);
        this.w = w ?? 1;
    }
    static forward: Vector4 = new Vector4(0, 0, -1, 1);
    static backward: Vector4 = new Vector4(0, 0, 1, 1);
    static up: Vector4 = new Vector4(0, 1, 0, 1);
    static down: Vector4 = new Vector4(0, -1, 0, 1);
    static left: Vector4 = new Vector4(-1, 0, 0, 1);
    static right: Vector4 = new Vector4(1, 0, 0, 1);
}