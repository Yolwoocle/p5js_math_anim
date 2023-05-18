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

        let isZero = followMouse(sketch, vector, maxVectorLen, 10, zeroThreshold)

        let norm = vecNorm(vector)
        let normRounded = Math.round(norm, 1)
        let direction = Math.atan2(vector.y, vector.x)
        
        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);
        
        // Draw vector
        // let font_ = isZero ? boldFont : normalFont
        let font_ = normalFont
        drawVectorOrZero(sketch, vector, isZero, COL_RED, vec2(0,0), font_, normRounded, "0")
        
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