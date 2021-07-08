import { Camera } from "../src/Rendering/camera";

describe('Camera tests:', function () {
    test('active camera should be set, if there is none', function () {
        //at first, there is no active camera
        expect(Camera.getActiveCamera()).toBeNull();
        //then, when we instantiate our first camera
        let cam = new Camera(
            1.0472, // fov(60 degrees)
            1920 / 1080, // aspect ratio
            0.1, // near
            100 // far
        );
        //it turns out to be the active camera.
        expect(Camera.getActiveCamera()).toBe(cam);
    });


    test('active camera should NOT be set, if there is already one', function () {
        // at this point, there was already a camera around
        expect(Camera.getActiveCamera()).not.toBeNull();
        
        //then, when we instantiate another camera
        let cam = new Camera(
            1.0472, // fov(60 degrees)
            1920 / 1080, // aspect ratio
            0.1, // near
            100 // far
        );
        //it turns out to be the active camera.
        expect(Camera.getActiveCamera()).not.toBe(cam);
    });


    test('getter and setter for active camera', function () {
        
        let cam = new Camera(
            1.0472, // fov(60 degrees)
            1920 / 1080, // aspect ratio
            0.1, // near
            100 // far
        );

        let cam2 = new Camera(
            1.0472, // fov(60 degrees)
            1920 / 1080, // aspect ratio
            0.1, // near
            100 // far
        );

        //when active camera is `cam`, should not be `cam2`
        Camera.setActiveCamera(cam);
        expect(Camera.getActiveCamera()).toBe(cam);
        expect(Camera.getActiveCamera()).not.toBe(cam2);
        //and vice versa
        Camera.setActiveCamera(cam2);
        expect(Camera.getActiveCamera()).toBe(cam2);
        expect(Camera.getActiveCamera()).not.toBe(cam);
    });
});

