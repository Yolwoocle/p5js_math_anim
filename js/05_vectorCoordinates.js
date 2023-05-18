const seedVectorCoordinates = (sketch) => {
    const size_ = 50;

    let basis = {
        i : vec2(1, 0),
        j : vec2(0, -1)
    }

    let vectorsRadius = 200
    let epochTime
    let normalFont
    let boldFont
    let vector
    
    const zeroThreshold = 10;
    const maxVectorLen = 200;

    let scale = 40

    sketch.preload = () => {
        sketch.canvasWidth =  560
        sketch.canvasHeigth = 580
        sketch.screenOx = sketch.canvasWidth/2
        sketch.screenOy = sketch.canvasHeigth/2
        
        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()

        vector = vec2(-1,2);

        let magField = document.getElementById("magnitudeField");
        let dirField = document.getElementById("directionField");
        magField.innerHTML = `(<span id="magnitudeFieldValue"></span>)`;
        dirField.innerHTML = `(
            <span id="directionFieldArrow" class="material-symbols-outlined">
                arrow_forward
            </span>
        )`;
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasHeigth, sketch.canvasHeigth);
    }

    sketch.draw = () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt

        let isZero = followMouse(sketch, vector, maxVectorLen, 10, zeroThreshold)

        let norm = vecNorm(vector)
        let normRounded = Math.round(norm, 1)
        let direction = Math.atan2(vector.y, vector.x)
        
        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);
        
        drawGrid(sketch, 5, 5, scale)

        // Draw vector
        // let font_ = isZero ? boldFont : normalFont
        let rx =  Math.round(10 * vector.x  / scale) / 10
        let ry = -Math.round(10 * vector.y / scale)  / 10

        let unitVec = normalizedVect(vector)
        let colArr = isZero ? [0, 0] : [rx, ry]
        drawColumnVector(sketch, unitVec.x*(norm + 40), unitVec.y*(norm + 40), colArr, normalFont, COL_DARKGRAY, [COL_RED, COL_GREEN])
    
        // Coordinate lines from axies to vector
        // sketch.strokeWeight(3)
        // sketch.stroke(COL_PINK)
        // sketch.line(vector.x, 0, vector.x, vector.y)
        // sketch.stroke(COL_LIGHTGREEN)
        // sketch.line(0, vector.y, vector.x, vector.y)
        
        // Coordinate lines on axies
        sketch.strokeWeight(4)
        sketch.stroke(COL_RED)
        sketch.line(0, 0, vector.x, 0)
        sketch.stroke(COL_GREEN)
        sketch.line(vector.x, 0, vector.x, vector.y)
    
        sketch.textSize(DEFAULT_VECT_TEXT_SIZE)
        drawVectorOrZero(sketch, vector, isZero, COL_DARKGRAY, vec2(0,0))
        
        // Coordinate numbers
        let textSize = sketch.textSize()
        sketch.stroke(COL_WHITE)
        sketch.textFont(normalFont)
        sketch.strokeWeight(3)
        sketch.fill(COL_RED)
        sketch.textAlign(sketch.CENTER, sketch.CENTER)
        sketch.text(rx, vector.x/2, -textSize)
        sketch.fill(COL_GREEN)
        sketch.text(ry, vector.x + textSize, vector.y/2)
    }
};

let p5vectorCoordinates = new p5(seedVectorCoordinates, "vectorCoordinates");