
const seedScaling = (sketch) => {
    const size_ = 50;

    let epochTime
    let normalFont
    let boldFont

    let vector = vec2(1,0)
    
    const maxVectorLen = 200.5;
    const zeroThreshold = 5;

    const scale_ = 50;

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

        let targetX = sketch.mouseX - sketch.screenOx
        let targetY = sketch.mouseY - sketch.screenOy
        let d = distance(targetX, targetY)
        vector.x = sketch.lerp(vector.x, targetX, clamp(dt*10, 0, 1))
        vector.y = sketch.lerp(vector.y, targetY, clamp(dt*10, 0, 1))

        let norm = vecNorm(vector)
        let normRounded = Math.round(norm, 1)
        let direction = Math.atan2(vector.y, vector.x)
        
        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);
        
        // Draw vector
        sketch.strokeWeight(3)
        let nvx = scale_ * vector.x / norm
        let nvy = scale_ * vector.y / norm
        let lightRed = sketch.lerpColor(sketch.color(COL_RED), sketch.color(COL_WHITE), 0.5)
        let scaleFactorRounded = Math.floor(norm/scale_ * 10)/10
        let scaledVectText = `${scaleFactorRounded}v`

        if(scaleFactorRounded > 0.2) {
            drawVector(sketch, 0, 0, vector.x, vector.y, lightRed)
        } else {
            sketch.noStroke()
            sketch.fill(lightRed)
            sketch.circle(0, 0, ZERO_VECT_RADIUS)
            scaledVectText = "0v"
        }
        drawVector(sketch, 0, 0, nvx, nvy,           COL_RED)
        drawVectorlessText(sketch, 0, 0, vector.x, vector.y, lightRed, normalFont, scaledVectText, undefined, vec2(0,-1.3))
        drawVectorlessText(sketch, 0, 0, nvx, nvy,           COL_RED, normalFont, "v")
    }
};

let p5vectorScling = new p5(seedScaling, "vectorScaling");