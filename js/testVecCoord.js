
const seedTest = (sketch) => {
    const canvasWidth =  400
    const canvasHeigth = 400

    const size_ = 50;

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
    let screenOx
    let screenOy
    
    const maxVectorLen = 200;

    sketch.preload = () => {
        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()
    }

    sketch.setup = () => {
        sketch.createCanvas(canvasWidth, canvasHeigth);
        
        basis.i = vec2(Math.random()*40+30, (Math.random()*30 + 30)  )
        basis.j = vec2(Math.random()*30+30,  -(Math.random()*40+30))

        vec = vec2((Math.random()-0.5)*200, (Math.random()-0.5)*200);
        let det = basis.i.x*basis.j.y - basis.j.x*basis.i.y
        vectorBasisCoords = vec2(
            ( basis.j.y*vec.x - basis.j.x*vec.y)/det,
            (-basis.i.y*vec.x + basis.i.x*vec.y)/det
        )

        screenOx = canvasWidth/2
        screenOy = canvasHeigth/2
    }

    sketch.draw = () => {
        let dt = sketch.deltaTime/1000
        let fps = 1/dt
        sketch.background(255)
        sketch.translate(screenOx, screenOy);


        sketch.strokeWeight(3)
        sketch.stroke(sketch.color("#f6babd"))
        drawVector(sketch, 0, 0, vectorBasisCoords.x * basis.i.x, vectorBasisCoords.x * basis.i.y)
        sketch.stroke(sketch.color("#cbedc4"))
        drawVector(sketch, 0, 0, vectorBasisCoords.y * basis.j.x, vectorBasisCoords.y * basis.j.y)

        /// Draw
        sketch.strokeWeight(5)
        drawBasis(sketch, basis, 1, normalFont)
        drawVector(sketch, 0, 0, vec.x, vec.y, COL_DARKGRAY)
        
        sketch.noStroke();
        sketch.fill(COL_DARKGRAY);
        sketch.text(`(${Math.floor(vectorBasisCoords.x * 1000)/1000}, ${Math.floor(vectorBasisCoords.y * 1000)/1000})`, -100, -100)
        
    }
};

let p5test = new p5(seedTest, "test");