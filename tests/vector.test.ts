import { Vector2, Vector3, Vector4 } from "../src/Rendering/vector"


describe('Vector2 operations:', function () {
    let v1 = new Vector2(3, 4);
    let v2 = new Vector2(4, 3);

    test('magnitude', function () {
        expect(Vector2.magnitude(v1))
            .toBe(5);
    });

    test('normalize', function () {
        expect(Vector2.normalize(v1))
            .toEqual(new Vector2(0.6, 0.8));
    });

    test('add', function () {
        expect(Vector2.add(v1, v2))
            .toEqual(new Vector2(7, 7));
    });

    test('subtract', function () {
        expect(Vector2.subtract(v1, v2))
            .toEqual(new Vector2(-1, 1));
    });
    test('multiply', function () {
        expect(Vector2.multiply(v1, 2))
            .toEqual(new Vector2(6, 8));
    });
    test('divide', function () {
        expect(Vector2.divide(v1, 2))
            .toEqual(new Vector2(1.5, 2));
    });
    test('dotProduct', function () {
        expect(Vector2.dotProduct(v1, v2))
            .toBe(24);
    });
});

describe('Vector3 operations:', function () {
    let v1 = new Vector3(3, 4, 0);
    let v2 = new Vector3(4, 3, 0);

    test('magnitude', function () {
        expect(Vector3.magnitude(v1))
            .toBe(5);
    });

    test('normalize', function () {
        expect(Vector3.normalize(v1))
            .toEqual(new Vector3(0.6, 0.8, 0));
    });

    test('add', function () {
        expect(Vector3.add(v1, v2))
            .toEqual(new Vector3(7, 7, 0));
    });

    test('subtract', function () {
        expect(Vector3.subtract(v1, v2))
            .toEqual(new Vector3(-1, 1, 0));
    });
    test('multiply', function () {
        expect(Vector3.multiply(v1, 2))
            .toEqual(new Vector3(6, 8, 0));
    });
    test('divide', function () {
        expect(Vector3.divide(v1, 2))
            .toEqual(new Vector3(1.5, 2, 0));
    });
    test('dotProduct', function () {
        expect(Vector3.dotProduct(v1, v2))
            .toBe(24);
    });
    test('vectorCrossProduct', function () {
        expect(Vector3.vectorCrossProduct(v1, v2))
            .toEqual(new Vector3(0, 0, -7));
    });
});

// describe('Vector4 operations:', function () {
//     let v1 = new Vector4(3, 4, 0, 0);
//     let v2 = new Vector4(4, 3, 0, 0);

//     test('magnitude', function () {
//         expect(Vector4.magnitude(v1))
//             .toBe(5);
//     });

//     test('normalize', function () {
//         expect(Vector4.normalize(v1))
//             .toEqual(new Vector4(0.6, 0.8, 0, 0));
//     });

//     test('add', function () {
//         expect(Vector4.add(v1, v2))
//             .toEqual(new Vector4(7, 7, 0, 0));
//     });

//     test('subtract', function () {
//         expect(Vector4.subtract(v1, v2))
//             .toEqual(new Vector4(-1, 1, 0, 0));
//     });
//     test('multiply', function () {
//         expect(Vector4.multiply(v1, 2))
//             .toEqual(new Vector4(6, 8, 0, 0));
//     });
//     test('divide', function () {
//         expect(Vector4.divide(v1, 2))
//             .toEqual(new Vector4(1.5, 2, 0, 0));
//     });
//     test('dotProduct', function () {
//         expect(Vector4.dotProduct(v1, v2))
//             .toBe(24);
//     });
//     test('vectorCrossProduct', function () {
//         expect(Vector4.vectorCrossProduct(v1, v2))
//             .toEqual(new Vector4(0, 0, -7, 0));
//     });
// });