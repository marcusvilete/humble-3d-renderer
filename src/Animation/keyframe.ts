import { JointTransform } from "./JointTransform";

export class HumbleKeyframe { //Keyframe is taken =(
    timestamp: number;
    pose: Pose;
    constructor(timestamp: number, pose: Pose) {
        this.timestamp = timestamp;
        this.pose = pose;
    }
}

export interface Pose {
    [index: string]: JointTransform; //key is the joint "name", value is the joint transform
}