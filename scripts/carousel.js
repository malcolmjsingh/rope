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
      this.carouselScene.style.backgroundColor = "rgba(0, 0, 0, 0);";
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

        

        //div.style.backgroundColor = "rgba(" + getRandomInt(0,255) + ", " + getRandomInt(0,255) + ", " + getRandomInt(0,255) + ", " + "0.9)";
        div.style.backgroundColor = "gray";

        let elmRotationAmount = this.rotationAmountDeg * i;
        if (this.rotation == "rotateY") {
          div.style.width = cardWidthVW + "vw";
          translateZVal = (cardWidthVW / 2) / Math.tan(Math.PI / this.numElements)
          div.style.transform = this.rotation + "(" + elmRotationAmount + "deg) " +"translateZ(" + translateZVal + "vw)";
        
        } else if (this.rotation == "rotateX") {
          div.style.height = cardHeightVH + "vh";
          translateZVal = (cardHeightVH / 2) / Math.tan(Math.PI / this.numElements)
          div.style.transform = this.rotation + "(" + elmRotationAmount + "deg) " +"translateZ(" + translateZVal + "vh)";
        
        }

        
        div.textContent = i;
      }

      this.carouselScene.style.width = cardWidthVW + "vw";
      this.carouselScene.style.height = cardHeightVH + "vh";
    }

    rotateCarouselOnce(amount = 1) {
      this.currentAngle -= this.rotationAmountDeg * amount;
      this.carouselScene.style.transform = this.rotation + "("+ this.currentAngle + "deg)";
    }

    switchOrientation() {
      this.rotation = this.rotation === "rotateY" ? "rotateX" : "rotateY";

      let cardWidthVW = this.boxWidthVW * Math.sin(Math.PI / this.numElements);
      let cardHeightVH = this.boxHeightVH * Math.sin(Math.PI / this.numElements);
      
      let translateZVal;
      let zUnit;

      if (this.rotation === "rotateY") {
        translateZVal = (cardWidthVW / 2) / Math.tan(Math.PI / this.numElements);
        zUnit = "vw";
      } else {
        translateZVal = (cardHeightVH / 2) / Math.tan(Math.PI / this.numElements);
        zUnit = "vh";
      }

      let cards = this.carouselScene.querySelectorAll('.carousel_card');
      
      for (let i = 0; i < cards.length; i++) {
        let div = cards[i];
        let elmRotationAmount = this.rotationAmountDeg * i;
        
        div.style.transform = this.rotation + "(" + elmRotationAmount + "deg) translateZ(" + translateZVal + zUnit + ")";
         if (this.rotation === "rotateY") {
            div.style.width = cardWidthVW + "vw";
            div.style.height = "100%"; 
          } else if (this.rotation === "rotateX") {
            div.style.height = cardHeightVH + "vh";
            div.style.width = "100%"; 
        }
      }
      this.carouselScene.style.transform = this.rotation + "(" + this.currentAngle + "deg)";
  }

    getSelectedCells() {
    // ai generated becasue i was too lazy to manually write this 😭

    // 1. Calculate how many "slots" the carousel has rotated.
    // We use -this.currentAngle because rotating the scene positively 
    // brings negative indexed cards (wrapping backwards) to the front.
    let steps = Math.round(-this.currentAngle / this.rotationAmountDeg);

    // 2. Safely wrap the index between 0 and (numElements - 1).
    // Note: We do ((steps % N) + N) % N instead of just (steps % N) 
    // because JavaScript has a quirk where negative modulos remain negative (e.g. -1 % 9 = -1).
    let N = this.numElements;
    let frontIndex = ((steps % N) + N) % N;

    // 3. Find the offset for the edges (a quarter turn = N / 4)
    let edgeOffset = Math.round(N / 4);

    // 4. Calculate the indexes of the edge cards
    let rightOrBottomEdge = (frontIndex + edgeOffset) % N;
    let leftOrTopEdge = (((frontIndex - edgeOffset) % N) + N) % N;

    // Return the data cleanly
    return {
        center: frontIndex,
        right: this.rotation === "rotateY" ? rightOrBottomEdge : null,
        left: this.rotation === "rotateY" ? leftOrTopEdge : null,
        bottom: this.rotation === "rotateX" ? rightOrBottomEdge : null,
        top: this.rotation === "rotateX" ? leftOrTopEdge : null
    };

}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
