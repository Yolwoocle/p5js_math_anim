const seedVectorNoPosition = (sketch) => {
    const size_ = 50;

    let vectorsRadius = 200
    let epochTime
    let normalFont
    let boldFont
    let vector

    let vectorPositions = [];
    let numberVectors = 10;
    
    const zeroThreshold = 15;
    const maxVectorLen = 90;

    sketch.preload = () => {
        sketch.canvasHeigth = 450
        sketch.canvasWidth =  450
        sketch.screenOx = sketch.canvasWidth/2
        sketch.screenOy = sketch.canvasHeigth/2
        
        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()

        vector = vec2(-1,2);
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasHeigth, sketch.canvasHeigth);

        vectorPositions = generateVectorsCircle(150, numberVectors)
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
        
        // Draw vector
        let font_ = normalFont
        vectorPositions.forEach(pos => {
            drawVectorOrZero(sketch, vector, isZero, COL_PINK, pos, font_, "v", "0")
        });
        drawVectorOrZero(sketch, vector, isZero, COL_RED, vec2(0,0), font_, "v", 0)
    }
};

let p5vectorNoPosition = new p5(seedVectorNoPosition, "vectorNoPosition");