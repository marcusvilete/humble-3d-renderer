import { Matrix4 } from "../Rendering/matrix";
import { AnimatedModel } from "../animatedModel";
import { HumbleAnimation } from "./animation";
import { Joint } from "./joint";
import { JointTransform } from "./JointTransform";
import { HumbleKeyframe, Pose } from "./keyframe";
import { degToRad } from "../Etc/mathFunctions";

export class Animator {
    animation: HumbleAnimation;
    currentTime: number;
    model: AnimatedModel;
    constructor(model: AnimatedModel) {
        this.model = model;
    }

    //set, or reset an animation
    doAnimation(animation: HumbleAnimation): void {
        this.currentTime = 0;
        this.animation = animation;
    }

    xDeg = 0;
    transl = 0;
    update(deltaTime: number, now: number): void {
        this.xDeg += degToRad(30) * deltaTime;
        this.transl += 1 * deltaTime;
        //let xrotation = Matrix4.makeXRotation(this.xDeg);
        let xrotation = Matrix4.makeXRotation(Math.sin(now) * .5);
        //let xrotation = Matrix4.makeXRotation(degToRad(-90) * .5);
        let xtransl = Matrix4.makeTranslation(0, this.transl, 0);
        let inverseWorld = Matrix4.inverse(this.model.transform.getWorldMatrix());




        animateJoints(this.model.rootJoint, this.model.transform.getWorldMatrix());
        function animateJoints(joint: Joint, parent: Matrix4) {
            
            let worldBindMatrix = Matrix4.multiplyMatrices4(joint.localBindMatrix, parent);
            worldBindMatrix = Matrix4.multiplyMatrices4(xrotation, worldBindMatrix);

            joint.animatedMatrix = Matrix4.makeIdentity();
            joint.animatedMatrix = Matrix4.multiplyMatrices4(worldBindMatrix, joint.animatedMatrix);
            joint.animatedMatrix = Matrix4.multiplyMatrices4(joint.inverseBindMatrix, joint.animatedMatrix);
            

            if (joint.children) {
                joint.children.forEach(child => {
                    animateJoints(child, worldBindMatrix);
                });
            }
        }

        //this.model.rootJoint.animatedMatrix = Matrix4.multiplyMatrices4(xrotation, this.model.rootJoint.animatedMatrix);
        //this.model.rootJoint.children[0].animatedMatrix = Matrix4.multiplyMatrices4(xrotation, this.model.rootJoint.children[0].animatedMatrix);
        //this.model.rootJoint.children[1].animatedMatrix = Matrix4.multiplyMatrices4(xrotation, this.model.rootJoint.children[1].animatedMatrix);
        //this.model.rootJoint.children[2].animatedMatrix = Matrix4.multiplyMatrices4(xrotation, this.model.rootJoint.children[2].animatedMatrix); 
        //this.model.rootJoint.children[0].children[0].animatedMatrix = Matrix4.multiplyMatrices4(xrotation, this.model.rootJoint.children[0].children[0].animatedMatrix);
        //this.model.rootJoint.children[0].children[0].children[0].animatedMatrix = Matrix4.multiplyMatrices4(xrotation, this.model.rootJoint.children[0].children[0].children[0].animatedMatrix);
        //let c = this.model.rootJoint.children[0].children[0].children[0];
        //c.animatedMatrix = Matrix4.multiplyMatrices4(xtransl, c.animatedMatrix);



        // if (this.animation) {
        //     this.increaseAnimationTime(deltaTime);
        //     let currentPose = this.computeCurrentAnimationPose();
        //     this.applyPoseToJoints(currentPose, this.model.rootJoint, Matrix4.makeIdentity());
        // }
    }

    //increase time and, loop around when it ends
    increaseAnimationTime(deltaTime: number): void {
        this.currentTime += deltaTime;
        if (this.currentTime > this.animation.lengthInSeconds) {
            this.currentTime %= this.animation.lengthInSeconds;
        }
    }

    computeCurrentAnimationPose(): Pose {
        let [previousFrame, nextFrame] = this.getPreviousAndNextFrames();
        let step = this.calculateProgression(previousFrame, nextFrame);
        return this.interpolatePoses(previousFrame, nextFrame, step);
    }

    applyPoseToJoints(currentPose: Pose, joint: Joint, parentMatrix: Matrix4): void {
        let currentTransform = currentPose[joint.name];
        let currentMatrix = Matrix4.multiplyMatrices4(currentTransform.getLocalMatrix(), parentMatrix);

        joint.children.forEach(child => {
            this.applyPoseToJoints(currentPose, child, currentMatrix);
        });

        joint.animatedMatrix = Matrix4.multiplyMatrices4(joint.inverseBindMatrix, currentMatrix);
    }

    getPreviousAndNextFrames(): [HumbleKeyframe, HumbleKeyframe] {
        let allKeyFrames = this.animation.keyframes;
        let previous = allKeyFrames[0];
        let next = allKeyFrames[0];

        for (let i = 1; i < allKeyFrames.length; i++) {
            next = allKeyFrames[i];
            if (next.timestamp > this.currentTime) {
                break;
            }
            previous = allKeyFrames[i];
        }

        return [previous, next];
    }

    calculateProgression(previousFrame: HumbleKeyframe, nextFrame: HumbleKeyframe) {
        let totalTime = nextFrame.timestamp - previousFrame.timestamp;
        let currentTime = this.currentTime - previousFrame.timestamp

        return currentTime / totalTime;
    }

    interpolatePoses(previousFrame: HumbleKeyframe, nextFrame: HumbleKeyframe, step: number) {
        let currentPose: Pose;
        //foreach joint transform, interpolate between previous and next keyframe, then return a new interpolated "Pose"
        for (const key in previousFrame.pose) {
            currentPose[key] = JointTransform.interpolate(previousFrame.pose[key], previousFrame.pose[key], step);
        }
        return currentPose;
    }
}

