const seediAndj = (sketch) => {
    let normalFont
    let vector
    
    let scale = 40

    sketch.preload = () => {
        sketch.canvasWidth =  100
        sketch.canvasHeigth = 100
        sketch.screenOx = sketch.canvasWidth/2
        sketch.screenOy = sketch.canvasHeigth/2
        
        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.canvasHeigth, sketch.canvasHeigth);
    }

    sketch.draw = () => {
        /// Draw
        sketch.background(255)
        sketch.translate(sketch.screenOx, sketch.screenOy);
        
        drawGrid(sketch, 5, 5, scale)

        // Axis vectors
        drawVectorText(sketch, 0, 0, scale, 0, COL_RED,   normalFont, "î", undefined, vec2(0,0.6))
        drawVectorText(sketch, 0, 0, 0, -scale, COL_GREEN, normalFont, "ĵ", undefined, vec2(0,0.6))
    }
};

let p5iAndj = new p5(seediAndj, "iAndj");