
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
}

function distanceSquared(x1, y1, x2, y2) {
    return Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)
}

function dot(ax, ay, bx, by) {
    return ax*bx + ay*by;
}

function reflect(ix, iy, nx, ny) {
    var dp = dot(nx, ny, ix, iy)
    var iix = ix - 2*dp*nx;
    var iiy = iy - 2*dp*ny;
    return [iix, iiy]
}