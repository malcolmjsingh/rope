// carousel.js

class Carousel {
    static carouselInstances = {};

    constructor(numOfCards, carouselSceneID, containerDimentions, carouselID, orientHorizontal = true) {
      this.currentAngle = 0;
      this.numElements = numOfCards;
      this.carouselScene = document.getElementById(carouselSceneID);
      this.isDormant = true;
      this.boxWidthVW = containerDimentions[0];
      this.boxHeightVH = containerDimentions[1];
      this.uniqueID = carouselID;
      this.rotation = orientHorizontal ? "rotateY" : "rotateX";
      this.currentlySelectedIndex = 0;

      if (this.numElements > 0) {
        this.rotationAmountDeg = 360 / this.numElements;
      } else {
        this.rotationAmountDeg = null;
      }

      this.uniqueClassTag = "carousel_card_" + this.uniqueID;

      Carousel.carouselInstances[this.uniqueID] = this;
    }

    static CreateGenericCarousel(nCards, parentContainerID, parentContainerDimentions, orientHorizontal = true) {
      const carouselSceneDiv = document.createElement("div");
      const parentContainer = document.getElementById(parentContainerID);
      console.log(parentContainer);
      parentContainer.appendChild(carouselSceneDiv);
      let uniqueid = Carousel.generateUniqueID();
      carouselSceneDiv.id = "carousel_id_" + uniqueid;
      let newcarousel = new Carousel(nCards, carouselSceneDiv.id, parentContainerDimentions, uniqueid, orientHorizontal);
      newcarousel.setupCarouselScene();
      newcarousel.setupCarouselParts();
      return newcarousel;
    }

    static generateUniqueID() {
      let generatedID = getRandomInt(10000,99999);
      let isIDUnique = false;
      while (isIDUnique == false) {
        isIDUnique = true;
        for (let i = 0; i < Carousel.carouselInstances.length; i++) {
            if (Carousel.carouselInstances[i].uniqueID == generatedID) {
              isIDUnique = false;
              generatedID = getRandomInt(10000,99999);
              break;
            }
        }

      }
      return generatedID;
    }

    setupCarouselScene() {
      this.carouselScene.style.width = "10vw";
      this.carouselScene.style.height = "10vh";
      this.carouselScene.style.position = "relative";
      this.carouselScene.style.transformStyle = "preserve-3d";
      this.carouselScene.style.transition = "transform 1s cubic-bezier(0.165, 0.84, 0.44, 1)";
      this.carouselScene.style.backgroundColor = "greenyellow";
    }

    setupCarouselParts() {
      let elementQueryString = "." + this.uniqueClassTag;
      let carousel_elements = document.querySelectorAll(elementQueryString);
      let cardWidthVW = this.boxWidthVW * Math.sin(Math.PI / this.numElements);
      let translateZVal;
      let cardHeightVH = this.boxHeightVH * Math.sin(Math.PI / this.numElements);

      for (let i=0; i < this.numElements; i++) {
        const div = document.createElement("div");
        this.carouselScene.appendChild(div);
        div.classList.add(this.uniqueClassTag);
        div.classList.add("carousel_card");
        div.style.backgroundColor = "rgba(" + getRandomInt(0,255) + ", " + getRandomInt(0,255) + ", " + getRandomInt(0,255) + ", " + "0.9)";
      
        let elmRotationAmount = this.rotationAmountDeg * i;
        if (this.rotation == "rotateY") {
          console.log("rotate y ran");
          div.style.width = cardWidthVW + "vw";
          translateZVal = (cardWidthVW / 2) / Math.tan(Math.PI / this.numElements)
          div.style.transform = this.rotation + "(" + elmRotationAmount + "deg) " +"translateZ(" + translateZVal + "vw)";
        
        } else if (this.rotation == "rotateX") {
          console.log("rotate X ran");
          div.style.height = cardHeightVH + "vh";
          translateZVal = (cardHeightVH / 2) / Math.tan(Math.PI / this.numElements)
          div.style.transform = this.rotation + "(" + elmRotationAmount + "deg) " +"translateZ(" + translateZVal + "vh)";
        
        }

        
        div.textContent = i;
      }

      this.carouselScene.style.width = cardWidthVW + "vw";
      this.carouselScene.style.height = cardHeightVH + "vh";
    }

    rotateCarouselOnce() {
      this.currentAngle -= this.rotationAmountDeg;
      this.carouselScene.style.transform = this.rotation + "("+ this.currentAngle + "deg)";
    }

    updateCurrentlySelectedIndex() {
      console.log(this.currentAngle);
      let lowVal = Math.trunc(this.currentAngle / this.rotationAmountDeg) * this.rotationAmountDeg;
      let highVal = lowVal   + this.rotationAmountDeg;
      
      if (Math.abs(this.currentAngle - lowVal) > Math.abs(this.currentAngle - highVal)) {
        //distance to low val is greater than distance to high val
        this.currentlySelectedIndex = (highVal / 360) * this.numElements
      } else {
        this.currentlySelectedIndex = (lowVal / 360) * this.numElements
      }
    }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
