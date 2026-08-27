const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VÉRTICES
// --------------------------------------------------

const vertices = new Float32Array([
    // CORPO
    -0.2,  0.3,
     0.2,  0.3,
     0.2, -0.3,

    -0.2,  0.3,
    -0.2, -0.3,
     0.2, -0.3,


    // CABEÇA
    -0.1,  0.3,
    -0.1,  0.5,
     0.1,  0.3,

     0.1,  0.5,
     0.1,  0.3,
    -0.1,  0.5,


    // BRAÇO ESQUERDO
    -0.3,  0.3,
    -0.2,  0.3,
    -0.2, -0.1,

    -0.3,  0.3,
    -0.3, -0.1,
    -0.2, -0.1,


    // BRAÇO DIREITO
     0.2,  0.3,
     0.3,  0.3,
     0.3, -0.1,

     0.2,  0.3,
     0.3, -0.1,
     0.2, -0.1,


    // PERNA ESQUERDA
    -0.2, -0.3,
    -0.05, -0.3,
    -0.05, -0.6,

    -0.2, -0.3,
    -0.2, -0.6,
    -0.05, -0.6,


    // PERNA DIREITA
     0.05, -0.3,
     0.2,  -0.3,
     0.2,  -0.6,

     0.05, -0.3,
     0.05, -0.6,
     0.2,  -0.6,


    // OLHO ESQUERDO
    -0.075, 0.40,
    -0.025, 0.40,
    -0.025, 0.45,

    -0.075, 0.40,
    -0.075, 0.45,
    -0.025, 0.45,


    // OLHO DIREITO
     0.025, 0.40,
     0.075, 0.40,
     0.075, 0.45,

     0.025, 0.40,
     0.025, 0.45,
     0.075, 0.45,


    // ANTENA
    -0.015, 0.5,
     0.015, 0.5,
     0.015, 0.65,

    -0.015, 0.5,
    -0.015, 0.65,
     0.015, 0.65,


    // TOPO DA ANTENA
    -0.03, 0.65,
     0.03, 0.65,
     0.03, 0.70,

    -0.03, 0.65,
    -0.03, 0.70,
     0.03, 0.70
]);


// --------------------------------------------------
// 2. CORES
// --------------------------------------------------

const colors = new Float32Array([
    // CORPO 
    0.25, 0.30, 0.35,
    0.25, 0.30, 0.35,
    0.25, 0.30, 0.35,
    0.25, 0.30, 0.35,
    0.25, 0.30, 0.35,
    0.25, 0.30, 0.35,

    // CABEÇA 
    0.55, 0.60, 0.65,
    0.55, 0.60, 0.65,
    0.55, 0.60, 0.65,
    0.55, 0.60, 0.65,
    0.55, 0.60, 0.65,
    0.55, 0.60, 0.65,

    // BRAÇO ESQUERDO
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,

    // BRAÇO DIREITO
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,
    0.35, 0.40, 0.45,

    // PERNA ESQUERDA
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,

    // PERNA DIREITA
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,
    0.30, 0.35, 0.40,

    // OLHO ESQUERDO 
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,

    // OLHO DIREITO 
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,

    // ANTENA 
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,

    // TOPO DA ANTENA 
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1,
    0.8, 0.3, 0.1
]);


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
// 8. BUFFER DOS VÉRTICES
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

gl.bindBuffer(
    gl.ARRAY_BUFFER,
    verticesBuffer
);

gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
);

gl.enableVertexAttribArray(
    positionLocation
);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);


// --------------------------------------------------
// 9. BUFFER DAS CORES
// --------------------------------------------------

const colorsBuffer = gl.createBuffer();

gl.bindBuffer(
    gl.ARRAY_BUFFER,
    colorsBuffer
);

gl.bufferData(
    gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW
);

gl.enableVertexAttribArray(
    colorLocation
);

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
);


// --------------------------------------------------
// 10. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
);

gl.clear(
    gl.COLOR_BUFFER_BIT
);


// --------------------------------------------------
// 11. DESENHAR
// --------------------------------------------------

gl.useProgram(program);

gl.drawArrays(
    gl.TRIANGLES,
    0,
    60
);