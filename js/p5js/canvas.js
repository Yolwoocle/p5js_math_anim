function setupClickToPlay(sketch, drawFunc) {
    sketch.c2p_hasStartedDelay = false
    sketch.c2p_hasStarted = false

    sketch.c2p_defaultCircleSize = 50
    sketch.c2p_animProgress = 0
    sketch.c2p_circleSize = 50
    sketch.c2p_circleSizeClickZone = 20
    sketch.c2p_circleSizeClickOverflow = 10

    sketch.c2p_triSize = 10
    sketch.c2p_strokeWeight = 3
    sketch.c2p_playDelay = 0.4
    sketch.epochTime = -1

    sketch.screenOx = sketch.canvasWidth/2
    sketch.screenOy = sketch.canvasHeigth/2

    let draw = () => {
        sketch.background(255)
        sketch.translate(canvasWidth/2, canvasHeigth/2);

        let dist = distance(sketch.mouseX - sketch.screenOx, sketch.mouseY - sketch.screenOy)
        let minDist = sketch.c2p_circleSize + sketch.c2p_circleSizeClickZone
        if (sketch.mouseIsPressed && dist <= minDist) {
            sketch.c2p_hasStartedDelay = true
        }

        if (sketch.c2p_hasStartedDelay) {
            let dt_ = sketch.deltaTime/1000
            sketch.c2p_animProgress = clamp(sketch.c2p_animProgress + dt_*10, 0, 1)  
            sketch.c2p_playDelay -= dt_
            if (sketch.c2p_playDelay <= 0) {
                sketch.c2p_hasStartedDelay = false
                sketch.c2p_hasStarted = true
                sketch.epochTime = sketch.millis()
            }
        }
        
        if (sketch.c2p_hasStarted) {
            drawFunc()
        }
        
        if (true) {
            let t = sketch.c2p_animProgress
            let col = sketch.color(COL_DARKGRAY)
            col.setAlpha(255 * (1-t))
            
            // circle
            sketch.noFill();
            sketch.stroke(col);
            sketch.strokeWeight(sketch.c2p_strokeWeight);
            sketch.circle(0,0, sketch.c2p_circleSize)
            
            // triangle
            const sin2piOver3 = 0.86602540378
            sketch.stroke(col);
            sketch.noFill();
            sketch.strokeWeight(sketch.c2p_strokeWeight);
            sketch.strokeJoin(sketch.ROUND);
            sketch.triangle(
                 sketch.c2p_triSize, 0,
                -0.5 * sketch.c2p_triSize,  sketch.c2p_triSize * sin2piOver3,
                -0.5 * sketch.c2p_triSize, -sketch.c2p_triSize * sin2piOver3,
            )
        }
    }
    return draw
}