const seedSpan = (sketch) => {
    let basis = {
        i : vec2(1, 0),
        j : vec2(0, -1)
    }

    let vectorsRadius = 200
    let epochTime
    let normalFont
    let boldFont

    let vec
    let vectorBasisCoords
    
    let spanVectors
    let iVec = 6

    let lerpSpeed = 10
    let animSpeed = 0.7
    let t = 0
    let timeBetweenVectors = 1.5
    
    const maxVectorLen = 200;

    sketch.preload = () => {
        sketch.canvasWidth =  550
        sketch.canvasHeigth = 570
        
        sketch.screenOx = sketch.canvasWidth/2
        sketch.screenOy = sketch.canvasHeigth/2

        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasWidth, sketch.canvasHeigth);
        
        // basis.i = vec2(Math.random()*40+30, (Math.random()*30 + 30)  )
        // basis.j = vec2((Math.random()-0.5)*60+30,  -(Math.random()*40+30))
        basis.i = vec2(60, -10)
        basis.j = vec2(-20, 50)

        vec = vec2((Math.random()-0.5)*200, (Math.random()-0.5)*200);
        let det = basis.i.x*basis.j.y - basis.j.x*basis.i.y
        vectorBasisCoords = vec2(
            ( basis.j.y*vec.x - basis.j.x*vec.y)/det,
            (-basis.i.y*vec.x + basis.i.x*vec.y)/det
        )

        spanVectors = generateVectorsCircle(vectorsRadius, 100)
    }

    sketch.draw = setupClickToPlay(sketch, () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt
        let seconds = (sketch.millis() - sketch.epochTime)/1000
        
        // Iterate through all vectors
        t += dt
        if (t > timeBetweenVectors) {
            iVec += 1
            t = 0
        }
        iVec = clamp(iVec, 0, spanVectors.length - 1)
        
        // Speed up after some time
        if (seconds >= 10) {
            timeBetweenVectors = 0.7
        }

        // Go to next vector & get position in new base
        let nextVector = spanVectors[iVec]
        vec.x = sketch.lerp(vec.x, nextVector.x, clamp(dt*lerpSpeed, 0, 1))
        vec.y = sketch.lerp(vec.y, nextVector.y, clamp(dt*lerpSpeed, 0, 1))

        let det = basis.i.x*basis.j.y - basis.j.x*basis.i.y
        vectorBasisCoords = vec2(
            ( basis.j.y*vec.x - basis.j.x*vec.y)/det,
            (-basis.i.y*vec.x + basis.i.x*vec.y)/det
        )

        /// DRAW
        sketch.background(255)

        // Draw span
        for (let i = iVec-1; i >= 0; i--) {
            let v = spanVectors[i];
            let d = (vecNorm(v) / vectorsRadius)
            d = 1 - normalizedRamp(d, 0.4)
            let col = sketch.lerpColor(sketch.color(COL_WHITE), sketch.color(COL_LIGHTGRAY), d)
            drawVector(sketch, 0, 0, v.x, v.y, col)
        }

        // Scaled basis vects
        let lightBlue = sketch.lerpColor(sketch.color(COL_BLUE), sketch.color(COL_WHITE), 0.5)
        let lightYellow = sketch.lerpColor(sketch.color(COL_ORANGE), sketch.color(COL_WHITE), 0.5)
        
        let x1 = vectorBasisCoords.x * basis.i.x
        let y1 = vectorBasisCoords.x * basis.i.y
        let x2 = vectorBasisCoords.y * basis.j.x
        let y2 = vectorBasisCoords.y * basis.j.y
        let drawCombinationVects = (w, col1, col2) => {
            sketch.strokeWeight(w)
            drawVector(sketch, 0, 0, x1, y1, col1)
            drawVector(sketch, x1, y1, x1+x2, y1+y2, col2)
        } 
        drawCombinationVects(6, COL_WHITE, COL_WHITE)
        drawCombinationVects(3, lightBlue, lightYellow)

        // Basis
        sketch.strokeWeight(7)
        drawVector(sketch, 0, 0, basis.i.x, basis.i.y, COL_WHITE)
        sketch.strokeWeight(7)
        drawVector(sketch, 0, 0, basis.j.x, basis.j.y, COL_WHITE)
        
        sketch.strokeWeight(4)
        drawVectorText(sketch, 0, 0, basis.i.x, basis.i.y, COL_BLUE, normalFont, "v")
        sketch.strokeWeight(4)
        drawVectorText(sketch, 0, 0, basis.j.x, basis.j.y, COL_ORANGE, normalFont, "w")

        drawVector(sketch, 0, 0, vec.x, vec.y, COL_DARKGRAY)  
        let rx = Math.floor(vectorBasisCoords.x * 10)/10
        let ry = Math.floor(vectorBasisCoords.y * 10)/10    
        let unitVec = normalizedVect(vec)
        let norm = vecNorm(vec)

        // Text
        sketch.textFont(normalFont);
        sketch.strokeWeight(3)
        sketch.stroke(COL_WHITE)
        sketch.fill(COL_BLUE)
        sketch.textAlign(sketch.RIGHT)
        sketch.text(`${rx}v`, unitVec.x*(norm + 40) - 12, unitVec.y*(norm + 40))
        
        sketch.fill(COL_DARKGRAY)
        sketch.textAlign(sketch.CENTER)
        sketch.text(`+`, unitVec.x*(norm + 40), unitVec.y*(norm + 40))
        
        sketch.fill(COL_ORANGE)
        sketch.textAlign(sketch.LEFT)
        sketch.text(`${ry}w`, unitVec.x*(norm + 40) + 12, unitVec.y*(norm + 40))


        let tx = -sketch.screenOx + 60
        let ty = -sketch.screenOy + 60
        sketch.fill(COL_DARKGRAY)
        sketch.textAlign(sketch.LEFT)
        sketch.text("span(  ,    )", tx, ty)
        sketch.fill(COL_BLUE)
        sketch.text("v", tx + 68, ty)
        sketch.fill(COL_ORANGE)
        sketch.text("w", tx + 97, ty)

        // Text
        // let r1 = Math.floor(vectorBasisCoords.x * 10)/10
        // let r2 = Math.floor(vectorBasisCoords.y * 10)/10
        // let text1 = `${r1}v`
        // let text2 = `${r2}w`
        // let flip1 = r1 < 0 ? -1 : 1 
        // let flip2 = r2 < 0 ? -1 : 1 
        // drawVectorlessText(sketch, 
        //     0, 0, x1, y1,
        //     lightBlue, normalFont, text1, undefined, vec2(0, flip1))
        // drawVectorlessText(sketch, 
        //     x1, y1, x1+x2, y1+y2,
        //     lightYellow, normalFont, text2, undefined, vec2(0, flip2))

        // Matrix
        // let unitVec = normalizedVect(vec)
        // let norm = vecNorm(vec)
        // let colArr = [r1, r2]
        // drawColumnVector(
        //     sketch, unitVec.x*(norm + 40), unitVec.y*(norm + 40), 
        //     colArr, normalFont, COL_DARKGRAY, [COL_BLUE, COL_ORANGE])
    })
};

let p5span = new p5(seedSpan, "span");