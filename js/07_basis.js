const seedBasis = (sketch) => {
    let normalFont
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
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasHeigth, sketch.canvasHeigth);
    }

    sketch.draw = () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt

        let isZero = followMouse(sketch, vector, maxVectorLen, 10, zeroThreshold, true)

        let norm = vecNorm(vector)
        let normRounded = Math.round(norm, 1)
        let direction = Math.atan2(vector.y, vector.x)
        
        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);
        
        // Grid
        // drawGrid(sketch, 5, 5, scale)

        // Draw vector
        let rx =  Math.round(10 * vector.x  / scale) / 10
        let ry = -Math.round(10 * vector.y / scale)  / 10

        // Scaled axis vectors
        sketch.strokeWeight(3)
        drawVector(sketch, 0, 0, vector.x, 0, COL_PINK)
        sketch.strokeWeight(3)
        drawVector(sketch, vector.x, 0, vector.x, vector.y, COL_LIGHTGREEN)
        
        // Vector
        sketch.textSize(DEFAULT_VECT_TEXT_SIZE)
        drawVectorOrZero(sketch, vector, isZero, COL_DARKGRAY, vec2(0,0))
            
        
        // Axis vectors
        sketch.strokeWeight(4)
        drawVectorText(sketch, 0, 0, scale, 0, COL_RED,   normalFont, "î")
        sketch.strokeWeight(4)
        drawVectorText(sketch, 0, 0, 0, -scale, COL_GREEN, normalFont, "ĵ", undefined, vec2(0, -1))
        // Coordinate numbers
        let textSize = sketch.textSize()
        sketch.stroke(COL_WHITE)
        sketch.textFont(normalFont)
        sketch.strokeWeight(3)
        sketch.textAlign(sketch.CENTER, sketch.CENTER)
        
        sketch.fill(COL_PINK)
        sketch.text(rx+"î", vector.x/2, -textSize)
        
        sketch.fill(COL_LIGHTGREEN)
        sketch.text(ry+"ĵ", vector.x + textSize, vector.y/2)

        // Column matrix
        let unitVec = normalizedVect(vector)
        let colArr = isZero ? [0, 0] : [rx, ry]
        drawColumnVector(sketch, unitVec.x*(norm + 40), unitVec.y*(norm + 40), colArr, normalFont, COL_DARKGRAY, [COL_RED, COL_GREEN])
        
        // Formula
        // let formulaY = sketch.screenOy - 50
        // sketch.textAlign(sketch.RIGHT)
        // sketch.noStroke()
        // sketch.fill(COL_PINK)
        // sketch.text(rx, -200, formulaY) 
        // sketch.fill(COL_LIGHTGREEN)
        // sketch.text(ry, -100, formulaY)
        
        // sketch.textAlign(sketch.LEFT)
        // sketch.textFont(boldFont)
        // sketch.fill(COL_RED)
        // sketch.text("î", -200, formulaY)
        // sketch.fill(COL_GREEN)
        // sketch.text("ĵ", -100, formulaY)
    }
};

let p5basis = new p5(seedBasis, "basis");