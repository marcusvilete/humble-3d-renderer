import { Vector2, Vector3, Vector4 } from "./vector"
import { Matrix4 } from "./matrix"
import { DrawMode, Face, Mesh } from "./mesh";
import { webglUtils } from "./webGLUtils"
import { GameObject } from "./gameobject";
import { Transform } from "./transform";
import { Camera } from "./camera";

// stuff related to camera and camera movement
let firsPersonCamera = {
    cameraObj: null as Camera,
    forwardVelocity: new Vector3(0, 0, 0),
    rightVelocity: new Vector3(0, 0, 0),
    maxXRotation: degToRad(89),
    minXRotation: degToRad(-89),
    cameraSpeed: 50,
    mouseSensibility: 0.1,
    Move(direction: Vector3) {
        let cam = this.cameraObj as Camera;
        let speed = this.cameraSpeed * deltaTime;
        let forwardVelocity = Vector3.multiply(cam.transform.forward, -direction.z);
        let rightVelocity = Vector3.multiply(cam.transform.right, direction.x);
        let velocity = Vector3.multiply(Vector3.add(forwardVelocity, rightVelocity), speed);
        cam.transform.translate(velocity);
    },
    Rotate(rotationAmount: Vector3) {
        let cam = this.cameraObj as Camera;
        let rotation = cam.transform.rotation;
        let speed = this.mouseSensibility * deltaTime;
        rotation.x -= speed * rotationAmount.x;
        rotation.y -= speed * rotationAmount.y;
        if (rotation.x > this.maxXRotation) rotation.x = this.maxXRotation;
        else if (rotation.x < this.minXRotation) rotation.x = this.minXRotation;
        cam.transform.rotation = rotation;
        cam.transform.rotate(Vector3.zero);
    }
};

// this is for keyboard event handling
// when 'keydown' happens, we set to true
// when 'keyup' happens, we set to false
// in the gameloop we process input based on this flags.
let controls = {
    up: false,
    down: false,
    left: false,
    right: false
}

/**
 * Time since last frame, in seconds
 */
let deltaTime = 0;
let previousFrameTime = 0;

//vars for counting frames
let frameCount = 0;
let timeForFPS = 0;

//Webgl stuff
let gl: WebGLRenderingContext = null;
let program: WebGLProgram = null;
//let indexBuffer: WebGLBuffer = null;
let vertexBuffer: WebGLBuffer = null;
//let colorBuffer: WebGLBuffer = null;
let texCoordsBuffer: WebGLBuffer = null;
let texture: WebGLTexture = null;

//array of game objects
let gameObjects = new Array<GameObject>();

window.onload = main;
function main(): void {
    initWebgl();
    setup();
    createEventHandlers();
    requestAnimationFrame(gameLoop);
}

function setup(): void {
    loadMeshes();
    let canvas = gl.canvas as HTMLCanvasElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    //let yFov = 60 * (Math.PI / 180) //To radians;
    let yFov = degToRad(60); //To radians;
    let zNear = 1;
    let zFar = 2000;

    firsPersonCamera.cameraObj = new Camera(
        yFov,
        aspect,
        zNear,
        zFar
    );
    firsPersonCamera.cameraObj.computePerspectiveMatrix();
}

