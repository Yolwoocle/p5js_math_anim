const seedVectorSpaceR2 = (sketch) => {
    
    const size_ = 50;
    
    let basis = {
        i : vec2(1, 0),
        j : vec2(0, -1)
    }

    let vectorsRadius = 200
    let spanVectors
    let normalFont
    let boldFont
    let backupFont

    let textDiv

    sketch.preload = () => {
        sketch.canvasWidth =  500
        sketch.canvasHeigth = 500
        sketch.screenOx = sketch.canvasWidth/2
        sketch.screenOy = sketch.canvasHeigth/2

        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        backupFont = sketch.loadFont("assets/noto-sans-regular.ttf")
        // epochTime = sketch.millis()
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasWidth, sketch.canvasHeigth);
        basis.i = vec2(Math.random()+1, (Math.random())  )
        basis.j = vec2(Math.random(),  -(Math.random()+1))

        spanVectors = generateVectorsCircle(vectorsRadius, 100)
        // textDiv = sketch.createDiv('span(<b>î</b>, <b>ĵ</b>)');
    }

    sketch.mainDraw = () => { 
        // Draw vectors 
        sketch.strokeWeight(2)
        let timeOffset = 20; 
        let animSpeed = 1000;
        for (let i=0; i<spanVectors.length; i++) {
            let v = spanVectors[i];

            let t = clamp((sketch.millis() - sketch.epochTime - i*timeOffset)/animSpeed, 0, 1);
            let lambda = easeOut(t);
            let x = v.x*lambda;
            let y = v.y*lambda;
            
            let rot = (1-lambda)*0.5
            let norm = Math.sqrt(x*x+y*y)
            let circleProportion = norm/vectorsRadius
            let tailLen = circleProportion * lambda

            let maxColor = sketch.color(COL_LIGHTGRAY)
            let minColor = sketch.color("#fff")
            let col = sketch.lerpColor(maxColor, minColor, Math.max(0, normalizedRamp(circleProportion, 0.8)))
            // sketch.rotate( rot)
            drawVector(sketch, x*tailLen, y*tailLen, x, y, col)
            // sketch.rotate(-rot)
        }
        
        // Draw basis
        // let t = clamp((sketch.millis() - epochTime)/animSpeed, 0, 1)
        // drawBasis(sketch, basis, size_ * easeOut(t), boldFont)
        
        // Text: basis vectors
        let lambda = clamp((sketch.millis() - sketch.epochTime - 3000)/animSpeed, 0, 1)
        let c1 = sketch.color(0,0,0,0)
        let c2 = sketch.color(COL_DARKGRAY)
        let col = sketch.lerpColor(c1, c2, lambda)
        let distScale = 0.707106781 // sqrt(2)/2 * some ajustment term; 
        sketch.textAlign(sketch.LEFT);
        sketch.fill(col)
        sketch.textSize(40);
        sketch.stroke(COL_WHITE)
        // "span(î, ĵ)", 
        sketch.textFont(backupFont);
        sketch.text(
            "ℝ", 
            vectorsRadius*distScale + 10, vectorsRadius*distScale + easeOut(lambda)*30
        )
        sketch.textFont(normalFont);
        sketch.text(
            "²", 
            vectorsRadius*distScale + 35, vectorsRadius*distScale + easeOut(lambda)*30
        )
        // textDiv.style('color', col.toString());
        // textDiv.position(vectorsRadius*distScale, vectorsRadius*distScale + easeOut(lambda)*30);
    }

    sketch.draw = setupClickToPlay(sketch, sketch.mainDraw)
};

let p5vectorSpaceR2 = new p5(seedVectorSpaceR2, "vectorSpaceR2");