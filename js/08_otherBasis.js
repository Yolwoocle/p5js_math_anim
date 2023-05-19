const seedOtherBasis = (sketch) => {
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
        basis.i = vec2(30, 50)
        basis.j = vec2(-20, 60)

        vec = vec2((Math.random()-0.5)*200, (Math.random()-0.5)*200);
        let det = basis.i.x*basis.j.y - basis.j.x*basis.i.y
        vectorBasisCoords = vec2(
            ( basis.j.y*vec.x - basis.j.x*vec.y)/det,
            (-basis.i.y*vec.x + basis.i.x*vec.y)/det
        )

    }

    sketch.draw = () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt
        
        // Follow mouse & get position in new base
        let isZero = followMouse(sketch, vec, maxVectorLen, undefined, 10)
        let det = basis.i.x*basis.j.y - basis.j.x*basis.i.y
        vectorBasisCoords = vec2(
            ( basis.j.y*vec.x - basis.j.x*vec.y)/det,
            (-basis.i.y*vec.x + basis.i.x*vec.y)/det
        )

        /// DRAW
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);

        // Scaled basis vects
        let lightBlue = sketch.lerpColor(sketch.color(COL_BLUE), sketch.color(COL_WHITE), 0.5)
        let lightYellow = sketch.lerpColor(sketch.color(COL_ORANGE), sketch.color(COL_WHITE), 0.5)
        
        sketch.strokeWeight(3)
        let x1 = vectorBasisCoords.x * basis.i.x
        let y1 = vectorBasisCoords.x * basis.i.y
        let x2 = vectorBasisCoords.y * basis.j.x
        let y2 = vectorBasisCoords.y * basis.j.y
        drawVector(sketch, 0, 0, x1, y1, lightBlue)
        drawVector(sketch, x1, y1, x1+x2, y1+y2, lightYellow)

        // Basis
        sketch.strokeWeight(4)
        drawVectorText(sketch, 0, 0, basis.i.x, basis.i.y, COL_BLUE, normalFont, "v")
        sketch.strokeWeight(4)
        drawVectorText(sketch, 0, 0, basis.j.x, basis.j.y, COL_ORANGE, normalFont, "w")

        drawVector(sketch, 0, 0, vec.x, vec.y, COL_DARKGRAY)      
        
        // Text
        let r1 = Math.floor(vectorBasisCoords.x * 10)/10
        let r2 = Math.floor(vectorBasisCoords.y * 10)/10
        let text1 = `${r1}v`
        let text2 = `${r2}w`
        let flip1 = r1 < 0 ? -1 : 1 
        let flip2 = r2 < 0 ? -1 : 1 
        drawVectorlessText(sketch, 
            0, 0, x1, y1,
            lightBlue, normalFont, text1, undefined, vec2(0, flip1))
        drawVectorlessText(sketch, 
            x1, y1, x1+x2, y1+y2,
            lightYellow, normalFont, text2, undefined, vec2(0, flip2))

        // Matrix
        let unitVec = normalizedVect(vec)
        let norm = vecNorm(vec)
        let colArr = isZero ? [0, 0] : [r1, r2]
        drawColumnVector(
            sketch, unitVec.x*(norm + 40), unitVec.y*(norm + 40), 
            colArr, normalFont, COL_DARKGRAY, [COL_BLUE, COL_ORANGE])
    }
};

let p5otherBasis = new p5(seedOtherBasis, "otherBasis");