function loadMeshes(): void {
    let cubeMesh = new Mesh();

    // cubeMesh.vertices = [
    //     new Vector3(-1, -1, 1),
    //     new Vector3(-1, 1, 1),
    //     new Vector3(1, 1, 1),
    //     new Vector3(1, -1, 1),
    //     new Vector3(-1, -1, -1),
    //     new Vector3(-1, 1, -1),
    //     new Vector3(1, 1, -1),
    //     new Vector3(1, -1, -1)
    // ];
    // cubeMesh.faces = [
    //     new Face(1, 0, 3),
    //     new Face(3, 2, 1),
    //     new Face(2, 3, 7),
    //     new Face(7, 6, 2),
    //     new Face(3, 0, 4),
    //     new Face(4, 7, 3),
    //     new Face(6, 5, 1),
    //     new Face(1, 2, 6),
    //     new Face(4, 5, 6),
    //     new Face(6, 7, 4),
    //     new Face(5, 4, 0),
    //     new Face(0, 1, 5)
    // ];
    // cubeMesh.uvCoords = [
    //     new Vector2(0, 0),
    //     new Vector2(0, 1),

    //     new Vector2(1, 1),
    //     new Vector2(1, 0),

    //     new Vector2(0, 0),
    //     new Vector2(0, 1),

    //     new Vector2(1, 1),
    //     new Vector2(1, 0)
    // ];

    cubeMesh.vertices = [
        new Vector3(-0.5, -0.5, -0.5),
        new Vector3(-0.5, 0.5, -0.5),
        new Vector3(0.5, -0.5, -0.5),

        new Vector3(-0.5, 0.5, -0.5),
        new Vector3(0.5, 0.5, -0.5),
        new Vector3(0.5, -0.5, -0.5),

        new Vector3(-0.5, -0.5, 0.5),
        new Vector3(0.5, -0.5, 0.5),
        new Vector3(-0.5, 0.5, 0.5),

        new Vector3(-0.5, 0.5, 0.5),
        new Vector3(0.5, -0.5, 0.5),
        new Vector3(0.5, 0.5, 0.5),

        new Vector3(-0.5, 0.5, -0.5),
        new Vector3(-0.5, 0.5, 0.5),
        new Vector3(0.5, 0.5, -0.5),

        new Vector3(-0.5, 0.5, 0.5),
        new Vector3(0.5, 0.5, 0.5),
        new Vector3(0.5, 0.5, -0.5),

        new Vector3(-0.5, -0.5, -0.5),
        new Vector3(0.5, -0.5, -0.5),
        new Vector3(-0.5, -0.5, 0.5),

        new Vector3(-0.5, -0.5, 0.5),
        new Vector3(0.5, -0.5, -0.5),
        new Vector3(0.5, -0.5, 0.5),

        new Vector3(-0.5, -0.5, -0.5),
        new Vector3(-0.5, -0.5, 0.5),
        new Vector3(-0.5, 0.5, -0.5),

        new Vector3(-0.5, -0.5, 0.5),
        new Vector3(-0.5, 0.5, 0.5),
        new Vector3(-0.5, 0.5, -0.5),

        new Vector3(0.5, -0.5, -0.5),
        new Vector3(0.5, 0.5, -0.5),
        new Vector3(0.5, -0.5, 0.5),

        new Vector3(0.5, -0.5, 0.5),
        new Vector3(0.5, 0.5, -0.5),
        new Vector3(0.5, 0.5, 0.5),
    ];

    cubeMesh.uvCoords = [
        new Vector2(0.662061, 0.986184),
        new Vector2(0.337939, 0.986184),
        new Vector2(0.662061, 0.517092),
        
        new Vector2(0.337939, 0.986184),
        new Vector2(0.337939, 0.517092),
        new Vector2(0.662061, 0.517092),

        new Vector2(0.337939, 0.013816),
        new Vector2(0.662061, 0.013816),
        new Vector2(0.337939, 0.482908),
        
        new Vector2(0.337939, 0.482908),
        new Vector2(0.662061, 0.013816),
        new Vector2(0.662061, 0.482908),

        new Vector2(0.337939, 0.986184),
        new Vector2(0.013816, 0.986184),
        new Vector2(0.337939, 0.517092),

        new Vector2(0.013816, 0.986184),
        new Vector2(0.013816, 0.517092),
        new Vector2(0.337939, 0.517092),

        new Vector2(0.662061, 0.986184),
        new Vector2(0.662061, 0.517092),
        new Vector2(0.986184, 0.986184),

        new Vector2(0.986184, 0.986184),
        new Vector2(0.662061, 0.517092),
        new Vector2(0.986184, 0.517092),

        new Vector2(0.013816, 0.013816),
        new Vector2(0.337939, 0.013816),
        new Vector2(0.013816, 0.482908),

        new Vector2(0.337939, 0.013816),
        new Vector2(0.337939, 0.482908),
        new Vector2(0.013816, 0.482908),

        new Vector2(0.986184, 0.013816),
        new Vector2(0.986184, 0.482908),
        new Vector2(0.662061, 0.013816),

        new Vector2(0.662061, 0.013816),
        new Vector2(0.986184, 0.482908),
        new Vector2(0.662061, 0.482908)
    ]

    cubeMesh.color = new Vector4(80, 70, 200, 255);
    cubeMesh.drawMode = DrawMode.SolidColor;

    for (let i = 0; i < 1000; i++) {
        let newCube = new GameObject(
            new Transform(
                new Vector3(randomIntFromInterval(-100, 100), randomIntFromInterval(-100, 100), randomIntFromInterval(-100, 100)), //position
                new Vector3(0, 0, 0),  //rotation
                new Vector3(1, 1, 1)   //scale
            ),
            cubeMesh
        );
        gameObjects.push(newCube);
    }
}

