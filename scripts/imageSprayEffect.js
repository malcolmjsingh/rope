
class ImageSprayEffect {
    constructor(imageUrl, parentContainerID, startingPosition) {
        this.effectImageUrl = imageUrl;
        this.parentContainerID = parentContainerID;
        this.parentContainer = document.getElementById(this.parentContainerID);
        this.startingPosition = startingPositions;
        this.listOfElements = [];
    }

    createImageElement() {
        let elm = new ImageSprayElement(this.imageUrl, this.startingPosition, [0,0,0]);
        this.listOfElements.push(elm);
        this.parentContainer.appendChild(elm);
    }
    
}

class ImageSprayElement {
    constructor(imageUrl, startingPosition, startingVelocity) {
        this.transformPosX = startingPosition[0];
        this.transformPosY = startingPosition[1];
        this.transformPosZ = startingPosition[2];
        this.velocityVector = [...startingVelocity];
        this.imageUrl = imageUrl;
        this.currentlyActive = false;
    }
}
