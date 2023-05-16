const canvasWidth =  600
const canvasHeigth = 600
let COL_WHITE =     "#ffffff"
let COL_LIGHTGRAY = "#c8c8c8"
let COL_DARKGRAY =  "#474747"
let COL_RED =       "#e43b44"
let COL_GREEN =     "#63c74d"

function vec2(x, y) {
    return {
        x: x,
        y: y
    }
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

function drawVector(sketch, x1, y1, x2, y2, col=null, arrowSize=10, arrowTipAngle=(Math.PI/5)) {
    if(col) { 
        sketch.stroke(col) 
    }
    sketch.line(x1, y1, x2, y2);
    const ang = Math.atan2(y2-y1, x2-x1);
    
    sketch.line(x2, y2, x2+Math.cos(ang+arrowSize)*arrowSize, y2+Math.sin(ang+arrowSize)*arrowSize);
    sketch.line(x2, y2, x2+Math.cos(ang-arrowSize)*arrowSize, y2+Math.sin(ang-arrowSize)*arrowSize);
}

function drawBasis(sketch, basis, size_, font_) {
    const textSize_ = 25;

    let draw = (vec, col, txt) => {
        let x = vec.x*size_
        let y = vec.y*size_
        
        sketch.stroke(col)
        sketch.strokeWeight(3); 
        drawVector(sketch, 0, 0, x, y)

        let norm = Math.sqrt(x*x + y*y)
        let tx = x/2 - textSize_*y/norm;
        let ty = y/2 + textSize_*x/norm;
        
        sketch.textFont(font_);
        sketch.textSize(textSize_);
        sketch.textAlign(sketch.CENTER);
        sketch.stroke(COL_WHITE);
        sketch.strokeWeight(4); 
        sketch.fill(col);
        sketch.text(txt, tx, ty)
    }

    draw(basis.i, COL_RED,   "î");
    draw(basis.j, COL_GREEN, "ĵ");
}

function generateVectors(maxRadius, number=100, col=COL_LIGHTGRAY) {
    // Sunflower distribution https://stackoverflow.com/questions/28567166/uniformly-distribute-x-points-inside-a-circle
    let arr = [];
    const phi = 1.61803398875;
    const angle_stride = (2 * Math.PI) / (phi*phi)
    let radius = (k, n) => {
        if(k > n) { 
            return 1.0 
        } else {
            return Math.sqrt(k - 0.5) / Math.sqrt(n - 0.5)
        }
    }
    
    for (let i=0; i<number; i++) {
        let r = radius(i, number) * maxRadius
        let theta = i * angle_stride
        let x = r * Math.cos(theta);
        let y = r * Math.sin(theta);
        arr.push(vec2(x, y));
    };

    return arr
}

function easeOut(t) {
    return 1 - Math.pow(t-1, 2)
}

function clamp(x, a, b) {
    return Math.max(a, Math.min(x, b));
}

/////////////////////////////////////////////////////////////

const seedLinearSpan = (sketch) => {
    const size_ = 50;

    let basis = {
        i : vec2(1, 0),
        j : vec2(0, -1)
    }
    let vectorsRadius = 200
    const spanVectors = generateVectors(vectorsRadius, 150)
    let epochTime
    let normalFont
    let boldFont

    sketch.preload = () => {
        normalFont = sketch.loadFont("assets/lexend-regular.ttf")
        boldFont   = sketch.loadFont("assets/lexend-bold.ttf")
        epochTime = sketch.millis()
    }

    sketch.setup = () => {
        sketch.createCanvas(canvasWidth, canvasHeigth);
        basis.i = vec2(Math.random()+1, (Math.random())  )
        basis.j = vec2(Math.random(),  -(Math.random()+1))
    }

    sketch.draw = () => {
        sketch.background(255)
        sketch.translate(canvasWidth/2, canvasHeigth/2);
        
        // Draw vectors 
        sketch.strokeWeight(2)
        let timeOffset = 20; 
        let animSpeed = 1000;
        for (let i=0; i<spanVectors.length; i++) {
            let v = spanVectors[i];

            let t = clamp((sketch.millis() - epochTime - i*timeOffset)/animSpeed, 0, 1);
            let lambda = easeOut(t);
            let x = v.x*lambda;
            let y = v.y*lambda;
            
            let rot = (1-lambda)
            let tailLen = 0.7
            // rotate( rot)
            drawVector(sketch, x*tailLen*lambda, y*tailLen*lambda, x, y, COL_LIGHTGRAY)
            // rotate(-rot)
        }
        
        // Draw basis
        let t = clamp((sketch.millis() - epochTime)/animSpeed, 0, 1)
        drawBasis(sketch, basis, size_ * easeOut(t), boldFont)

        // Text: explaination
        // fill(COL_DARKGRAY)
        // noStroke();
        // textFont(normalFont);
        // textSize(20);
        // textAlign(CENTER);
        // text(
        //     "The set of all the ways two vectors can be combined is called their linear span.", 
        //     0, -280
        // )
        
        // Text: basis vectors
        let lambda = clamp((sketch.millis() - epochTime - 4000)/animSpeed, 0, 1)
        let c1 = sketch.color(0,0,0,0)
        let c2 = sketch.color(COL_DARKGRAY)
        let col = sketch.lerpColor(c1, c2, lambda)
        let sqrt2over2 = 0.707106781; 
        sketch.textAlign(sketch.LEFT);
        sketch.fill(col)
        sketch.stroke(COL_WHITE)
        sketch.text(
            "span(î, ĵ)", 
            vectorsRadius*sqrt2over2, vectorsRadius*sqrt2over2 + easeOut(lambda)*30
        )
    }
};

let p5linearSpan = new p5(seedLinearSpan);