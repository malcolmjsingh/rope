class ImageSprayEffect {
    constructor(imageUrl, parentContainerID, startingPosition) {
        this.effectImageUrl = imageUrl;
        this.parentContainerID = parentContainerID;
        this.parentContainer = document.getElementById(this.parentContainerID);
        this.startingPosition = startingPosition; // Fixed typo: startingPositions -> startingPosition
        this.listOfElements = [];
        this.gravity = 0.5; // How fast they fall down
        this.animationFrameId = null; // Keeps track of the animation loop
    }

    // Call this to shoot a bunch of particles at once
    burst(particleCount = 15) {
        for (let i = 0; i < particleCount; i++) {
            this.createImageElement();
        }
        
        // Start the animation loop if it isn't already running
        if (!this.animationFrameId) {
            this.animate();
        }
    }

    createImageElement() {
        // Create random velocities for the "spray" effect
        // X velocity: random number between -8 and +8 (left or right)
        let randomVx = (Math.random() - 0.5) * 16; 
        
        // Y velocity: random number between -5 and -15 (shooting upward)
        let randomVy = (Math.random() * -10) - 5;  

        let elm = new ImageSprayElement(
            this.effectImageUrl, 
            this.startingPosition, 
            [randomVx, randomVy]
        );

        this.listOfElements.push(elm);
        
        // Append the actual HTML element from the class, not the JS object itself
        this.parentContainer.appendChild(elm.htmlElement);
    }

    animate() {
        // Loop backwards through the array. 
        // We go backwards so that if we delete a particle, it doesn't mess up our loop index.
        for (let i = this.listOfElements.length - 1; i >= 0; i--) {
            let particle = this.listOfElements[i];
            
            // Move the particle
            particle.update(this.gravity);

            // Cleanup: If the particle falls below the screen height, remove it
            if (particle.transformPosY > window.innerHeight + 100) {
                particle.htmlElement.remove(); // Remove from the DOM (screen)
                this.listOfElements.splice(i, 1); // Remove from the JS array
            }
        }

        // If there are still particles alive, request the next frame
        if (this.listOfElements.length > 0) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        } else {
            // Stop the loop when all particles are gone to save CPU
            this.animationFrameId = null; 
        }
    }
}

class ImageSprayElement {
    constructor(imageUrl, startingPosition, startingVelocity) {
        this.transformPosX = startingPosition[0];
        this.transformPosY = startingPosition[1];
        
        this.velocityX = startingVelocity[0];
        this.velocityY = startingVelocity[1];
        
        // Let's add a random rotation spin for extra flair!
        this.rotation = 0;
        this.spinSpeed = (Math.random() - 0.5) * 10; 

        // Create the actual HTML Image element
        this.htmlElement = document.createElement("img");
        this.htmlElement.src = imageUrl;
        
        // Style it so it floats over everything and doesn't interrupt clicks
        this.htmlElement.style.position = "absolute";
        this.htmlElement.style.pointerEvents = "none";
        this.htmlElement.style.zIndex = "9999";
        this.htmlElement.style.width = "50px"; // Adjust image size here
        
        this.draw();
    }

    // Applies physics
    update(gravity) {
        this.velocityY += gravity; // Gravity pulls the velocity down
        
        this.transformPosX += this.velocityX;
        this.transformPosY += this.velocityY;
        this.rotation += this.spinSpeed;
        
        this.draw();
    }

    // Updates the CSS to match the math
    draw() {
        this.htmlElement.style.transform = `translate(${this.transformPosX}px, ${this.transformPosY}px) rotate(${this.rotation}deg)`;
    }
}