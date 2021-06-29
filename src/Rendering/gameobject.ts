import { Matrix4 } from "./matrix";
import { Mesh } from "./mesh";
import { Transform } from "./transform";

//This is not really a "Game object", since it is not even close to be a "game"
//But i like this name "GameObject-ish"
export class GameObject {
    parent: GameObject;
    children: GameObject[];
    name: string;
    transform: Transform;
    mesh?: Mesh;
    //..Material?
    //..behaviours??
    constructor(transform?: Transform, mesh?: Mesh) {
        this.transform = transform ?? new Transform();
        this.mesh = mesh ?? null;
        this.children = [];
    }

    updateLocalMatrices(): void {
        this.transform.updateLocalMatrix();
        this.children.forEach(child => {
            child.updateLocalMatrices();
        });
    }
    updateWorldMatrices(parentMatrix?: Matrix4): void {
        this.transform.updateWorldMatrix(parentMatrix);
        this.children.forEach(child => {
            child.updateWorldMatrices(this.transform.getWorldMatrix());
        });
    }
    setParent(parent: GameObject): void {
        // remove us from our parent
        if (this.parent) {
            var ndx = this.parent.children.indexOf(this);
            if (ndx >= 0) {
                this.parent.children.splice(ndx, 1);
            }
        }
        // Add us to our new parent
        if (parent) {
            parent.children.push(this);
        }
        this.parent = parent;
    }
}

//The idea is to make something every frame
//This 'something' will be inside the update function
export interface Component {
    update(): void;
}