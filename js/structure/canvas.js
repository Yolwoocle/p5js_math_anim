function setupClickToPlay(sketch, drawFunc) {
    sketch.c2p_hasStartedDelay = false
    sketch.c2p_hasStarted = false

    sketch.c2p_defaultCircleSize = 50
    sketch.c2p_animProgress = 0
    sketch.c2p_circleSize = 50
    sketch.c2p_circleSizeClickZone = 20
    sketch.c2p_circleSizeClickOverflow = 10
    sketch.c2p_circleScale = 1

    sketch.c2p_triSize = 10
    sketch.c2p_strokeWeight = 3
    sketch.c2p_playDelay = 0.4
    sketch.epochTime = -1

    sketch.screenOx = sketch.canvasWidth/2
    sketch.screenOy = sketch.canvasHeigth/2

    let draw = () => {
        sketch.background(255)
        sketch.translate(sketch.canvasWidth/2, sketch.canvasHeigth/2);

        let dist = distance(sketch.mouseX - sketch.screenOx, sketch.mouseY - sketch.screenOy)
        let minDist = sketch.c2p_circleSize + sketch.c2p_circleSizeClickZone
        let isFocused = dist <= minDist
        let dt_ = sketch.deltaTime/1000

        if (isFocused) {
            sketch.c2p_circleScale = sketch.lerp(sketch.c2p_circleScale, 1.2, dt_*10)
        } else {
            sketch.c2p_circleScale = sketch.lerp(sketch.c2p_circleScale, 1, dt_*10)
        }

        if (sketch.mouseIsPressed && isFocused) {
            sketch.c2p_hasStartedDelay = true
        }

        if (sketch.c2p_hasStartedDelay) {
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
            sketch.circle(0,0, sketch.c2p_circleSize * sketch.c2p_circleScale)
            
            // triangle
            const sin2piOver3 = 0.86602540378
            sketch.stroke(col);
            sketch.noFill();
            sketch.strokeWeight(sketch.c2p_strokeWeight);
            sketch.strokeJoin(sketch.ROUND);
            let l = sketch.c2p_circleScale * sketch.c2p_triSize
            sketch.triangle(
                 sketch.c2p_triSize, 0,
                -0.5 * l,  l * sin2piOver3,
                -0.5 * l, -l * sin2piOver3,
            )
        }
    }
    return draw
}