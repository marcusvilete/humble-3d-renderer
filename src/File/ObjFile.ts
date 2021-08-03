import { Face, Mesh } from "../Rendering/mesh";
import { Vector2, Vector3 } from "../Rendering/vector";

export class ObjParser {
    static parse(text: string): Mesh[] {
        let meshes: Mesh[] = [];
        let currentMesh = new Mesh();
        meshes.push(currentMesh);
        //lets arrange this so its easier to access when reading face data
        let data = [currentMesh.vertices, currentMesh.uvCoords, currentMesh.normals];

        //data from file
        let allPositions: Vector3[] = [new Vector3()]; //1-based array, just ignore the zero-th position
        let allTexCoords: Vector2[] = [new Vector2()]; //1-based array, just ignore the zero-th position
        let allNormals: Vector3[] = [new Vector3()]; //1-based array, just ignore the zero-th position
        //lets arrange this so its easier to access when reading face data
        let allData = [allPositions, allTexCoords, allNormals];

        let keywords: { [funcName: string]: (parts: string[]) => void; } = {
            v(parts: string[]) {
                const numbers = parts.map(parseFloat);
                allPositions.push(new Vector3(numbers[0], numbers[1], numbers[2]));
            },
            vn(parts: string[]) {
                const numbers = parts.map(parseFloat);
                allNormals.push(new Vector3(numbers[0], numbers[1], numbers[2]));
            },
            vt(parts: string[]) {
                const numbers = parts.map(parseFloat);
                allTexCoords.push(new Vector3(numbers[0], numbers[1], numbers[2]));
            },
            f(parts: string[]) {
                const numTriangles = parts.length - 2;
                for (let tri = 0; tri < numTriangles; ++tri) {
                    addVertex(parts[0]);
                    addVertex(parts[tri + 1]);
                    addVertex(parts[tri + 2]);
                }
            },
            usemtl(parts: string[]) {
                if (currentMesh.vertices.length > 0) {
                currentMesh = new Mesh();
                meshes.push(currentMesh);
                data = [currentMesh.vertices, currentMesh.uvCoords, currentMesh.normals];
                }
            },
            o(parts: string[]) {
                if (currentMesh.vertices.length > 0) {
                    currentMesh = new Mesh();
                    meshes.push(currentMesh);
                    data = [currentMesh.vertices, currentMesh.uvCoords, currentMesh.normals];
                }
            },
        };

        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = text.split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
                continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
                //console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
                continue;
            }
            handler(parts);
        }

        function addVertex(vert: string) {
            const ptn = vert.split('/');
            ptn.forEach((objIndexStr, i) => {
                if (!objIndexStr) {
                    return;
                }
                const objIndex = parseInt(objIndexStr);
                const index = objIndex + (objIndex >= 0 ? 0 : allData[i].length);
                data[i].push(allData[i][index]);
            });
        }
        return meshes;
    }
}