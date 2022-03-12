let field;
let brush;
let res;
let maxW;
let maxH;
let img;
let imgLoaded;
let isPaused;

// dom elements
let fileInput,
    uploadInput,
    saveInput,
    seedInput,
    clearInput,
    pauseInput;
let strokeLengthInput,
    strokeDeviationInput,
    brushSizeInput,
    brushDeviationInput,
    opacityInput,
    curvinessInput,
    iterationsInput;

function setup() {
    // bind dom elements
    pauseInput = select("#pause-input");
    clearInput = select("#clear-input");
    seedInput = select("#seed-input");
    saveInput = select("#save-input");
    uploadInput = select("#upload-input");
    fileInput = select("#file-input")

    strokeLengthInput = select("#stroke-length-input");
    strokeDeviationInput = select("#stroke-deviation-input");
    brushSizeInput = select("#brush-size-input");
    brushDeviationInput = select("#brush-deviation-input");
    opacityInput = select("#opacity-input");
    curvinessInput = select("#curviness-input");
    iterationsInput = select("#iterations-input");

    // handle input events
    uploadInput.mousePressed(() => fileInput.elt.click()); // trigger fileInput
    fileInput.changed(fileReceived);
    saveInput.mousePressed(saveCanvas);
    seedInput.mousePressed(updateSeed);
    clearInput.mousePressed(clearCanvas);
    pauseInput.mousePressed(togglePause);

    strokeLengthInput.input(updateSliderValues);
    strokeDeviationInput.input(updateSliderValues);
    brushSizeInput.input(updateSliderValues);
    brushDeviationInput.input(updateSliderValues);
    opacityInput.input(updateSliderValues);
    curvinessInput.input(updateCurviness);
    iterationsInput.input(updateSliderValues);

    // prepare sketch
    updateSliderValues();
    res = 10;
    imgLoaded = false;
    isPaused = false;
    maxW = floor(windowWidth * 0.8);
    maxH = floor(windowHeight * 0.5);
    let canvas = createCanvas(maxW, maxH);
    canvas.parent("#canvas-container");
    clearCanvas();
    textAlign(CENTER);
    textSize(16);
    text("Please upload an image to start!", width * 0.5, height * 0.5);
    field = new Flowfield(width, height, res, curvinessInput.value());
}

function draw() {
    if (!imgLoaded || isPaused)
        return;

    // fade out effect 
    // background(255, 0.5);

    for (let i = 0; i < iterationsInput.value(); i++) {
        if (!brush || brush.isDead() || brush.isOutside(width, height)) {
            let x = random(width);
            let y = random(height);
            let vel = field.getVectorAtPos(x, y);
            let c = img.get(x, y);
            let strokeLen = strokeLengthInput.value();
            let strokeDev = strokeDeviationInput.value();
            let brushSize = brushSizeInput.value();
            let brushDev = brushDeviationInput.value();
            let opacity = opacityInput.value();
            brush = new Particle(x, y, vel, strokeLen, strokeDev, brushSize, brushDev, c, opacity);
        }
        brush.steer(field);
        brush.update();
        brush.show();
    }
}

function fileReceived(event) {
    let file = event.target.files[0];

    // reject non-image files
    if (!file || file.type.split("/")[0] !== "image")
        return;

    // load file
    imgLoaded = false;
    let path = URL.createObjectURL(file)
    img = loadImage(path, () => {
        // scale image
        let ratioX = maxW / img.width;
        let ratioY = maxH / img.height;
        let ratio = min(ratioX, ratioY);
        let w = floor(img.width * ratio);
        let h = floor(img.height * ratio);
        img.resize(w, h);

        // init canvas
        resizeCanvas(w, h);
        clearCanvas();
        field = new Flowfield(width, height, res, curvinessInput.value());
        brush = null;
        imgLoaded = true
    });
}

function clearCanvas() {
    background(255);
}

function updateSeed() {
    let seed = round(random(Number.MAX_SAFE_INTEGER));
    field.generateField(curvinessInput.value(), seed);
}

function togglePause() {
    isPaused = !isPaused
    if (isPaused) {
        pauseInput.value("Paint");
    } else {
        pauseInput.value("Pause");
    }
}

function updateCurviness() {
    field.generateField(curvinessInput.value());
    updateSliderValues();
}

function updateSliderValues() {
    select("#stroke-length").html(strokeLengthInput.value());
    select("#stroke-deviation").html(strokeDeviationInput.value());
    select("#brush-size").html(brushSizeInput.value());
    select("#brush-deviation").html(brushDeviationInput.value());
    select("#opacity").html(opacityInput.value());
    select("#curviness").html(curvinessInput.value());
    select("#iterations").html(iterationsInput.value());
}