const seedTest = (sketch) => {
    let basis = {
        i : vec2(1, 0),
        j : vec2(0, -1)
    }

    let vectorsRadius = 200
    let epochTime
    let normalFont
    let boldFont
    let vec
    let vectorBasisCoord
    
    const maxVectorLen = 200;

    sketch.preload = () => {
        sketch.canvasWidth =  400
        sketch.canvasHeigth = 400
        
        sketch.screenOx = sketch.canvasWidth/2
        sketch.screenOy = sketch.canvasHeigth/2

        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasWidth, sketch.canvasHeigth);
        
        basis.i = vec2(Math.random()*40+30, (Math.random()*30 + 30)  )
        basis.j = vec2(Math.random()*30+30,  -(Math.random()*40+30))

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

        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);

        let isZero = followMouse(sketch, vec, maxVectorLen)

        sketch.strokeWeight(3)
        sketch.stroke(COL_BLUE)
        drawVector(sketch, 0, 0, vectorBasisCoords.x * basis.i.x, vectorBasisCoords.x * basis.i.y)
        sketch.stroke(COL_YELLOW)
        drawVector(sketch, 0, 0, vectorBasisCoords.y * basis.j.x, vectorBasisCoords.y * basis.j.y)

        // Basis
        sketch.strokeWeight(5)
        sketch.stroke(COL_BLUE)
        drawVectorText(sketch, 0, 0, basis.i.x, basis.i.y)
        sketch.stroke(COL_YELLOW)
        drawVectorText(sketch, 0, 0, basis.j.x, basis.j.y)

        drawVector(sketch, 0, 0, vec.x, vec.y, COL_DARKGRAY)
        
        sketch.noStroke();
        sketch.fill(COL_DARKGRAY);
        sketch.text(`(${Math.floor(vectorBasisCoords.x * 1000)/1000}, ${Math.floor(vectorBasisCoords.y * 1000)/1000})`, -100, -100)
        
    }
};

let p5test = new p5(seedTest, "test");