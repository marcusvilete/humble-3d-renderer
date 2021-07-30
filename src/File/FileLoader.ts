import { AnimatedModel } from "../animatedModel";
import { Joint } from "../Animation/joint";
import { Matrix4 } from "../Rendering/matrix";
import { Quaternion } from "../Rendering/quaternion";
import { Vector3, Vector4 } from "../Rendering/vector";

export class FileLoader {

    static async loadGltf(url: string) {
        //TODO: load bone hierarchy
        let result: GLTFModel = {
            positionData: null,
            normalData: null,
            texCoordData: null,
            indicesData: null,
            jointData: null,
            weightData: null,
            rootJoint: null,
            jointCount: 0
        };
        //let positionData: Float32Array;
        //let normalData: Float32Array;
        //let texCoordData: Float32Array;
        //let indicesData: Uint16Array;
        //let jointData: Float32Array; // top 4 joints that affects the position
        //let weightData: Float32Array; // respective weight of that joint above
        let inverseBindMatricesData: Float32Array;

        let gltf = await this.loadJson<GLTFFile>(url);

        const baseURL = new URL(url, location.href);

        let binaryBuffers = await Promise.all(gltf.buffers.map((buffer) => {
            const url = new URL(buffer.uri, baseURL.href);
            return this.loadArrayBuffer(url.href);
        }));

        //there is just one mesh so far...
        gltf.meshes.forEach((mesh) => {
            mesh.primitives.forEach((primitive) => {
                //TODO: get rid of all this repetition
                const positionAccessorIndex = primitive.attributes["POSITION"];
                const normalAccessorIndex = primitive.attributes["NORMAL"];
                const texCoordAccessorIndex = primitive.attributes["TEXCOORD_0"];
                const jointAccessorIndex = primitive.attributes["JOINTS_0"];
                const weightAccessorIndex = primitive.attributes["WEIGHTS_0"];
                const indicesIndex = primitive.indices; //uhh

                const positionAccessor = gltf.accessors[positionAccessorIndex];
                const normalAccessor = gltf.accessors[normalAccessorIndex];
                const texCoordAccessor = gltf.accessors[texCoordAccessorIndex];
                const jointAccessor = gltf.accessors[jointAccessorIndex];
                const weightAccessor = gltf.accessors[weightAccessorIndex];
                const indicesAccessor = gltf.accessors[indicesIndex];

                const positionBufferView = gltf.bufferViews[positionAccessor.bufferView];
                const normalBufferView = gltf.bufferViews[normalAccessor.bufferView];
                const texCoordBufferView = gltf.bufferViews[texCoordAccessor.bufferView];
                const jointBufferView = gltf.bufferViews[jointAccessor.bufferView];
                const weightBufferView = gltf.bufferViews[weightAccessor.bufferView];
                const indicesBufferView = gltf.bufferViews[indicesAccessor.bufferView];

                const positionBuffer = binaryBuffers[positionBufferView.buffer]; //actual data, finally
                const normalBuffer = binaryBuffers[normalBufferView.buffer]; //actual data, finally
                const texCoordBuffer = binaryBuffers[texCoordBufferView.buffer]; //actual data, finally
                const jointBuffer = binaryBuffers[jointBufferView.buffer]; //actual data, finally
                const weightBuffer = binaryBuffers[weightBufferView.buffer]; //actual data, finally
                const indicesBuffer = binaryBuffers[indicesBufferView.buffer]; //actual data, finally

                result.positionData = new Float32Array(positionBuffer, positionBufferView.byteOffset, positionBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
                result.normalData = new Float32Array(normalBuffer, normalBufferView.byteOffset, normalBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
                result.texCoordData = new Float32Array(texCoordBuffer, texCoordBufferView.byteOffset, texCoordBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
                result.jointData = new Uint8Array(jointBuffer, jointBufferView.byteOffset, jointBufferView.byteLength / Uint8Array.BYTES_PER_ELEMENT);
                result.weightData = new Float32Array(weightBuffer, weightBufferView.byteOffset, weightBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
                result.indicesData = new Uint16Array(indicesBuffer, indicesBufferView.byteOffset, indicesBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT);//11994);
                console.log("position", result.positionData);
                console.log("normals", result.normalData);
                console.log("tex coords", result.texCoordData);
                console.log("joint ids", result.jointData);
                console.log("weights" , result.weightData);
                console.log("indices", result.indicesData);
            });
        });

        //now the skins...
        //there is only one skin so far...
        let joints: Joint[];
        gltf.skins.forEach((skin) => {
            let actualJointNodes = skin.joints.map(index => gltf.nodes[index]);
            const inverseMatricesAccessor = gltf.accessors[skin.inverseBindMatrices];
            const inverseMatricesBufferView = gltf.bufferViews[inverseMatricesAccessor.bufferView];
            const buffer = binaryBuffers[inverseMatricesBufferView.buffer];
            inverseBindMatricesData = new Float32Array(buffer, inverseMatricesBufferView.byteOffset, inverseMatricesBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
            let inverseBindMatrices = new Array<Matrix4>(inverseBindMatricesData.length / 16);

            for (let i = 0; i < inverseBindMatrices.length; i++) {
                let offset = (16 * i);
                inverseBindMatrices[i] = new Matrix4(
                    inverseBindMatricesData[0 + offset], inverseBindMatricesData[1 + offset], inverseBindMatricesData[2 + offset], inverseBindMatricesData[3 + offset],
                    inverseBindMatricesData[4 + offset], inverseBindMatricesData[5 + offset], inverseBindMatricesData[6 + offset], inverseBindMatricesData[7 + offset],
                    inverseBindMatricesData[8 + offset], inverseBindMatricesData[9 + offset], inverseBindMatricesData[10 + offset], inverseBindMatricesData[11 + offset],
                    inverseBindMatricesData[12 + offset], inverseBindMatricesData[13 + offset], inverseBindMatricesData[14 + offset], inverseBindMatricesData[15 + offset]
                );
            }

            console.log("FileLoader: ", inverseBindMatricesData);

            //console.log("inverse bind matrices: ", inverseBindMatrices);

            joints = new Array<Joint>(actualJointNodes.length);

            //fill a Joint array
            
            for (let i = 0; i < actualJointNodes.length; i++) {
                // let localMatrix = Matrix4.makeIdentity();
                // let translation = actualJointNodes[i].translation;
                // let rotation = actualJointNodes[i].rotation;
                // let scale = actualJointNodes[i].scale;

                // if (translation) {
                //     let translationMatrix = Matrix4.makeTranslation(translation[0], translation[1], translation[2]);
                //     localMatrix = Matrix4.multiplyMatrices4(translationMatrix, localMatrix);
                // }

                // if (rotation) {
                //     let quaternion = new Quaternion(rotation[0], rotation[1], rotation[2], rotation[3]);
                //     let rotationMatrix = quaternion.toMatrix4();
                //     localMatrix = Matrix4.multiplyMatrices4(rotationMatrix, localMatrix);
                // }

                // if (scale) {
                //     let scaleMatrix = Matrix4.makeTranslation(scale[0], scale[1], scale[2]);
                //     localMatrix = Matrix4.multiplyMatrices4(scaleMatrix, localMatrix);
                // }

                let localMatrix = Matrix4.makeIdentity();
                let translation = new Vector3(0, 0, 0);
                let rotation = new Vector4(0, 0, 0, 1);
                let scale = new Vector3(1, 1, 1);

                if (actualJointNodes[i].translation) {
                    translation.x = actualJointNodes[i].translation[0];
                    translation.y = actualJointNodes[i].translation[1];
                    translation.z = actualJointNodes[i].translation[2];
                }

                if (actualJointNodes[i].rotation) {
                    rotation.x = actualJointNodes[i].rotation[0];
                    rotation.y = actualJointNodes[i].rotation[1];
                    rotation.z = actualJointNodes[i].rotation[2];
                    rotation.w = actualJointNodes[i].rotation[3];
                }

                if (actualJointNodes[i].scale) {
                    scale.x = actualJointNodes[i].scale[0];
                    scale.y = actualJointNodes[i].scale[1];
                    scale.z = actualJointNodes[i].scale[2];
                }

                localMatrix = Matrix4.compose(translation, scale, rotation);

                joints[i] = new Joint(
                    i,
                    actualJointNodes[i].name,
                    localMatrix,
                    inverseBindMatrices[i]
                );
            }
            //get tree-like hierarchy done
            for (let i = 0; i < actualJointNodes.length; i++) {
                if (actualJointNodes[i].children) {
                    actualJointNodes[i].children.forEach(child => {
                        let j = joints.find(x => x.name === gltf.nodes[child].name);
                        joints[i].children.push(j);
                    });
                }
            }
            
            //joints[0] // root->001->002->005->003->004
            //joints[1] // 001
            //joints[2] // 002
            //joints[3] // 005
            //joints[4] // 003
            //joints[5] // 004



            // joints[0].children = [joints[1], joints[4], joints[5]];
            // joints[1].children = [joints[2]];
            // joints[2].children = [joints[3]]

            // joints[0].children = [joints[1], joints[4], joints[5]];
            // joints[1].children = [joints[3]];
            // joints[3].children = [joints[2]];

            //root to bone 4
            //bone 1 to bone 3

            //joints[5].children = [joints[4], joints[1], joints[0]];
            //joints[4].children = [joints[3]];
            //joints[3].children = [joints[2]];
            
            //is this right?
            result.rootJoint = joints[0];
            result.jointCount = joints.length;

            //console.log(rootJoint);

            // joints.forEach(j => {
            //     console.log(Matrix4.multiplyMatrices4(j.inverseBindMatrix, j.localBindMatrix));
            // });


            //console.log(inverseBindMatricesData);
        });



        return result;

        //return [positionData, normalData, texCoordData, jointData, weightData, indicesData];

        //return GltfParser.parse(binaryBuffers);
    }

    static async loadText(url: string) {
        let response = await fetch(url);
        return response.text();
    }

    static async loadJson<T>(url: string) {
        let response = await fetch(url);
        return response.json() as Promise<T>;
    }

    static async loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.addEventListener('load', () => {
                resolve(img);
            });
            img.src = url;
        });
    }

    static async loadArrayBuffer(url: string) {
        const response = await fetch(url);
        return response.arrayBuffer();
    }
}


//gltf types on demand
interface GLTFBuffer {
    byteLength: number;
    uri: string
}

interface GLTFBufferView {
    buffer: number;
    byteLength: number;
    byteOffset: number;
}

interface GLTFAccessor {
    bufferView: number;
    componentType: number;
    count: number;
    max: number[];
    min: number[];
    type: string;
}

interface GLTFMesh {
    name: string;
    primitives: GLTFPrimitive[]
}

interface GLTFPrimitive {
    attributes: GLTFAttributes;
    indices: 5;
    material: number;
}

interface GLTFAttributes {
    [key: string]: number;
}

interface GLTFNode {
    name: string;
    rotation: number[]; //4-component quaternion
    translation: number[]; //3-component vector
    scale: number[];//3-component vector
    skin: number; //skin index
    mesh: number; //mesh index
    children: number[]; // index of children nodes
}

interface GLTFSkin {
    inverseBindMatrices: number; //this is the accessor index?
    joints: number[]; //ids for node array
    name: string;
}

interface GLTFFile {
    nodes: GLTFNode[];
    skins: GLTFSkin[];
    meshes: GLTFMesh[];
    buffers: GLTFBuffer[];
    accessors: GLTFAccessor[];
    bufferViews: GLTFBufferView[];
}

interface GLTFModel {
    positionData: Float32Array,
    normalData: Float32Array,
    texCoordData: Float32Array,
    indicesData: Uint16Array,
    jointData: Uint8Array,
    weightData: Float32Array,
    rootJoint: Joint,
    jointCount: number
}