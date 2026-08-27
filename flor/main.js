const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VERTICES
// --------------------------------------------------

const vertices = new Float32Array([
    // MIOLO
    -0.05, 0.35,
     0.05, 0.35,
    -0.05, 0.45,
     0.05, 0.45,

    // PÉTALAS
    -0.05, 0.45,
     0.05, 0.45,
     0.00, 0.60,

    -0.05, 0.35,
     0.05, 0.35,
     0.00, 0.20,

    -0.05, 0.35,
    -0.05, 0.45,
    -0.20, 0.40,

     0.05, 0.35,
     0.05, 0.45,
     0.20, 0.40,

    // CAULE
     -0.02, 0.20,
     0.02, 0.20,
     -0.02, -0.5,
     0.02, -0.5
]);


// --------------------------------------------------
// 1. CORES
// --------------------------------------------------

const colors = new Float32Array([
    // MIOLO - amarelo
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,

    // PÉTALAS - rosa
    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,

    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,

    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,

    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,
    1.0, 0.2, 0.6,

    // CAULE - verde
    0.0, 0.6, 0.1,
    0.0, 0.6, 0.1,
    0.0, 0.6, 0.1,
    0.0, 0.6, 0.1
]);

// --------------------------------------------------
// 1. INDICES
// --------------------------------------------------

const indices = new Uint16Array([
    //Indices dos dois triângulos que formam o quadrado
    0, 1, 3,
    0, 2, 3, 

     // CAULE
    16, 17, 19,
    16, 18, 19
]);


// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
);

const colorsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW
);

const indicesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vColor = aColor;
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}

`;


// --------------------------------------------------
// 5. COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const colorLocation =
    gl.getAttribLocation(
        program,
        "aColor"
    );


// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.enableVertexAttribArray(colorLocation);

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// --------------------------------------------------
// 9. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

gl.useProgram(program);

gl.drawElements(
    gl.TRIANGLES,
    indices.length,
    gl.UNSIGNED_SHORT,
    0
);

gl.drawArrays(
    gl.TRIANGLES,
    4,
    12
);