import { Transform } from "../src/Rendering/transform";
import { Vector3 } from "../src/Rendering/vector";

describe('Transform tests:', function () {
    test('reset', function () {
        let t = new Transform(
            new Vector3(1, 2, 3),
            new Vector3(4, 5, 6),
            new Vector3(7, 8, 9)
        );
        let reset = new Transform(
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(1, 1, 1)
        );
        t.reset();
        expect(t).toEqual(reset);
    });
    test('rotate', function () {
        let t = new Transform(
            new Vector3(),
            new Vector3(),
            new Vector3()
        );

        expect(t.rotation)
            .toEqual(new Vector3(0, 0, 0));

        t.rotate(new Vector3(1, 2, 3));
        expect(t.rotation)
            .toEqual(new Vector3(1, 2, 3));

        t.rotate(new Vector3(3, 2, 1));
        expect(t.rotation)
            .toEqual(new Vector3(4, 4, 4));
    });


    test('translate', function () {
        let t = new Transform(
            new Vector3(),
            new Vector3(),
            new Vector3()
        );

        expect(t.position)
            .toEqual(new Vector3(0, 0, 0));

        t.translate(new Vector3(1, 2, 3));
        expect(t.position)
            .toEqual(new Vector3(1, 2, 3));

        t.translate(new Vector3(3, 2, 1));
        expect(t.position)
            .toEqual(new Vector3(4, 4, 4));
    });

});


