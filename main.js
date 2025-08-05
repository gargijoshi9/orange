import { gsap } from "gsap";

window.addEventListener("DOMContentLoaded", function() {
    const orange = document.getElementById("orangeContainer");
    const orangeWidth = orange.offsetWidth;
    const screenWidth = window.innerWidth;

    gsap.set(orange, { x: -orangeWidth, y: 30, rotation: 0 });
    gsap.timeline()
        .to(orange, { duration: 0.6, x: 0, y: 0, ease: "power3.out" })    // Slide in
        .to(orange, { duration: 0.4, y: -60, ease: "power1.out" })         // Bounce up
        .to(orange, { duration: 0.3, y: 0, ease: "bounce.out" })           // Fall down
        .to(orange, {
            duration: 1.2, 
            x: screenWidth + orangeWidth,
            rotation: 540,
            ease: "power3.in",
            delay: 0.3
        })
        .to(orange, { autoAlpha: 0, duration: 0.2 }, ">");
});
