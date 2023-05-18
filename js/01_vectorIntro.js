const canvasWidth =  420
const canvasHeigth = 420

const seedVectorIntro = (sketch) => {
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
    
    const zeroThreshold = 30;
    const maxVectorLen = 200;

    sketch.preload = () => {
        sketch.canvasHeigth = 450
        sketch.canvasWidth =  450
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

        let targetX = sketch.mouseX - sketch.screenOx
        let targetY = sketch.mouseY - sketch.screenOy
        let d = distance(targetX, targetY)
        let isZero = false;
        // Clamp vector magnitude
        if (maxVectorLen <= d) {
            let ajustement = maxVectorLen / d
            targetX = targetX * ajustement 
            targetY = targetY * ajustement
        } else if (d <= zeroThreshold) {
            targetX = targetX*0.2;
            targetY = targetY*0.2;
            isZero = true;
        }
        vector.x = sketch.lerp(vector.x, targetX, clamp(dt*10, 0, 1))
        vector.y = sketch.lerp(vector.y, targetY, clamp(dt*10, 0, 1))

        let norm = vecNorm(vector)
        let normRounded = Math.round(norm, 1)
        let direction = Math.atan2(vector.y, vector.x)
        
        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);
        
        // Draw vector
        if (isZero) {
            // sketch.strokeWeight(3)
            // sketch.stroke(COL_RED)
            // sketch.line(0, 0, vector.x, vector.y)
            
            sketch.noStroke()
            sketch.fill(COL_RED)
            sketch.circle(vector.x, vector.y, ZERO_VECT_RADIUS)
            drawVectorlessText(sketch, 0, 0, vector.x, vector.y, COL_RED, normalFont, "0")
        } else {
            sketch.strokeWeight(3)
            drawVectorText(sketch, 0, 0, vector.x, vector.y, COL_RED, normalFont, normRounded)
        }

        // Modify HTML
        let magField = document.getElementById("magnitudeFieldValue");
        let dirArrow = document.getElementById("directionFieldArrow");
        if (isZero) {
            dirArrow.innerText = "block"
            magField.innerText = `0`
            dirArrow.style.transform = `rotate(0rad)`;
        } else {
            dirArrow.innerText = "arrow_forward"
            magField.innerText = `${normRounded}`
            dirArrow.style.transform = `rotate(${direction}rad)`;
        }
        
    }
};

let p5vectorIntro = new p5(seedVectorIntro, "vectorIntro");