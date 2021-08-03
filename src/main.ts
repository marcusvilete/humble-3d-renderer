import { Vector3 } from "./Rendering/vector"
import { Matrix4 } from "./Rendering/matrix"
import { DrawMode, Mesh } from "./Rendering/mesh";
import { webglUtils } from "./Etc/webglUtils"
import { GameObject } from "./Rendering/gameobject";
import { Transform } from "./Rendering/transform";
import { Camera } from "./Rendering/camera";
import { Renderer } from "./Rendering/renderer";
import { FileLoader } from "./File/FileLoader";
import { degToRad } from "./Etc/mathFunctions";

// stuff related to camera and camera movement
let firsPersonCamera = {
    cameraObj: null as Camera,
    forwardVelocity: new Vector3(0, 0, 0),
    rightVelocity: new Vector3(0, 0, 0),
    maxXRotation: degToRad(89),
    minXRotation: degToRad(-89),
    cameraSpeed: 20,
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
let rootGameObject = new GameObject();
let gameObjects = new Array<GameObject>();

let allstarImage: HTMLImageElement;
let allstarMeshes: Mesh[];

window.onload = main;
function main(): void {
    //first of all, load resources!
    loadResources().then(() => {
        setup();
        instantiateObjects();
        renderer.bufferData(gameObjects); // This should be called everytime we add or remove meshes to the scene
        createEventHandlers();
        requestAnimationFrame(gameLoop);
    });

}

function setup(): void {
    let canvasElem: HTMLCanvasElement = document.querySelector("#canvas");
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
    //we load everything we need to start rendering here....
    let allstarImagePromise = FileLoader.loadImage("./assets/allstar.png");
    let allstarMeshesPromise = FileLoader.loadOBJ("./assets/allstar.obj");
    let promises: Promise<any>[] = [allstarImagePromise, allstarMeshesPromise];
    
    //resume only when everything is ready....
    await Promise.all(promises).then((values) => {
        allstarImage = values[0];
        allstarMeshes = values[1];
    });
}

function instantiateObjects(): void {
    let allstarTexture = renderer.loadTexture(allstarImage);

    allstarMeshes.forEach(m => {
        m.texture = allstarTexture;
        m.drawMode = DrawMode.Texture;
        let newObj = new GameObject(
            new Transform(
                new Vector3(0, 1.5, -5),
                new Vector3(0, 0, 0),
                new Vector3(5, 5, 5),
            ),
            m
        );
        newObj.setParent(rootGameObject);
        gameObjects.push(newObj);
    });
}

function gameLoop(now: number): void {
    now *= 0.001;
    deltaTime = now - previousFrameTime;
    previousFrameTime = now;
    //computeFramesPerSecond();
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

    rootGameObject.updateLocalMatrices();
    rootGameObject.updateWorldMatrices();

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].transform.computeWorldViewMatrices(Matrix4.multiplyMatrices4(viewMatrix, projectionMatrix));
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

