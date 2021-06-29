import { Matrix4 } from "../src/Rendering/matrix"



describe('Matrix4 operations:', function () {
    let m = new Matrix4();


    test('getElementAt', function () {
        expect(m.getElementAt(0, 0))
            .toBe(0);
    });

});