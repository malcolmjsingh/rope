const fakeCursor = document.getElementById('fake-cursor');
const cursorImage = document.getElementById('cursor-image');
const carouselParent = document.getElementById('carouselParentContainer');

let password;

let virtualX = 0;
let virtualY = 0;
let isDraggingCarousel = false;
let dragStartX = 0;
let dragStartAngle = 0;

let myRope = Rope.createGenericRope(20, [50, 50], 10);

let currentlySelectedCarousel;
let currentlyDraggingCarouselClassID;

let ropeIsActivated = false;
let clickedGenerateCodeButtonYet = false;

let mousePosition = { x: 0, y: 0 };

let carousel1;
let carousel2;
let carousel3;
let carousel4;
let carousel5;
let carousel6;

let ajndsius = new ImageSprayEffect("assets/unpleasantgradient.jpg", "testcontainer", [770,400]);

function startProcess1() {
    const mainWhiteContainer = document.querySelector(".mainWhiteContainer");
    mainWhiteContainer.style.display = "none";
    const gorbContainer = document.querySelector(".gorb");
    gorbContainer.style.display = "flex"; 

}

function startProcess2() {
    if (!clickedGenerateCodeButtonYet) {
        //const codegeneratingtexth2 = document.getElementById("codegeneratingtext");
        //codegeneratingtexth2.textContent = "the code was generated 🥶🥶🥶🥶🥶🥶";

        const codegeneratingtext3 = document.getElementById("codegeneratingtext3");
        codegeneratingtext3.textContent = "Your Recovery Code as been sent to you via Email. Please enter the code using the dials to the right.";
        
        const carouselModule = document.getElementById("carousel-entire-module");
        if (carouselModule) {
            carouselModule.style.display = "flex"; 
        }

        const arrowLeft = document.getElementById("arrow-left");
        const arrowTop = document.getElementById("arrow-top");
        if (arrowLeft) arrowLeft.style.display = "none";
        if (arrowTop) arrowTop.style.display = "block";

        carousel1 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [25,50], true);
        carousel2 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [25,50], true);
        carousel3 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [25,50], true);
        carousel4 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [25,50], true);
        carousel5 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [25,50], true);
        carousel6 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [25,50], true);
        
        myRope.moveAllToPoint([mousePosition.x,mousePosition.y]);
        myRope.physicallyCreatePoints();
        myRope.drawUpdate(1);
        clickedGenerateCodeButtonYet = true;
        document.getElementById("startProcess2button").style.pointerEvents = "none";
        setTimeout(() => {
            ropeIsActivated = true;
        }, 50); 

        password = [getRandomInt(0,29),getRandomInt(0,29),getRandomInt(0,29),getRandomInt(0,29),getRandomInt(0,29),getRandomInt(0,29)];
        console.log(password);
    }
}

function submitCarouselCode() {
    let carousel1Data = carousel1.getSelectedCells();
    let carousel2Data = carousel2.getSelectedCells();
    let carousel3Data = carousel3.getSelectedCells();
    let carousel4Data = carousel4.getSelectedCells();
    let carousel5Data = carousel5.getSelectedCells();
    let carousel6Data = carousel6.getSelectedCells();
    let fullData = [carousel1Data["center"],carousel2Data["center"],carousel3Data["center"],carousel4Data["center"],carousel5Data["center"],carousel6Data["center"]];
    console.log(fullData);
    
    let dataIsSame = true;
    for (let i=0; i<fullData.length; i++) {
        if (fullData[i] != password[i]) {
            dataIsSame = false;
        }
    }

    if (dataIsSame) {
        alert("completed");
    } else {
        alert("Inputted Code was not found. Please try again.");
    }
}

function getUniqueCode(element, returnFullID = false) {
    let uniqueCode = null;
    if (element.classList.contains("carousel_card")) {
            for (let i=0; i < element.classList.length; i++) {
                if (element.classList[i].slice(0,14) == "carousel_card_") {
                    if (returnFullID == false) {
                        uniqueCode = element.classList[i].slice(14);
                    } else {
                        uniqueCode = element.classList[i];
                    }
                    break;
                }
            }
    } 
    return uniqueCode;
}

window.addEventListener("load", () => {
    requestAnimationFrame(mainLoop);
});

window.addEventListener('mousemove', (e) => {
    myRope.ropeParts[0][0].position[0] = e.clientX;
    myRope.ropeParts[0][0].position[1] = e.clientY;

    if (ropeIsActivated == false) {
        fakeCursor.style.left = e.clientX + 'px';
        fakeCursor.style.top = e.clientY + 'px';
    }

    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
});

window.addEventListener("mousedown", (e) => {
    const elementAtPoint = document.elementFromPoint(virtualX, virtualY);
    if (elementAtPoint) {
        if (elementAtPoint.classList.contains("carousel_card")) {
            isDraggingCarousel = true;
            currentlySelectedCarousel = Carousel.carouselInstances[Number(getUniqueCode(elementAtPoint))];
            currentlySelectedCarousel.carouselScene.classList.add("dragging"); 
            currentlyDraggingCarouselClassID = getUniqueCode(elementAtPoint, true);
            dragStartX = virtualX;
            dragStartY = virtualY;
            dragStartAngle = currentlySelectedCarousel.currentAngle;
        } 
        else if (elementAtPoint.tagName === "BUTTON") {
            elementAtPoint.click();
            elementAtPoint.classList.add("pressed");
            setTimeout(() => elementAtPoint.classList.remove("pressed"), 150);
        }
    }
});

