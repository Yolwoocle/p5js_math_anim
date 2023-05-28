function vec2(x, y) {
    return {
        x: x,
        y: y
    }
}

function getRadialVector(theta, r) {
    return vec2(Math.cos(theta) * r, Math.sin(theta) * r)
}

function vecNorm(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y)
}

function normalizedVect(v) {
    let l = vecNorm(v)
    if (l === 0) {
        return vec2(0, 0)
    }
    return vec2(v.x / l, v.y / l)
}


const arrowTipSize = 10 
const arrowTipAngle = (Math.PI/5)

function drawVector(sketch, x1, y1, x2, y2, col) {
    if(col !== undefined) { 
        sketch.stroke(col) 
    }
    sketch.line(x1, y1, x2, y2);
    const ang = Math.atan2(y2-y1, x2-x1);
    
    sketch.line(x2, y2, 
        x2+Math.cos(ang+arrowTipSize)*arrowTipSize, 
        y2+Math.sin(ang+arrowTipSize)*arrowTipSize
    );
    sketch.line(x2, y2, 
        x2+Math.cos(ang-arrowTipSize)*arrowTipSize, 
        y2+Math.sin(ang-arrowTipSize)*arrowTipSize
    );
}

function drawVectorlessText(sketch, x1, y1, x2, y2, col, font_, txt="", textSize_=DEFAULT_VECT_TEXT_SIZE, textOffset=vec2(0,1)) {
    let dx = (x2 - x1)
    let dy = (y2 - y1)
    let norm = Math.sqrt(dx*dx + dy*dy)
    let tx = (x1 + dx/2 + textOffset.x) - (textOffset.y * 0.7 * textSize_ * dy)/norm;
    let ty = (y1 + dy/2 + textOffset.x) + (textOffset.y * 0.7 * textSize_ * dx)/norm;
    
    if (txt !== undefined) {
        sketch.textFont(font_);
        sketch.textSize(textSize_);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.stroke(COL_WHITE);
        sketch.strokeWeight(4); 
        sketch.fill(col);
        sketch.text(txt, tx, ty);
    }
}

function drawVectorText(sketch, x1, y1, x2, y2, col, font_, txt="", textSize_=DEFAULT_VECT_TEXT_SIZE, textOffset=vec2(0,1)) {
    drawVector(sketch, x1, y1, x2, y2, col)
    drawVectorlessText(sketch, x1, y1, x2, y2, col, font_, txt, textSize_, textOffset)
}

function clampVector(v, maxLen) {
    let d = distance(v.x, v.y)
    if (maxLen <= d) {
        let ajustement = maxLen / d
        v.x *= ajustement 
        v.y *= ajustement
    }
}

function drawBasis(sketch, basis, size_, font_, textSize_ = DEFAULT_VECT_TEXT_SIZE) {
    let draw = (vec, col, weight, txt) => {
        let x = vec.x*size_
        let y = vec.y*size_
        
        sketch.stroke(col)
        sketch.strokeWeight(weight); 
        drawVector(sketch, 0, 0, x, y)

        let norm = Math.sqrt(x*x + y*y)
        let tx = x/2 - textSize_*y/norm;
        let ty = y/2 + textSize_*x/norm;
        
        if (txt !== undefined) {
            sketch.textFont(font_);
            sketch.textSize(textSize_);
            sketch.textAlign(sketch.CENTER);
            sketch.stroke(COL_WHITE);
            sketch.strokeWeight(4); 
            sketch.fill(col);
            sketch.text(txt, tx, ty);
        }
    }

    draw(basis.i, COL_WHITE, 5);
    draw(basis.j, COL_WHITE, 5);

    draw(basis.i, COL_RED,   3, "î");
    draw(basis.j, COL_GREEN, 3, "ĵ");
}


function followMouse(sketch, vector, maxVectorLen=200, followSpeed=10, zeroThreshold=5, rectMode=false) {
    let dt_ = sketch.deltaTime/1000

    let adjustPolar = (dx, dy) => {
        let dist = distance(dx, dy);
        if (maxVectorLen <= dist) {
            let adjustment = maxVectorLen / dist
            return [dx * adjustment, dy * adjustment]
        }
        return [dx, dy]
    }
    let adjustRect = (dx, dy) => {
        return [
            clamp(dx, -maxVectorLen, maxVectorLen),
            clamp(dy, -maxVectorLen, maxVectorLen)
        ]
    }
    let adjust = rectMode ? adjustRect : adjustPolar

    let targetX = sketch.mouseX - sketch.screenOx
    let targetY = sketch.mouseY - sketch.screenOy
    
    // Clamp vector magnitude
    let newCoords = adjust(targetX, targetY)
    targetX = newCoords[0]
    targetY = newCoords[1]
    
    let dist = distance(targetX, targetY);
    let isZero = false;
    if (dist <= zeroThreshold) {
        targetX = targetX*0.2;
        targetY = targetY*0.2;
        isZero = true;
    }

    // Lerp to new position
    vector.x = sketch.lerp(vector.x, targetX, clamp(dt_*followSpeed, 0, 1))
    vector.y = sketch.lerp(vector.y, targetY, clamp(dt_*followSpeed, 0, 1))

    return isZero
}

function generateVectorsCircle(maxRadius, n=100) {
    // Sunflower distribution https://stackoverflow.com/questions/28567166/uniformly-distribute-x-points-inside-a-circle
    let arr = [];
    const phi = 1.61803398875;
    const angle_stride = (2 * Math.PI) / (phi*phi)
    let radius = (k) => {
        if(k > n) { 
            return 1.0 
        } else {
            return Math.sqrt(k + 0.5) / Math.sqrt(n - 0.5)
        }
    }
    
    for (let i=0; i<n; i++) {
        let r = radius(i) * maxRadius
        let theta = i * angle_stride
        let x = r * Math.cos(theta);
        let y = r * Math.sin(theta);
        arr.push(vec2(x, y));
    };

    return arr
}

function drawVectorOrZero(sketch, vector, isZero=false, col=COL_RED, pos=vec2(0,0), font_=undefined, textV="v", text0="0") {
    let x1 = pos.x
    let y1 = pos.y
    let x2 = pos.x + vector.x
    let y2 = pos.y + vector.y
    if (isZero) {
        sketch.noStroke()
        sketch.fill(col)
        sketch.circle(x2, y2, ZERO_VECT_RADIUS)
        if (font_ !== undefined) {
            drawVectorlessText(sketch, x1, y1, x2, y2, col, font_, text0)
        }
    } else {
        sketch.strokeWeight(3)
        if (font_ === undefined) {
            drawVector(sketch, x1, y1, x2, y2, col)

        } else {
            drawVectorText(sketch, x1, y1, x2, y2, col, font_, textV)
        }
    }
}