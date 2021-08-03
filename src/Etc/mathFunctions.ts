export function radToDeg(r: number): number {
    return r * 180 / Math.PI;
}

export function degToRad(d: number): number {
    return d * Math.PI / 180;
}

export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}