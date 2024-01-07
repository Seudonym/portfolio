import { useEffect, useState } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef(null);

  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    let canvas = document.querySelector("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    let ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    };

    window.addEventListener("resize", resizeCanvas);

    const TWO_PI = Math.PI * 2;
    let stars = [];
    let starCount = canvas.width < 768 ? 200 : 550;
    // let time = 0;
    let starColors = ["#ffffff", "#ffe9c4", "#d4fbff"];

    for (let i = 0; i < starCount; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      let radius = Math.random() * 2;
      let color = starColors[Math.floor(Math.random() * starColors.length)];
      let depth = Math.random() * 20;

      stars.push({
        x: x,
        y: y,
        radius: radius,
        color: color,
        depth: depth,
        vx: 0,
        vy: 10,
      });
    }

    function drawStars() {
      for (let i = 0; i < stars.length; i++) {
        let { x, y, radius, color } = stars[i];

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TWO_PI);
        ctx.fillStyle = color;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 13 * radius;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke();
        ctx.fill();
      }
    }

    function moveStars() {
      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        star.y += star.vy / star.depth;
        if (star.y > canvas.height) {
          star.x = Math.random() * canvas.width;
          star.depth = Math.random() * 20;
          star.y = -10;
        }
      }
    }

    function applyGravity() {
      for (let i = 0; i < stars.length; i++) {
        for (let j = 0; j < stars.length; j++) {
          if (i === j) continue;
          let star1 = stars[i];
          let star2 = stars[j];

          let dx = star1.x - star2.x;
          let dy = star1.y - star2.y;

          let distanceSq = dx * dx + dy * dy;
          if (distanceSq === 0) distanceSq = 0.01;
          let distance = Math.sqrt(distanceSq);
          let forceX = 0; //  (dx / distance) * (star1.radius * star2.radius) / (distanceSq);
          let forceY = 0; // (dy / distance) * (star1.radius * star2.radius) / (distanceSq);

          star1.vx -= forceX / star1.radius;
          star1.vy -= forceY / star2.radius;

          star2.vx -= forceX / star2.radius;
          star2.vy -= forceY / star2.radius;

          star1.x += star1.vx;
          star1.y += star1.vy;

          star2.x += star2.vx;
          star2.y += star2.vy;
        }
      }
    }

    function update() {
      console.log("update");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // moveStars();
      applyGravity();
      drawStars();
      requestAnimationFrame(update);
    }

    if (showCanvas) update();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [showCanvas]);

  useGSAP(
    () => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=6000",
          pin: true,
          scrub: 1,
          snap: [1 / 9, 3 / 9, 5 / 9, 6 / 9, 8 / 9, 1],
        },
        defaults: { duration: 2 },
      });

      tl.from("#intro-greet-start", {
        opacity: 0,
        y: 140,
        display: "none",
        ease: "sine.inOut",
      })
        .to("#intro-greet-start", { opacity: 0, display: "none" })

        .from("#intro-greet-mid", { opacity: 0, display: "none" })
        .to("#intro-greet-mid", { opacity: 0, display: "none" })

        .to(container.current, { backgroundColor: "black", color: "white" })

        .from("#intro-greet-end", { opacity: 0, display: "none" })
        .to("#intro-greet-end", { opacity: 0, display: "none" })

        .from("#intro-name", {
          opacity: 0,
          display: "none",
          onComplete: () => setShowCanvas(true),
        })

        .from("canvas", { opacity: 0 })
        .to("#intro-name", { opacity: 0, display: "none" })

        .from("#intro-skill", { opacity: 0, display: "none" });
    },
    { scope: container }
  );

  return (
    <div className="App" ref={container}>
      <canvas></canvas>
      <div className="intro">
        <h1 id="intro-greet-start">Hello there.</h1>
        <h1 id="intro-greet-mid">Its a bit bright isn't it?</h1>
        <h1 id="intro-greet-end">Thats better :)</h1>
        <h1 id="intro-name">I'm Wahid.</h1>
        <h1 id="intro-skill">
          I'm a <span id="skill">web developer</span>.
        </h1>
      </div>
    </div>
  );
}

export default App;
