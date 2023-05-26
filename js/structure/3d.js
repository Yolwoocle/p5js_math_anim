
let vec3 = (x, y, z) => {
    return {
        x: x,
        y: y, 
        z: z
    }
}

function lineTriangle(sketch, ax, ay, bx, by, cx, cy) {
    sketch.line(ax, ay, bx, by)
    sketch.line(bx, by, cx, cy)
    sketch.line(cx, cy, ax, ay)
}

function rot(p, roll, pitch, yaw) {
    // Roll = x 
    // Pitch = y 
    // Yaw = z 
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);

    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);

    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);

    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;

    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;

    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;

    var px = p.x;
    var py = p.y;
    var pz = p.z;

    let new_px = Axx*px + Axy*py + Axz*pz;
    let new_py = Ayx*px + Ayy*py + Ayz*pz;
    let new_pz = Azx*px + Azy*py + Azz*pz;

    return vec3(new_px, new_py, new_pz)
}

function drawWorld(sketch, world) {
    let fov = 60
    let oz = 3
    let mx = sketch.mouseX - sketch.screenOx
    let my = sketch.mouseY - sketch.screenOy
    let ox = mx * 0.02
    let oy = my * 0.02

    let edges = world.edges 
    for (let i=0; i < edges.length; i++) {
        let e = edges[i]
        let a = e.a
        let b = e.b
        
        let pitch = mx * 0.0
        let roll = my * 0.0
        let yaw = 3.1
        a = rot(a, roll, pitch, yaw)
        b = rot(b, roll, pitch, yaw)
        c = rot(c, roll, pitch, yaw)
        
        let az = (a.z + oz)
        let bz = (b.z + oz)
        let cz = (c.z + oz)
        sketch.noFill()
        sketch.stroke(COL_DARKGRAY)
        sketch.line(
            fov * ((a.x  + ox)/ az),
            fov * ((-a.y + oy) / az),
            fov * ((b.x  + ox)/ bz),
            fov * ((-b.y + oy) / bz),
        )
        // lineTriangle(
        //     sketch,
        //     fov * ((a.x  + ox)/ az),
        //     fov * ((-a.y + oy) / az),
        //     fov * ((b.x  + ox)/ bz),
        //     fov * ((-b.y + oy) / bz),
        //     fov * ((c.x  + ox)/ cz),
        //     fov * ((-c.y + oy) / cz),
        // )
    }
}
