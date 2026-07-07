// rope.js
// https://www.owlree.blog/posts/simulating-a-rope.html

class RopePoint {
    static acceleration = [0.0, 0.1];

    constructor(x, y, isPinned = false) {
        this.position = [x, y];
        //I wrote this.lastPosition = this.position; befrore
        //which incorrectly creates a refrence
        // -> i need to create a "shallow copy"
        this.lastPosition = [...this.position];
        this.isPinned = isPinned;
    }

    updatePoint(deltaTime) {
        // skip doing a physics update if the point is pinned
        if (this.isPinned) {
            return
        }
        let posHolder = [...this.position];
        // need to manually write code to multiply
        // each position

        // x caluclations
        this.position[0] = 2 * this.position[0] - this.lastPosition[0] + (deltaTime ** 2) * RopePoint.acceleration[0];
        // y calculations
        this.position[1] = 2 * this.position[1] - this.lastPosition[1] + (deltaTime ** 2) * RopePoint.acceleration[1];

        this.lastPosition = [...posHolder];
    }
}

class Rope {
    static particleDistance = 10;
    static ropeContainer = document.getElementById("rope-container");
    static numIterations = 30;

    constructor(rope_points) {
        //i called it "parts" here in the sense that each part has a code [0] and a visual [0] component
        this.ropeParts = [[...rope_points], []];
    }

    static createGenericRope(nSegments, startingPos, increment) {
        let ropeArr = [];
        for (let i = 0; i < nSegments; i++) {
            if (i == 0) {
                ropeArr.push(new RopePoint(startingPos[0], startingPos[1], true));
            } else {
                ropeArr.push(new RopePoint(startingPos[0], startingPos[1] + increment * i));
            }
        }
        return new Rope(ropeArr);
    }

    physicallyCreatePoints() {
        for (let i = 0; i < this.ropeParts[0].length; i++) {
            const div = document.createElement("div");
            div.id = "rope-" + i;
            this.ropeParts[1].push(div);
            Rope.ropeContainer.appendChild(div);
            if (i == (this.ropeParts[0].length - 1)) {
                div.className = "final-rope-part";
            } else {
                div.className = "rope-part";
            }
        }
    }

    update(deltaTime) {
        for (let i = 0; i < this.ropeParts[0].length; i++) {
            this.ropeParts[0][i].updatePoint(deltaTime);
        }

        // Automatically run the physics relaxation iterations during the update
        this.jacobson(this.ropeParts[0], Rope.numIterations);
        this.cosmetic();
        this.drawUpdate(deltaTime);
    }

    moveAllToPoint(point) {
        for (let i = 0; i < this.ropeParts[0].length; i++) {
            this.ropeParts[0][i].position[0] = point[0];
            this.ropeParts[0][i].position[1] = point[1];
            this.ropeParts[0][i].lastPosition[0] = point[0];
            this.ropeParts[0][i].lastPosition[1] = point[1];
        }
    }


    drawUpdate(_deltaTime) {
        for (let i = 0; i < this.ropeParts[0].length; i++) {
            this.ropeParts[1][i].style.left = this.ropeParts[0][i].position[0] + "px";
            this.ropeParts[1][i].style.top = this.ropeParts[0][i].position[1] + "px";
            //console.log(this.ropeParts[1][i]);
        }
    }

    cosmetic() {
        for (let i = 0; i < this.ropeParts[0].length - 1; i++) {
            let diffX = this.ropeParts[0][i + 1].position[0] - this.ropeParts[0][i].position[0];
            let diffY = this.ropeParts[0][i + 1].position[1] - this.ropeParts[0][i].position[1];

            let radians = Math.atan(diffY / diffX) + Math.PI / 2;

            this.ropeParts[1][i].style.rotate = radians + "rad";
        }
    }

    relaxUsingConstraints(point1, point2, desiredDistance) {
        let dirX = point2.position[0] - point1.position[0];
        let dirY = point2.position[1] - point1.position[1];

        let magnitude = Math.sqrt((dirX ** 2) + (dirY ** 2));

        // skips if magnitude is zero
        if (magnitude == 0) {
            return;
        }

        let direction = [dirX / magnitude, dirY / magnitude];

        let deltaDist = magnitude - desiredDistance;

        //updating positions

        //note: in the document each direction vector is multiplied by 0.5
        //so each point is "putting in an equal amount of effort" to move to the desired distance
        //however, p1 and p2 weight varaibles are created to account for the scenario where one point should not move
        // and the other point should do all the moving.

        let p1Weight;
        let p2Weight;

        if (point1.isPinned) { p1Weight = 0.0; } else { p1Weight = 0.5; }
        if (point2.isPinned) { p2Weight = 0.0; } else { p2Weight = 0.5; }

        if (point1.isPinned && !(point2.isPinned)) { p2Weight = 1.0; }
        if (point2.isPinned && !(point1.isPinned)) { p1Weight = 1.0; }


        point1.position[0] = point1.position[0] + deltaDist * direction[0] * p1Weight;
        point1.position[1] = point1.position[1] + deltaDist * direction[1] * p1Weight;

        point2.position[0] = point2.position[0] - deltaDist * direction[0] * p2Weight;
        point2.position[1] = point2.position[1] - deltaDist * direction[1] * p2Weight;
    }

    jacobson(objectsList, nInterations) {
        for (let i = 0; i < nInterations; i++) {
            for (let j = 0; j < objectsList.length - 1; j++) {
                this.relaxUsingConstraints(objectsList[j], objectsList[j + 1], Rope.particleDistance)
            }
        }
    }
}

