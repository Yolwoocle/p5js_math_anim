const canvasWidth =  400
const canvasHeigth = 400

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
    let screenOx
    let screenOy
    
    const maxVectorLen = 200;

    sketch.preload = () => {
        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()

        vector = vec2(-1,2);

        screenOx = canvasWidth/2
        screenOy = canvasHeigth/2

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
        sketch.createCanvas(canvasWidth, canvasHeigth);
    }

    sketch.draw = () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt

        let targetX = sketch.mouseX - screenOx
        let targetY = sketch.mouseY - screenOy
        let d = distance(targetX, targetY)
        let isZero = false;
        // Clamp vector magnitude
        if (maxVectorLen <= d) {
            let ajustement = maxVectorLen / d
            targetX = targetX * ajustement 
            targetY = targetY * ajustement
        } else if (d <= 20) {
            targetX = targetX*0.2;
            targetY = targetY*0.2;
            isZero = true;
        }
        vector.x = sketch.lerp(vector.x, targetX, dt*10)
        vector.y = sketch.lerp(vector.y, targetY, dt*10)

        let norm = vecNorm(vector)
        let normRounded = Math.round(norm, 1)
        let direction = Math.atan2(vector.y, vector.x)
        
        /// Draw
        sketch.background(255)
        sketch.translate(screenOx, screenOy);
        
        // Draw vector
        if (isZero) {
            sketch.noStroke()
            sketch.fill(COL_RED)
            sketch.circle(vector.x, vector.y, 12)
            drawVectorlessText(sketch, 0, 0, vector.x, vector.y, COL_RED, normalFont, "0")
        } else {
            sketch.strokeWeight(3)
            drawVectorText(sketch, 0, 0, vector.x, vector.y, COL_RED, normalFont, normRounded)
        }

        // Modify HTML
        let magField = document.getElementById("magnitudeFieldValue");
        let dirArrow = document.getElementById("directionFieldArrow");
        if (isZero) {
            magField.innerText = `0`
            dirArrow.innerText = "block"
            dirArrow.style.transform = `rotate(0rad)`;
        } else {
            dirArrow.innerText = "arrow_forward"
            magField.innerText = `${normRounded}`
            dirArrow.style.transform = `rotate(${direction}rad)`;
        }
        
    }
};

let p5vectorIntro = new p5(seedVectorIntro, "vectorIntro");