function initWebgl(): void {
    let canvasElem: HTMLCanvasElement = document.querySelector("#canvas");
    //let vertexShaderElem: HTMLScriptElement = document.querySelector("#vertex-shader-3d-solid-color");
    //let fragmentShaderElem: HTMLScriptElement = document.querySelector("#fragment-shader-3d-solid-color");
    let vertexShaderElem: HTMLScriptElement = document.querySelector("#vertex-shader-3d-textured");
    let fragmentShaderElem: HTMLScriptElement = document.querySelector("#fragment-shader-3d-textured");

    //initialize canvas and webgl stuff
    gl = canvasElem.getContext("webgl");
    if (!gl) {
        console.error("Something went wrong while creating webgl context");
        return;
    }

    let vertexShader = webglUtils.loadShaderFromScript(gl, vertexShaderElem, gl.VERTEX_SHADER);
    let fragmentShader = webglUtils.loadShaderFromScript(gl, fragmentShaderElem, gl.FRAGMENT_SHADER);
    program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

    //TODO: this is program specific, so when we have multiple programs, this needs to move
    //indexBuffer = gl.createBuffer();
    vertexBuffer = gl.createBuffer();
    //colorBuffer = gl.createBuffer();
    texCoordsBuffer = gl.createBuffer();

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let image = new Image();
    image.crossOrigin = "";
    image.src = "./assets/cube.png";
    image.addEventListener('load', function () {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });
}

function gameLoop(now: number): void {
    now *= 0.001;
    deltaTime = now - previousFrameTime;
    previousFrameTime = now;
    computeFramesPerSecond();
    processInput();
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function processInput() {

    let direction = new Vector3();
    if (controls.up) direction = Vector3.add(direction, Vector3.forward);
    if (controls.down) direction = Vector3.add(direction, Vector3.backward);
    if (controls.right) direction = Vector3.add(direction, Vector3.right);
    if (controls.left) direction = Vector3.add(direction, Vector3.left);

    firsPersonCamera.Move(direction);
}

function update(): void {
    let camera = Camera.getActiveCamera();
    let projectionMatrix = camera.getPerspectiveMatrix();
    let viewMatrix = Matrix4.makeViewMatrix(
        camera.transform.position,
        Vector3.add(camera.transform.position, camera.transform.forward),
        Vector3.up);

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].transform.computeWorldViewMatrix(Matrix4.multiplyMatrices4(viewMatrix, projectionMatrix));
    }
}

