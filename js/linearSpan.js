function generateVectors(maxRadius, number=100, col=COL_LIGHTGRAY) {
    // Sunflower distribution https://stackoverflow.com/questions/28567166/uniformly-distribute-x-points-inside-a-circle
    let arr = [];
    const phi = 1.61803398875;
    const angle_stride = (2 * Math.PI) / (phi*phi)
    let radius = (k, n) => {
        if(k > n) { 
            return 1.0 
        } else {
            return Math.sqrt(k - 0.5) / Math.sqrt(n - 0.5)
        }
    }
    
    for (let i=0; i<number; i++) {
        let r = radius(i, number) * maxRadius
        let theta = i * angle_stride
        let x = r * Math.cos(theta);
        let y = r * Math.sin(theta);
        arr.push(vec2(x, y));
    };

    return arr
}

const seedLinearSpan = (sketch) => {
    const canvasHeigth = 500
    const canvasWidth =  500
    
    const size_ = 50;
    
    let basis = {
        i : vec2(1, 0),
        j : vec2(0, -1)
    }

    let vectorsRadius = 200
    const spanVectors = generateVectors(vectorsRadius, 150)
    let epochTime
    let normalFont
    let boldFont

    sketch.preload = () => {
        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()
    }

    sketch.setup = () => {
        sketch.createCanvas(canvasWidth, canvasHeigth);
        basis.i = vec2(Math.random()+1, (Math.random())  )
        basis.j = vec2(Math.random(),  -(Math.random()+1))
    }

    sketch.draw = () => {
        sketch.background(255)
        sketch.translate(canvasWidth/2, canvasHeigth/2);
        
        // Draw vectors 
        sketch.strokeWeight(2)
        let timeOffset = 20; 
        let animSpeed = 1000;
        for (let i=0; i<spanVectors.length; i++) {
            let v = spanVectors[i];

            let t = clamp((sketch.millis() - epochTime - i*timeOffset)/animSpeed, 0, 1);
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
        let t = clamp((sketch.millis() - epochTime)/animSpeed, 0, 1)
        drawBasis(sketch, basis, size_ * easeOut(t), boldFont)

        // Text: explaination
        // fill(COL_DARKGRAY)
        // noStroke();
        // textFont(normalFont);
        // textSize(20);
        // textAlign(CENTER);
        // text(
        //     "The set of all the ways two vectors can be combined is called their linear span.", 
        //     0, -280
        // )
        
        // Text: basis vectors
        let lambda = clamp((sketch.millis() - epochTime - 4000)/animSpeed, 0, 1)
        let c1 = sketch.color(0,0,0,0)
        let c2 = sketch.color(COL_DARKGRAY)
        let col = sketch.lerpColor(c1, c2, lambda)
        let distScale = 0.707106781 * 0.9 // sqrt(2)/2 * some ajustment term; 
        sketch.textAlign(sketch.LEFT);
        sketch.fill(col)
        sketch.stroke(COL_WHITE)
        sketch.text(
            "span(î, ĵ)", 
            vectorsRadius*distScale, vectorsRadius*distScale + easeOut(lambda)*30
        )
    }
};

let p5linearSpan = new p5(seedLinearSpan, "linearSpan");