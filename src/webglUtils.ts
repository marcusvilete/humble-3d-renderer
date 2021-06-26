export class webglUtils {

    static loadFromScript(gl: WebGLRenderingContext, shaderElem: HTMLScriptElement, shaderType: GLenum): WebGLShader {
        let shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderElem.text);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Something went wrong when compiling a vertex shader. More info:", gl.getShaderInfoLog(shader));
            return;
        }

        return shader;
    }

    static createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Something went wrong when compiling a vertex shader. More info:", gl.getShaderInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
}