import { Vector2, Vector3, Vector4 } from "../src/Rendering/vector"


describe('Vector2 operations:', function () {
    let v1 = new Vector2(3, 4);
    let v2 = new Vector2(4, 3);

    test('constructor', function () {
        expect(new Vector2())
            .toEqual(new Vector2(0, 0));
        expect(new Vector2(1))
            .toEqual(new Vector2(1, 0));
    });


    test('magnitude', function () {
        expect(Vector2.magnitude(v1))
            .toBe(5);
    });


    test('normalize non-zero vector', function () {
        expect(Vector2.normalize(v1))
            .toEqual(new Vector2(0.6, 0.8));
    });


    test('normalize zero vector', function () {
        expect(Vector2.normalize(new Vector2(0.0, 0.0)))
            .toEqual(new Vector2(0.0, 0.0));
    });


    test('add', function () {
        expect(Vector2.add(v1, v2))
            .toEqual(new Vector2(7, 7));
    });


    test('subtract', function () {
        expect(Vector2.subtract(v1, v2))
            .toEqual(new Vector2(-1, 1));
    });


    test('multiply by zero', function () {
        expect(Vector2.multiply(v1, 0))
            .toEqual(new Vector2(0, 0));
    });


    test('multiply by not zero', function () {
        expect(Vector2.multiply(v1, 2))
            .toEqual(new Vector2(6, 8));
    });


    test('divide by zero', function () {
        const consoleError = jest.spyOn(global.console, 'error');

        expect(Vector2.divide(v1, 0))
            .toEqual(v1);
        expect(consoleError)
            .toHaveBeenCalled();

        consoleError.mockRestore();
    });


    test('divide by not zero', function () {
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

    test('constructor', function () {
        expect(new Vector3())
            .toEqual(new Vector3(0, 0, 0));
        expect(new Vector3(1))
            .toEqual(new Vector3(1, 0, 0));
        expect(new Vector3(1, 2))
            .toEqual(new Vector3(1, 2, 0));
    });

    test('magnitude', function () {
        expect(Vector3.magnitude(v1))
            .toBe(5);
    });


    test('normalize non zero', function () {
        expect(Vector3.normalize(v1))
            .toEqual(new Vector3(0.6, 0.8, 0));
    });


    test('normalize zero', function () {
        expect(Vector3.normalize(new Vector3(0, 0, 0)))
            .toEqual(new Vector3(0, 0, 0));
    });


    test('add', function () {
        expect(Vector3.add(v1, v2))
            .toEqual(new Vector3(7, 7, 0));
    });


    test('subtract', function () {
        expect(Vector3.subtract(v1, v2))
            .toEqual(new Vector3(-1, 1, 0));
    });


    test('multiply by non zero', function () {
        expect(Vector3.multiply(v1, 2))
            .toEqual(new Vector3(6, 8, 0));
    });


    test('multiply by zero', function () {
        expect(Vector3.multiply(v1, 0))
            .toEqual(new Vector3(0, 0, 0));
    });


    test('divide by non zero', function () {
        expect(Vector3.divide(v1, 2))
            .toEqual(new Vector3(1.5, 2, 0));
    });


    test('divide by zero', function () {
        const consoleError = jest.spyOn(global.console, 'error');

        expect(Vector3.divide(v1, 0))
            .toEqual(v1);
        expect(consoleError)
            .toHaveBeenCalled();

        consoleError.mockRestore();
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

describe('Vector4 operations:', function () {

    test('constructor', function () {
        expect(new Vector4())
            .toEqual(new Vector4(0, 0, 0, 1));
    });
    test('constructor', function () {
        expect(new Vector4(1))
            .toEqual(new Vector4(1, 0, 0, 1));
    });
    test('constructor', function () {
        expect(new Vector4(1, 2))
            .toEqual(new Vector4(1, 2, 0, 1));
    });
    test('constructor', function () {
        expect(new Vector4(1, 2, 3))
            .toEqual(new Vector4(1, 2, 3, 1));
    });
});