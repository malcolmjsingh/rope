<<<<<<< Updated upstream
const element = document.documentElement; // Or a specific div

document.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen: ${err.message}`);
        });
    }
});
=======
const fakeCursor = document.getElementById('fake-cursor');
const cursorImage = document.getElementById('cursor-image');
const carouselParent = document.getElementById('carouselParentContainer');

let virtualX = 0;
let virtualY = 0;
let isDraggingCarousel = false;
let dragStartX = 0;
let dragStartAngle = 0;

let myRope = Rope.createGenericRope(15, [50, 50], 10);
let myCarousel = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [50,90], true);
let myCarousel2 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [50,90], true);
let myCarousel3 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [50,90], true);
let myCarousel4 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [50,90], true);
let myCarousel5 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [50,90], true);
let myCarousel6 = Carousel.CreateGenericCarousel(30, "carouselParentContainer", [50,90], true);
let myCarousel7 = Carousel.CreateGenericCarousel(30 , "carouselParentContainer", [50,90], true);
let currentlySelectedCarousel;

console.log(Carousel.carouselInstances);
window.addEventListener("load", () => {
    myRope.physicallyCreatePoints();
    myRope.drawUpdate(1);
    requestAnimationFrame(mainLoop);
});

// 5. Input Listeners
window.addEventListener('mousemove', (e) => {
    myRope.ropeParts[0][0].position[0] = e.clientX;
    myRope.ropeParts[0][0].position[1] = e.clientY;
});

window.addEventListener("mousedown", (e) => {
    const elementAtPoint = document.elementFromPoint(virtualX, virtualY);
    let uniqueCode;
    if (elementAtPoint) {
        if (elementAtPoint.classList.contains("carousel_card")) {
            isDraggingCarousel = true;
            console.log(elementAtPoint);
            for (let i=0; i < elementAtPoint.classList.length; i++) {
                if (elementAtPoint.classList[i].slice(0,14) == "carousel_card_") {
                    uniqueCode = elementAtPoint.classList[i].slice(14);
                    break;
                }
            }
            currentlySelectedCarousel = Carousel.carouselInstances[Number(uniqueCode)];
            currentlySelectedCarousel.carouselScene.classList.add("dragging"); 
            
            // Remember exactly where we grabbed and what the angle was
            dragStartX = virtualX;
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
        currentlySelectedCarousel.rotateCarouselOnce();
        currentlySelectedCarousel.rotateCarouselOnce();
        currentlySelectedCarousel.rotateCarouselOnce();
        currentlySelectedCarousel.updateCurrentlySelectedIndex();
        console.log(currentlySelectedCarousel.currentlySelectedIndex);
    }
});

function mainLoop() {

    myRope.update(1);
    virtualX = myRope.ropeParts[0][(myRope.ropeParts[0].length - 1)].position[0];
    virtualY = myRope.ropeParts[0][(myRope.ropeParts[0].length - 1)].position[1];

    fakeCursor.style.left = virtualX + 'px';
    fakeCursor.style.top = virtualY + 'px';


    const hoveredElement = document.elementFromPoint(virtualX, virtualY);
    if (hoveredElement && hoveredElement.classList.contains("carousel_card")) {
        cursorImage.src = "assets/cursor.png"; 
    } else {
        cursorImage.src = "assets/cursor.png"; 
    }


    if (isDraggingCarousel) {
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

        }
    }

    requestAnimationFrame(mainLoop);
}
>>>>>>> Stashed changes