window.addEventListener("mouseup", () => {
    if (isDraggingCarousel) {
        isDraggingCarousel = false;
        currentlySelectedCarousel.carouselScene.classList.remove("dragging"); 
    }
    
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentlySelectedCarousel.rotateCarouselOnce();
    }
    if (event.key === "b") {
        for (const [key, carouselInstance] of Object.entries(Carousel.carouselInstances)) {
            carouselInstance.rotateCarouselOnce();
        }
        rotateAllCarousels();
        setTimeout(() => {
            for (const [key, carouselInstance] of Object.entries(Carousel.carouselInstances)) {
            for (let i=0; i<getRandomInt(10,1000); i++){
                setTimeout(() => {
                    for (let j=0; j<getRandomInt(10,1000); j++){
                        carouselInstance.rotateCarouselOnce(getRandomInt(3,40));
                    }
                }, 100);
                
            }
        }
        ajndsius.burst(2000);
        setTimeout(() => {
            ajndsius.burst(2000);
        }, 300);
        setTimeout(() => {
            ajndsius.burst(2000);
        }, 300);
        }, 1000);
        
        
    }

    if (event.key == "r") {
        rotateAllCarousels();
    }

    if (event.key == "z") {
        ajndsius.burst(5000);
    }
});

function rotateAllCarousels() {
    let parentElement = null;
    let currentRotation = null;
    for (const [key, carouselInstance] of Object.entries(Carousel.carouselInstances)) {

        carouselInstance.switchOrientation();

        parentElement = carouselInstance.carouselScene.parentElement;
        currentRotation = carouselInstance.rotation;
        
        if (parentElement) {
            const arrowLeft = document.getElementById("arrow-left");
            const arrowTop = document.getElementById("arrow-top");
            if (carouselInstance.rotation == "rotateY") {
                parentElement.style.setProperty("flex-direction", "column", "important");
                if (arrowLeft) arrowLeft.style.display = "none";
                if (arrowTop) arrowTop.style.display = "block";
            } else if (carouselInstance.rotation == "rotateX") {
                parentElement.style.setProperty("flex-direction", "row", "important");
                if (arrowLeft) arrowLeft.style.display = "block";
                if (arrowTop) arrowTop.style.display = "none";
            }
        } 
    }
}

function mainLoop() {

    ropeUpdateHandler();
    cursorImageHandler();
    carouselDragHandler();

    requestAnimationFrame(mainLoop);
}

function ropeUpdateHandler() {
    if (ropeIsActivated == true) {
        myRope.update(1);
        virtualX = myRope.ropeParts[0][(myRope.ropeParts[0].length - 1)].position[0];
        virtualY = myRope.ropeParts[0][(myRope.ropeParts[0].length - 1)].position[1];

        fakeCursor.style.left = virtualX + 'px';
        fakeCursor.style.top = virtualY + 'px';
    }
}

function cursorImageHandler() {
    const hoveredElement = document.elementFromPoint(virtualX, virtualY);
    if (hoveredElement && hoveredElement.classList.contains("carousel_card")) {
        cursorImage.src = "assets/openhandnobg.png"; 
    } else {
        cursorImage.src = "assets/cursor.png"; 
    }
}

function carouselDragHandler() {
    const hoveredElement = document.elementFromPoint(virtualX, virtualY);
    if (isDraggingCarousel) {
        cursorImage.src = "assets/handgrab.png"; 
        
        if (!hoveredElement.classList.contains(currentlyDraggingCarouselClassID)) {
            isDraggingCarousel = false;
            currentlySelectedCarousel.carouselScene.classList.remove("dragging"); 
            currentlyDraggingCarouselClassID = null;
        }

        if (currentlySelectedCarousel.rotation == "rotateY") {
            const rect = carouselParent.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const radius = rect.width / 2;

            let startNormX = (dragStartX - centerX) / radius;
            let startClamped = Math.max(-1, Math.min(1, startNormX));
            let startOverflow = startNormX - startClamped;

            let currentNormX = (virtualX - centerX) / radius;
            let currentClamped = Math.max(-1, Math.min(1, currentNormX));
            let currentOverflow = currentNormX - currentClamped;

            let deltaTheta = Math.asin(currentClamped) - Math.asin(startClamped);
            let arcDegrees = deltaTheta * (180 / Math.PI);

            let linearSensitivity = 60; 
            let overflowDegrees = (currentOverflow - startOverflow) * linearSensitivity;

            currentlySelectedCarousel.currentAngle = dragStartAngle + arcDegrees + overflowDegrees; 
            currentlySelectedCarousel.carouselScene.style.transform = `rotateY(${currentlySelectedCarousel.currentAngle}deg)`;
        }
        else if (currentlySelectedCarousel.rotation == "rotateX") {
            const rect = carouselParent.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const Hradius = rect.height / 2;

            let startNormY = (dragStartY - centerY) / Hradius;
            let startClamped = Math.max(-1, Math.min(1, startNormY));
            let startOverflow = startNormY - startClamped;

            let currentNormY = (virtualY - centerY) / Hradius;
            let currentClamped = Math.max(-1, Math.min(1, currentNormY));
            let currentOverflow = currentNormY - currentClamped;

            let deltaTheta = Math.asin(currentClamped) - Math.asin(startClamped);
            let arcDegrees = deltaTheta * (180 / Math.PI);

            let linearSensitivity = 60; 
            let overflowDegrees = (currentOverflow - startOverflow) * linearSensitivity;

            currentlySelectedCarousel.currentAngle = dragStartAngle - arcDegrees - overflowDegrees; 
            currentlySelectedCarousel.carouselScene.style.transform = `rotateX(${currentlySelectedCarousel.currentAngle}deg)`;
        }
    }
}
