const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

const canvasCoordinates =
    document.getElementById(
        "canvasCoordinates"
    );

const webglCoordinates =
    document.getElementById(
        "webglCoordinates"
    );

const colorBox =
    document.getElementById(
        "colorBox"
    );

const colorName =
    document.getElementById(
        "colorName"
    );

// --------------------------------------------------
// 1a. VERTICES
// --------------------------------------------------

let vertices = new Float32Array([0.0,0.0]);


// --------------------------------------------------
// 1b. CORES
// --------------------------------------------------

let currentColor = [1.0, 0.0, 0.0];
let colors = new Float32Array([1.0, 0.0, 0.0]);

// --------------------------------------------------
// 1c. TAMANHO DOS PONTOS
// --------------------------------------------------

let pointSizes = new Float32Array([10.0]);
let pointSizes_aux = 10.0;

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

const pointSizesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    pointSizes,
    gl.STATIC_DRAW
);

// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;
in float aPointSize;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    gl_PointSize = aPointSize;
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

const pointSizeLocation =
    gl.getAttribLocation(
        program,
        "aPointSize"
    );

// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
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

gl.bindBuffer(
    gl.ARRAY_BUFFER,
    pointSizesBuffer
);

gl.enableVertexAttribArray(
    pointSizeLocation
);

gl.vertexAttribPointer(
    pointSizeLocation,
    1,
    gl.FLOAT,
    false,
    0,
    0
);

// --------------------------------------------------
// 9. BRESENHAM
// --------------------------------------------------

function bresenham(x0, y0, x1, y1) {

    let pontos = [];

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;

    let erro = dx - dy;

    while (true) {

        pontos.push([x0, y0]);

        if (x0 === x1 && y0 === y1) {
            break;
        }

        let e2 = 2 * erro;

        if (e2 > -dy) {

            erro -= dy;

            x0 += sx;
        }

        if (e2 < dx) {

            erro += dx;

            y0 += sy;
        }
    }

    return pontos;
}

// --------------------------------------------------
// 10. MOUSE
// --------------------------------------------------

let x1;
let y1;

canvas.addEventListener(
    "mousedown",
    mouseClick,
    false
);

function mouseClick(event) {

    const x = event.offsetX;
    const y = event.offsetY;

    // ----------------------------------------------
    // PRIMEIRO CLIQUE
    // ----------------------------------------------

    if (x1 === undefined) {

        x1 = x;
        y1 = y;

        canvasCoordinates.textContent =
            `P1: (${x1}, ${y1})`;

        return;
    }

    // ----------------------------------------------
    // SEGUNDO CLIQUE
    // ----------------------------------------------

    const x2 = x;
    const y2 = y;

    canvasCoordinates.textContent =
        `P1: (${x1}, ${y1}) P2: (${x2}, ${y2})`;


    const pontos =
        bresenham(x1, y1, x2, y2);


    let verticesArray = [];

    for (let ponto of pontos) {

        const px = ponto[0];
        const py = ponto[1];

        const webglX =
            (px / canvas.width) * 2 - 1;

        const webglY =
            -((py / canvas.height) * 2 - 1);

        verticesArray.push(
            webglX,
            webglY
        );
    }

    vertices =
        new Float32Array(verticesArray);

    const webglX =
        (x2 / canvas.width) * 2 - 1;

    const webglY =
        -((y2 / canvas.height) * 2 - 1);

    webglCoordinates.textContent =
        `WebGL P2: (${webglX.toFixed(3)}, ${webglY.toFixed(3)})`;

    // ----------------------------------------------
    // CRIAR CORES PARA TODOS OS PONTOS
    // ----------------------------------------------

    const quantidadePontos =
        vertices.length / 2;

    colors =
        new Float32Array(
            quantidadePontos * 3
        );

    for (
        let i = 0;
        i < colors.length;
        i += 3
    ) {

        colors[i] =
            currentColor[0];

        colors[i + 1] =
            currentColor[1];

        colors[i + 2] =
            currentColor[2];
    }


    pointSizes =
        new Float32Array(
            quantidadePontos
        );

    for (
        let i = 0;
        i < pointSizes.length;
        i++
    ) {

        pointSizes[i] =
            pointSizes_aux;
    }

    // ----------------------------------------------
    // ATUALIZAR VERTICES
    // ----------------------------------------------

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        vertices,
        gl.STATIC_DRAW
    );

    // ----------------------------------------------
    // ATUALIZAR CORES
    // ----------------------------------------------

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        colorsBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        colors,
        gl.STATIC_DRAW
    );

    // ----------------------------------------------
    // ATUALIZAR TAMANHOS
    // ----------------------------------------------

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        pointSizesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        pointSizes,
        gl.STATIC_DRAW
    );

    // ----------------------------------------------
    // TERMINOU A RETA
    // ----------------------------------------------

    x1 = undefined;
    y1 = undefined;

    drawScene();
}

