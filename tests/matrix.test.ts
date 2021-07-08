import { Matrix4 } from "../src/Rendering/matrix"
import { Vector3, Vector4 } from "../src/Rendering/vector";



describe('Matrix4 operations:', function () {

    test('getElementAt', function () {
        let m = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        );
        expect(m.getElementAt(0, 0))
            .toBe(1);
        expect(m.getElementAt(0, 1))
            .toBe(5);
        expect(m.getElementAt(0, 2))
            .toBe(9);
        expect(m.getElementAt(0, 3))
            .toBe(13);
    });


    test('setElementAt', function () {
        let m = new Matrix4();

        m.setElementAt(0, 0, 99);
        m.setElementAt(0, 1, 1);
        m.setElementAt(0, 2, 2);
        m.setElementAt(0, 3, 3);

        m.setElementAt(3, 0, 66);
        m.setElementAt(3, 1, 31);
        m.setElementAt(3, 2, 32);
        m.setElementAt(3, 3, 33);

        expect(m.getElementAt(0, 0))
            .toBe(99);
        expect(m.getElementAt(0, 1))
            .toBe(1);
        expect(m.getElementAt(0, 2))
            .toBe(2);
        expect(m.getElementAt(0, 3))
            .toBe(3);

        expect(m.getElementAt(3, 0))
            .toBe(66);
        expect(m.getElementAt(3, 1))
            .toBe(31);
        expect(m.getElementAt(3, 2))
            .toBe(32);
        expect(m.getElementAt(3, 3))
            .toBe(33);
    });


    test('flatten', function () {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        let m = new Matrix4(...arr);
        expect(arr)
            .toEqual(m.flatten());
    });


    test('MakeIdentity', function () {
        let m = new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        expect(m)
            .toEqual(Matrix4.makeIdentity());
    });

    test('makeScale', function () {
        let xS = 1;
        let yS = 2;
        let zS = 3;

        let m = new Matrix4(
            xS, 0, 0, 0,
            0, yS, 0, 0,
            0, 0, zS, 0,
            0, 0, 0, 1
        );
        expect(m)
            .toEqual(Matrix4.makeScale(xS, yS, zS));
    });

    test('makeTranslation', function () {
        let xT = 1;
        let yT = 2;
        let zT = 3;

        let m = new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            xT, yT, zT, 1
        );
        expect(m)
            .toEqual(Matrix4.makeTranslation(xT, yT, zT));
    });

    test('makeXRotation', function () {
        let xRot = 1;

        let s = Math.sin(xRot);
        let c = Math.cos(xRot);

        let m = new Matrix4(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        );
        expect(m)
            .toEqual(Matrix4.makeXRotation(xRot));
    });


    test('makeYRotation', function () {
        let yRot = 1;

        let s = Math.sin(yRot);
        let c = Math.cos(yRot);

        let m = new Matrix4(
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        );
        expect(m)
            .toEqual(Matrix4.makeYRotation(yRot));
    });


    test('makeZRotation', function () {
        let zRot = 1;

        let s = Math.sin(zRot);
        let c = Math.cos(zRot);

        let m = new Matrix4(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        expect(m)
            .toEqual(Matrix4.makeZRotation(zRot));
    });

    test('makePerspective', function () {
        let fov = 1;
        let aspectRatio = 1920 / 1080;
        let zNear = 0.1;
        let zFar = 100;

        let f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        let rangeInv = 1.0 / (zNear - zFar);

        let m = new Matrix4(
            f / aspectRatio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (zNear + zFar) * rangeInv, -1,
            0, 0, (zNear * zFar * rangeInv * 2), 0);

        expect(m)
            .toEqual(Matrix4.makePerspective(fov, aspectRatio, zNear, zFar));
    });


    test('multiplyMatrix4ByVector4', function () {
        let m = Matrix4.makeScale(2, 3, 4);
        let v = new Vector4(1, 2, 3)

        expect(Matrix4.multiplyMatrix4ByVector4(m, v))
            .toEqual(new Vector4(2, 6, 12));
    });


    test('multiplyMatrices4', function () {
        let m1 = Matrix4.makeScale(1, 2, 3);
        let m2 = Matrix4.makeScale(4, 5, 6);
        let m3 = new Matrix4(
            4, 0, 0, 0,
            0, 10, 0, 0,
            0, 0, 18, 0,
            0, 0, 0, 1,

        );

        expect(Matrix4.multiplyMatrices4(m1, m2))
            .toEqual(m3);
    });


    test('transpose', function () {
        let m1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        );
        let m2 = Matrix4.transpose(m1);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                expect(m1.getElementAt(i, j))
                    .toEqual(m2.getElementAt(j, i));
            }
        }
    });


    test('copy', function () {
        let m1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        );
        let m2 = Matrix4.copy(m1);

        expect(m1)
            .toEqual(m2);
    });


    test('inverse', function () {
        let m = new Matrix4(
            1, 0, 0, 0,
            0, 2, 0, 0,
            0, 0, 3, 0,
            4, 5, 6, 1
        );
        let mi = new Matrix4(
            1, 0, 0, 0,
            0, 1 / 2, 0, 0,
            0, 0, 1 / 3, 0,
            -4, -5 / 2, -2, 1
        );

        expect(Matrix4.inverse(m))
            .toEqual(mi);
    });

});


