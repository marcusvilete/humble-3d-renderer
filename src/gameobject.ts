import { Mesh } from "./mesh";
import { Transform } from "./transform";

//TODO: implement a 'tree-like' structure so we can have children game objects...
//      also, children game object transforms should 'acumulate' its transformations...
//      so when we transform a parent, all children gets transformed

//This is not really a "Game object", since it is not even close to be a "game"
//But i like this name "GameObject-ish"
export class GameObject {
    name: string;
    transform: Transform;
    mesh?: Mesh;
    //..Material?
    //..behaviours??
    constructor(transform?: Transform, mesh?: Mesh) {
        this.transform = transform ?? new Transform();
        this.mesh = mesh ?? null;
    }
}

//The idea is to make something every frame
//This 'something' will be inside the update function
export interface Component {
    update(): void;
}