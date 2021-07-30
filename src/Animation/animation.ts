import { HumbleKeyframe } from "./keyframe";


//this holds animation data, maybe should not be a full class since we so far have no behaviour?
export class HumbleAnimation { //name Animation was taken =(
    lengthInSeconds: number;
    keyframes: HumbleKeyframe[];
    constructor(keyframes: HumbleKeyframe[], lengthInSeconds: number) {
        this.keyframes = keyframes;
        this.lengthInSeconds = lengthInSeconds;
    }
}