// --------------------------------------------------
// 11. TECLADO / CORES
// --------------------------------------------------

document.addEventListener(
    "keydown",
    keyboardClick,
    false
);

function keyboardClick(event) {

    switch(event.key) {
        case "ArrowUp":
            pointSizes_aux += 1.0;
            break;
        case "ArrowDown":
            pointSizes_aux -= 1.0;
            if (pointSizes_aux < 1.0) {
                pointSizes_aux = 1.0;
            }
            break;


        case "0":
            currentColor =
                [1.0, 1.0, 1.0];
            colorBox.style.backgroundColor =
                "white";
            break;

        case "1":
            currentColor =
                [1.0, 0.0, 0.0];

            colorBox.style.backgroundColor =
                "red";
            break;

        case "2":
            currentColor =
                [0.0, 1.0, 0.0];
            colorBox.style.backgroundColor =
                "green";
            break;

        case "3":
            currentColor =
                [0.0, 0.0, 1.0];
            colorBox.style.backgroundColor =
                "blue";
            break;

        case "4":
            currentColor =
                [1.0, 1.0, 0.0];
            colorBox.style.backgroundColor =
                "yellow";
            break;

        case "5":
            currentColor =
                [1.0, 0.0, 1.0];
            colorBox.style.backgroundColor =
                "magenta";

            break;

        case "6":
            currentColor =
                [0.0, 1.0, 1.0];
            colorBox.style.backgroundColor =
                "cyan";
            break;

        case "7":
            currentColor =
                [1.0, 0.5, 0.0];
            colorBox.style.backgroundColor =
                "orange";
            break;

        case "8":
            currentColor =
                [0.5, 0.0, 1.0];
            colorBox.style.backgroundColor =
                "purple";
            break;

        case "9":
            currentColor =
                [1.0, 0.4, 0.7];
            colorBox.style.backgroundColor =
                "pink";
            break;

        default:

            return;
    }

    const quantidadePontos =
        vertices.length / 2;

    colors =
        new Float32Array(
            quantidadePontos * 3
        );

    for (
        let i = 0;
        i < colors.length;
        i += 3
    ) {

        colors[i] =
            currentColor[0];

        colors[i + 1] =
            currentColor[1];

        colors[i + 2] =
            currentColor[2];
    }


    pointSizes =
        new Float32Array(
            quantidadePontos
        );

    for (
        let i = 0;
        i < pointSizes.length;
        i++
    ) {

        pointSizes[i] =
            pointSizes_aux;
    }


    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        colorsBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        colors,
        gl.STATIC_DRAW
    );


    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        pointSizesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        pointSizes,
        gl.STATIC_DRAW
    );

    drawScene();
}

// --------------------------------------------------
// 12. LIMPAR TELA
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
// 13. DESENHAR
// --------------------------------------------------

const numComponents = 2;

gl.useProgram(program);

function drawScene() {

    gl.clear(
        gl.COLOR_BUFFER_BIT
    );

    gl.useProgram(program);

    gl.drawArrays(
        gl.POINTS,
        0,
        vertices.length / numComponents
    );
}

drawScene();