import { Vector2, Vector3, Vector4 } from "./vector"
import { Matrix4 } from "./matrix"
import { DrawMode, Face, Mesh } from "./mesh";
import { webglUtils } from "./webGLUtils"
import { GameObject } from "./gameobject";
import { Transform } from "./transform";
import { Camera } from "./camera";
import { Renderer } from "./renderer";

//TODO:
// find a way to make only ONE vertex buffer to fit all vertex of all meshes...
// every mesh should keep its own range indices, so we can draw every mesh with diferent parameters and/or shader programs
// i think we should update the vertex buffer only when we create or destroy a mesh.
// i said vertex, but it is actually every buffer (vertex, normal, uv, etc)
// remember: buffer data dont(normally) changes, so we are fine. what changes are transforms...


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

let renderer: Renderer;
//array of game objects
let gameObjects = new Array<GameObject>();
let redCubeImage: HTMLImageElement;
let blueCubeImage: HTMLImageElement;

window.onload = main;
function main(): void {
    //first of all, load resources!
    loadResources().then(() => {
        setup();
        loadMeshes();
        renderer.bufferData(gameObjects); // This should be called everytime we add or remove meshes to the scene
        createEventHandlers();
        requestAnimationFrame(gameLoop);
    });

}

function setup(): void {
    let canvasElem: HTMLCanvasElement = document.querySelector("#canvas");
    //let vertexShaderElem: HTMLScriptElement = document.querySelector("#vertex-shader-3d-solid-color");
    //let fragmentShaderElem: HTMLScriptElement = document.querySelector("#fragment-shader-3d-solid-color");
    // let vertexShaderElem: HTMLScriptElement = document.querySelector("#vertex-shader-3d-textured");
    // let fragmentShaderElem: HTMLScriptElement = document.querySelector("#fragment-shader-3d-textured");
    let vertexShaderElem: HTMLScriptElement = document.querySelector("#vertex-shader-3d-textured-lit");
    let fragmentShaderElem: HTMLScriptElement = document.querySelector("#fragment-shader-3d-textured-lit");

    //initialize canvas and webgl stuff
    let gl = canvasElem.getContext("webgl");
    if (!gl) {
        console.error("Something went wrong while creating webgl context");
        return;
    }

    let vertexShader = webglUtils.loadFromScript(gl, vertexShaderElem, gl.VERTEX_SHADER);
    let fragmentShader = webglUtils.loadFromScript(gl, fragmentShaderElem, gl.FRAGMENT_SHADER);
    let program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

    renderer = new Renderer(gl, program);
    
    const aspect = canvasElem.clientWidth / canvasElem.clientHeight;
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

async function loadResources() {
    let redCubePromise = loadImage("./assets/redCube.png");
    let blueCubePromise = loadImage("./assets/blueCube.png");
    await Promise.all([redCubePromise, blueCubePromise]).then((values) => {
        redCubeImage = values[0];
        blueCubeImage = values[1];
    });
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.src = url;
    });
}

function loadMeshes(): void {
    let redCubeMesh = Mesh.loadMeshFromFile("this is a mockup!");
    let blueCubeMesh = Mesh.loadMeshFromFile("this is a mockup!");
    
    redCubeMesh.texture = renderer.loadTexture(redCubeImage);
    blueCubeMesh.texture = renderer.loadTexture(blueCubeImage);

    for (let i = 0; i < 1000; i++) {
        let newCube = new GameObject(
            new Transform(
                new Vector3(randomIntFromInterval(-100, 100), randomIntFromInterval(-100, 100), randomIntFromInterval(-100, 100)), //position
                new Vector3(0, 0, 0),  //rotation
                new Vector3(1, 1, 1)   //scale
            ),
            i % 2 == 0 ? redCubeMesh : blueCubeMesh
        );
        gameObjects.push(newCube);
    }
}

function gameLoop(now: number): void {
    now *= 0.001;
    deltaTime = now - previousFrameTime;
    previousFrameTime = now;
    computeFramesPerSecond();
    processInput();
    update();
    renderer.render(gameObjects);
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
        gameObjects[i].transform.computeMatrices(Matrix4.multiplyMatrices4(viewMatrix, projectionMatrix));
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
    let canvas = renderer.getContext().canvas as HTMLCanvasElement;

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