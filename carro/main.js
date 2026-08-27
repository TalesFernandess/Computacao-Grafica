const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// 1. VÉRTICES
// --------------------------------------------------

const vertices = new Float32Array([

    // CARROCERIA
    -0.5, -0.2,  
     0.5, -0.2,  
    -0.5,  0.1,  
     0.5,  0.1,  


    // CABINE
    -0.3,  0.1,  
     0.3,  0.1,  
     0.2,  0.3,  
    -0.2,  0.3,  


    // RODA ESQUERDA
    -0.4, -0.2,  
    -0.25, -0.2, 
    -0.4, -0.4,  
    -0.25, -0.4, 


    // RODA DIREITA
     0.25, -0.2,  
     0.4,  -0.2,  
     0.25, -0.4,  
     0.4,  -0.4   
]);


// --------------------------------------------------
// 2. CORES
// --------------------------------------------------

const colors = new Float32Array([

    // CARROCERIA - vermelho
    0.8, 0.0, 0.0,
    0.8, 0.0, 0.0,
    0.8, 0.0, 0.0,
    0.8, 0.0, 0.0,

    // CABINE - azul claro
    0.3, 0.7, 1.0,
    0.3, 0.7, 1.0,
    0.3, 0.7, 1.0,
    0.3, 0.7, 1.0,

    // RODAS - preto
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,


    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0
]);


// --------------------------------------------------
// 3. ÍNDICES
// --------------------------------------------------

const indices = new Uint16Array([

    // CARROCERIA
    0, 1, 3,
    0, 2, 3,

    // CABINE
    4, 5, 6,
    4, 6, 7,

    // RODA ESQUERDA
    8, 9, 11,
    8, 10, 11,

    // RODA DIREITA
    12, 13, 15,
    12, 14, 15
]);


// --------------------------------------------------
// 4. BUFFERS
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


const indicesBuffer = gl.createBuffer();

gl.bindBuffer(
    gl.ELEMENT_ARRAY_BUFFER,
    indicesBuffer
);

gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    indices,
    gl.STATIC_DRAW
);


// --------------------------------------------------
// 5. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {

    gl_Position = vec4(
        aPosition,
        0.0,
        1.0
    );

    vColor = aColor;
}
`;


// --------------------------------------------------
// 6. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {

    outColor = vec4(
        vColor,
        1.0
    );
}
`;


// --------------------------------------------------
// 7. COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(shader);

    if (!gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
    )) {

        const error =
            gl.getShaderInfoLog(shader);

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
// 8. PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(
    program,
    vertexShader
);

gl.attachShader(
    program,
    fragmentShader
);

gl.linkProgram(program);

if (!gl.getProgramParameter(
    program,
    gl.LINK_STATUS
)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 9. LOCAL DOS ATRIBUTOS
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
// 10. ATRIBUTO DOS VÉRTICES
// --------------------------------------------------

gl.bindBuffer(
    gl.ARRAY_BUFFER,
    verticesBuffer
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
// 11. ATRIBUTO DAS CORES
// --------------------------------------------------

gl.bindBuffer(
    gl.ARRAY_BUFFER,
    colorsBuffer
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
// 12. BUFFER DOS ÍNDICES
// --------------------------------------------------

gl.bindBuffer(
    gl.ELEMENT_ARRAY_BUFFER,
    indicesBuffer
);


// --------------------------------------------------
// 13. LIMPAR TELA
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
// 14. DESENHAR
// --------------------------------------------------

gl.useProgram(program);

gl.drawElements(
    gl.TRIANGLES,
    indices.length,
    gl.UNSIGNED_SHORT,
    0
);