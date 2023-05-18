const COL_WHITE =     "#ffffff"
const COL_LIGHTGRAY = "#b8b8b8"
const COL_DARKGRAY =  "#474747"
const COL_RED =       "#e43b44"
const COL_YELLOW =    "#fec534"
const COL_GREEN =     "#4dc769"
const COL_BLUE =      "#0095e9"
const COL_PURPLE =    "#ad50b5"

const ZERO_VECT_RADIUS = 12

function vec2(x, y) {
    return {
        x: x,
        y: y
    }
}

function vecNorm(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y)
}

function drawGrid(sketch, w, h, spacing, strokeColor=200) {
    sketch.stroke(strokeColor)
    for(let ix=-w; ix<=w; ix++) {
        for(let iy=-h; iy<=h; iy++) {
            sketch.line(
                -(w+0.5)*spacing, iy*spacing, 
                 (w+0.5)*spacing,  iy*spacing
            ); 
            sketch.line(
                ix*spacing, -(h+0.5)*spacing, 
                ix*spacing,  (h+0.5)*spacing
            ); 
        }
    }
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

function drawVectorlessText(sketch, x1, y1, x2, y2, col, font_, txt="", textSize_=25, textOffset=vec2(0,1)) {
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

function drawVectorText(sketch, x1, y1, x2, y2, col, font_, txt="", textSize_=25, textOffset=vec2(0,1)) {
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

function drawBasis(sketch, basis, size_, font_, textSize_ = 25) {
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

function easeOut(t) {
    return 1 - Math.pow(t-1, 2)
}

function normalizedRamp(x, zeroValue) {
    /* 
    Maps x in [0, 1] to:
    - If x in [0, zeroValue]: Returns function 0 
    - If x in [zeroValue, 1]: Returns ramp that goes from (zeroValue, 0) to (1, 1)
    
      ↑                     ↑             
    1 +      , (1,1)      1 |      / (1,1)       
      |    ,'               |     /       
      |  ,'          |-->   |    /        
      |,'                   |___/ (zeroValue, 0)          
    0 +------+----->      0 +---+--+----->
             1                 zv  1      

    */
    return Math.max(0, (x - zeroValue)/(1 - zeroValue))
}


function clamp(x, a, b) {
    return Math.max(a, Math.min(x, b));
}

function distance(x, y) {
    return Math.sqrt(x*x + y*y)
}