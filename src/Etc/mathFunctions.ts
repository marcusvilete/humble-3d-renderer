export function radToDeg(r: number): number {
    return r * 180 / Math.PI;
}

export function degToRad(d: number): number {
    return d * Math.PI / 180;
}

export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function slerp() {

}

/**
 * 
 * @param a 'from' parameter
 * @param b 'to' parameter
 * @param step  step between 0 ~ 1. 0 returns a, 1 returns b, 0.5 returns the midpoint between a and b
 */
export function lerp(a: number, b: number, step: number) {
    let iStep = 1 - step;
    return  (iStep * a) + (step * b);
}