
const seedAddition = (sketch) => {
    const size_ = 50;

    let epochTime
    let normalFont
    let boldFont

    let v1
    let v2
    let v2textOffsetY = 0;
    
    const maxVectorLen = 200;
    const zeroThreshold = 20;

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
        
        let a1 = Math.random() * 2*Math.PI
        let a2 = a1 + Math.random() * Math.PI
        let r1 = 100
        let r2 = 100
        v1 = {
            v: vec2(Math.cos(a1)*r1, Math.sin(a1)*r1),
            spd: vec2(0, 0)
        }
        v2 = {
            v: vec2(Math.cos(a2)*r2, Math.sin(a2)*r2),
            spd: vec2(0, 0),
            dir: a2
        }
    }

    sketch.draw = () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt

        let isV1zero = false
        let targetX = sketch.mouseX - sketch.screenOx
        let targetY = sketch.mouseY - sketch.screenOy
        let d = distance(targetX, targetY)

        // Set v to 0 if mouse is close to origin
        if (d <= zeroThreshold) {
            targetX *= 0.2
            targetY *= 0.2
            isV1zero = true
        }
        
        // Lerp v to mouse
        v1.v.x = sketch.lerp(v1.v.x, targetX, clamp(dt*10, 0, 1))
        v1.v.y = sketch.lerp(v1.v.y, targetY, clamp(dt*10, 0, 1))
        clampVector(v1.v, maxVectorLen)

        // Set w 
        let lenV1 = vecNorm(v1.v)
        let angV1 = Math.atan2(v1.v.y, v1.v.x)
        let l = Math.max(100, maxVectorLen-lenV1)
        let ang = -angV1 + (0.5*Math.PI * lenV1/maxVectorLen)
        v2.v.x = sketch.lerp(v2.v.x, Math.cos(ang)*l, clamp(dt*10, 0, 1))
        v2.v.y = sketch.lerp(v2.v.y, Math.sin(ang)*l, clamp(dt*10, 0, 1))
        clampVector(v2.v, maxVectorLen)

        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);

        // w
        if (isV1zero) {
            sketch.strokeWeight(8)
        } else {
            sketch.strokeWeight(3)
        }
        drawVector(sketch, v1.v.x, v1.v.y, v1.v.x+v2.v.x, v1.v.y+v2.v.y, COL_BLUE)   
        
        // v + w
        // sketch.strokeWeight(5)
        // drawVector(sketch, 0, 0, v1.v.x+v2.v.x, v1.v.y+v2.v.y, COL_WHITE)
        sketch.strokeWeight(3)
        drawVector(sketch, 0, 0, v1.v.x+v2.v.x, v1.v.y+v2.v.y, COL_PURPLE)
        
        // v
        sketch.strokeWeight(3)
        if (isV1zero) {
            sketch.noStroke()
            sketch.fill(COL_RED)

            sketch.circle(v1.v.x, v1.v.y, ZERO_VECT_RADIUS)
            
            sketch.stroke(COL_RED)
        } else {
            sketch.strokeWeight(3)
            drawVector(sketch, 0, 0, v1.v.x, v1.v.y, COL_RED)
        }

        // Vector labels
        let font_ = normalFont
        if (isV1zero) {
            v2textOffsetY = sketch.lerp(v2textOffsetY, -1, dt*10)
            
            drawVectorlessText(sketch, 
                0, 0, v1.v.x+v2.v.x, v1.v.y+v2.v.y, 
                COL_PURPLE, font_, "0+w"
            )
            drawVectorlessText(sketch, 
                v1.v.x, v1.v.y, v1.v.x+v2.v.x, v1.v.y+v2.v.y,
                COL_BLUE, font_, "w", undefined, vec2(0,v2textOffsetY)
            )        
            drawVectorlessText(sketch, 0, 0, v1.v.x, v1.v.y, COL_RED, font_, "0")    
        } else {
            v2textOffsetY = sketch.lerp(v2textOffsetY, 1, dt*10)

            sketch.strokeWeight(3)
            drawVectorlessText(sketch, 
                0, 0, v1.v.x+v2.v.x, v1.v.y+v2.v.y, 
                COL_PURPLE, font_, "v+w"
            )
            drawVectorlessText(sketch, 
                0, 0, v1.v.x, v1.v.y, 
                COL_RED, font_, "v"
            )
            drawVectorlessText(sketch, 
                v1.v.x, v1.v.y, v1.v.x+v2.v.x, v1.v.y+v2.v.y, 
                COL_BLUE, font_, "w", undefined, vec2(0,v2textOffsetY)
            )
        }
    }
};

let p5vectorAddition = new p5(seedAddition, "vectorAddition");