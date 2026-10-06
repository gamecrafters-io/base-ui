// Compiles one shader, and hands back nothing rather than a shader that will not run
function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Links a vertex shader and a fragment shader into a program. The shaders are let go of once the
// program holds them, since it is the program that is used and deleted from here on
export function createProgram(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string,
): WebGLProgram | null {
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertex || !fragment) {
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        return null;
    }

    const program = gl.createProgram();

    if (program) {
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
    }

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!program) return null;

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

// Where each of the named uniforms is found on the program, under the name it was asked for
export function getUniformLocations<TName extends string>(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    names: readonly TName[],
): Record<TName, WebGLUniformLocation | null> {
    const locations = {} as Record<TName, WebGLUniformLocation | null>;

    for (const name of names) {
        locations[name] = gl.getUniformLocation(program, name);
    }

    return locations;
}

// Where each of the named attributes is found on the program. An attribute the program does not
// read, or one the compiler threw away, comes back as minus one
export function getAttribLocations<TName extends string>(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    names: readonly TName[],
): Record<TName, number> {
    const locations = {} as Record<TName, number>;

    for (const name of names) {
        locations[name] = gl.getAttribLocation(program, name);
    }

    return locations;
}
