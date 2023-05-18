const COL_WHITE =       "#ffffff"
const COL_LIGHTGRAY =   "#b8b8b8"
const COL_DARKGRAY =    "#474747"
const COL_RED =         "#e43b44"
const COL_YELLOW =      "#fec534"
const COL_LIGHTGREEN =  "#a0dab9"
const COL_GREEN =       "#4dc769"
const COL_BLUE =        "#0095e9"
const COL_PURPLE =      "#ad50b5"
const COL_PINK =        "#e58aa4"

const ZERO_VECT_RADIUS = 12

const DEFAULT_VECT_TEXT_SIZE = 25

function drawGrid(sketch, w, h, spacing, strokeColor=200) {
    sketch.stroke(strokeColor)
    sketch.strokeWeight(2)
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
    sketch.strokeWeight(3)
    sketch.line(
        -(w+0.5)*spacing, 0, (w+0.5)*spacing, 0
    ); 
    sketch.line(
        0, -(h+0.5)*spacing, 0,  (h+0.5)*spacing
    ); 

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

function drawColumnVector(sketch, x, y, arr, font_, col, arrCols) {
    let n = arr.length;
    let maxWidth = 0;
    let spacing = 10;
    let padding = 10;

    let size_ = sketch.textSize()
    let heigth = size_ * n + spacing * (n-1)
    let oy = y - heigth / 2

    sketch.textAlign(sketch.CENTER, sketch.TOP)
    sketch.stroke(COL_WHITE)
    sketch.fill(col)
    sketch.strokeWeight(3)
    sketch.textFont(font_)
    for (i=0; i < n; i++) {
        let text = arr[i].toString()
        let w = sketch.textWidth(text)
        if (w > maxWidth) {
            maxWidth = w;
        }
        if (arrCols !== undefined) {
            sketch.fill(arrCols[i])
        }
        sketch.text(text, x, oy + i*(size_+spacing))
    }

    let x1 = x - maxWidth/2 - padding
    let y1 = oy - padding
    let x2 = x + maxWidth/2 + padding
    let y2 = oy + heigth + padding
    let drawBrackets = () => {
        sketch.line(x1, y1, x1+padding/2, y1)
        sketch.line(x1, y1, x1, y2)
        sketch.line(x1, y2, x1+padding/2, y2)
    
        sketch.line(x2, y1, x2-padding/2, y1)
        sketch.line(x2, y1, x2, y2)
        sketch.line(x2, y2, x2-padding/2, y2)
    }

    sketch.stroke(COL_WHITE)
    sketch.strokeWeight(6)
    drawBrackets()
    sketch.stroke(col)
    sketch.strokeWeight(3)
    drawBrackets()
}