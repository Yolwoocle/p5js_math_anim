
const seedScaling = (sketch) => {
    const size_ = 50;

    let epochTime
    let normalFont
    let boldFont

    let scaledVector = vec2(1,0)
    let regularVector = vec2(1,0)
    let reversedVector = vec2(1,0)
    const regularLen = 50
    
    const maxVectorLen = 200.5;
    const zeroThreshold = 5;

    sketch.preload = () => {
        sketch.canvasWidth =  500
        sketch.canvasHeigth = 500
        sketch.screenOx = sketch.canvasWidth/2
        sketch.screenOy = sketch.canvasHeigth/2

        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasHeigth, sketch.canvasHeigth);
    }

    sketch.draw = () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt

        // Follow mouse
        let targetX = sketch.mouseX - sketch.screenOx
        let targetY = sketch.mouseY - sketch.screenOy
        let d = distance(targetX, targetY)
        if(d > maxVectorLen) {
            targetX = targetX * (maxVectorLen / d)
            targetY = targetY * (maxVectorLen / d)
        }

        let lambda = clamp(dt*10, 0, 1)
        scaledVector.x = sketch.lerp(scaledVector.x, targetX, lambda)
        scaledVector.y = sketch.lerp(scaledVector.y, targetY, lambda)
        reversedVector.x = sketch.lerp(reversedVector.x, -targetX, lambda)
        reversedVector.y = sketch.lerp(reversedVector.y, -targetY, lambda)

        let dir = Math.atan2(scaledVector.y, scaledVector.x)
        clampVector(scaledVector, maxVectorLen)
        clampVector(reversedVector, maxVectorLen)
        
        // Ajust vectors
        regularVector = getRadialVector(dir, regularLen)
        
        //////////////////////////////////////////////
        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);
        
        // Draw vector
        sketch.strokeWeight(3)
        let scaleFactorRounded =    Math.floor(vecNorm(scaledVector)  /regularLen * 10)/10
        let revScaleFactorRounded = Math.floor(vecNorm(reversedVector)/regularLen * 10)/10

        sketch.strokeWeight(3)
        if(scaleFactorRounded <= 0) {
            sketch.noStroke()
            sketch.fill(COL_PINK)
            sketch.circle(0, 0, ZERO_VECT_RADIUS)
            scaledVectText = "0v"
        } else {
            drawVector(sketch, 0, 0, scaledVector.x, scaledVector.y, COL_PINK)
            drawVector(sketch, 0, 0, reversedVector.x, reversedVector.y, COL_PINK)
        }
        sketch.strokeWeight(5)
        drawVector(sketch, 0, 0, regularVector.x, regularVector.y, COL_RED)

        // Draw vector text
        drawVectorlessText(sketch, 
            0, 0, scaledVector.x, scaledVector.y, 
            COL_PINK, normalFont, `${scaleFactorRounded}v`, 
            undefined, vec2(0,-1.3))
        drawVectorlessText(sketch, 
            0, 0, reversedVector.x, reversedVector.y, 
            COL_PINK, normalFont, `${-revScaleFactorRounded}v`, 
            undefined, vec2(0,-1.3))
        drawVectorlessText(sketch, 
            0, 0, regularVector.x, regularVector.y, 
            COL_RED, normalFont, "v")
    }
};

let p5vectorScling = new p5(seedScaling, "vectorScaling");