function render(): void {
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    //gl.colorMask(true, true, true, true);
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.lineWidth(window.devicePixelRatio);

    //TODO: how can i make so every mesh can have its own program if needed
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    //let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    let texCoordsAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
    let matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

    for (let i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].mesh === null) continue;

        gl.uniformMatrix4fv(matrixUniformLocation, false, gameObjects[i].transform.getWorldViewMatrix().flatten());
        //passing faces data (as indexes to be looked up in the vertex buffer)    
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gameObjects[i].mesh.flattenFacesArray(), gl.STATIC_DRAW);

        //passing actual vertex data

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, gameObjects[i].mesh.flattenPositionArray(), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        //Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            positionAttributeLocation,
            3,          // we are passing 3 components per iteration
            gl.FLOAT,   // the type of each component
            false,      // should normalize?
            0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
            0           // 0 = start at the beginning of the buffer
        );

        //passing color data for each vertex
        //gl.bindBuffer(gl.ARRAY_BUFFER, `colorBuffer`);
        //gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(gameObjects[i].mesh.flattenColorArray()), gl.STATIC_DRAW);
        //gl.enableVertexAttribArray(colorAttributeLocation);
        // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        // gl.vertexAttribPointer(
        //     colorAttributeLocation,
        //     4,          // we are passing 4 components per iteration
        //     gl.UNSIGNED_BYTE,   // the type of each component
        //     true,      // should normalize?
        //     0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
        //     0           // 0 = start at the beginning of the buffer
        // );
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
        gl.enableVertexAttribArray(texCoordsAttributeLocation);
        gl.vertexAttribPointer(
            texCoordsAttributeLocation,
            2,         // we are passing 2 components per iteration
            gl.FLOAT,  // the type of each component
            false,     // should normalize?
            0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
            0          // 0 = start at the beginning of the buffer
        );
        gl.bufferData(gl.ARRAY_BUFFER, gameObjects[i].mesh.flattenTexCoords(), gl.STATIC_DRAW);

        gl.drawArrays(gameObjects[i].mesh.drawMode, 0, gameObjects[i].mesh.getVertexCount());
    }
}

function createEventHandlers(): void {

    document.addEventListener("keydown", function (event: KeyboardEvent) {
        if (event.key === 'w') {
            controls.up = true;
        } else if (event.key === 's') {
            controls.down = true;
        } else if (event.key === 'a') {
            controls.left = true;
        } else if (event.key === 'd') {
            controls.right = true;
        } else if (event.key === 'Enter') {
            //console.log(controls);
        }
    });
    document.addEventListener("keyup", function (event: KeyboardEvent) {
        if (event.key === 'w') {
            controls.up = false;
        } else if (event.key === 's') {
            controls.down = false;
        } else if (event.key === 'a') {
            controls.left = false;
        } else if (event.key === 'd') {
            controls.right = false;
        } else if (event.key === 'Enter') {
            //console.log(controls);
        }
    });

    // pointer lock object forking for cross browser
    let canvas = gl.canvas as HTMLCanvasElement;

    canvas.addEventListener("click", function (this: HTMLCanvasElement, event: Event) {
        this.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', pointerLockChanged);

    function pointerLockChanged(): void {
        if (document.pointerLockElement === canvas) {
            document.addEventListener("mousemove", mouseMoved);
        } else {
            //console.log('The pointer lock status is now unlocked');
            document.removeEventListener("mousemove", mouseMoved);
        }
    }

    function mouseMoved(event: MouseEvent) {
        let rotation = new Vector3(
            event.movementY,
            event.movementX,
            0
        );
        firsPersonCamera.Rotate(rotation);
    }
}

function computeFramesPerSecond() {
    frameCount++;
    timeForFPS += deltaTime;
    if (timeForFPS >= 1.0) {
        console.log(frameCount);
        timeForFPS -= 1.0;
        frameCount = 0
    }
}

//TODO: move math stuff to its own module
function radToDeg(r: number): number {
    return r * 180 / Math.PI;
}

function degToRad(d: number): number {
    return d * Math.PI / 180;
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}