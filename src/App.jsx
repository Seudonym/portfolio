import { useEffect, useState } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef(null);

  const [stars, setStars] = useState([]);

  useEffect(() => {
    let canvas = document.querySelector("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    let ctx = canvas.getContext("2d");

    // Resize canvas on window resize
    window.addEventListener("resize", () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    });

    let stars = [];
    let starCount = 250;
    let starSpeed = 5;
    // let time = 0;

    let starColors = ["#ffffff"];

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
      });
    }

    function drawStars() {
      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10 * star.radius;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke();
        ctx.fill();
      }
    }

    function moveStars() {
      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        star.y += starSpeed / star.depth;
        if (star.y > canvas.height) {
          star.x = Math.random() * canvas.width;
          star.depth = Math.random() * 20;
          star.y = -10;
        }
      }
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveStars();
      drawStars();
      requestAnimationFrame(update);
    }

    update();
  });

  useGSAP(
    () => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=6000",
          pin: true,
          scrub: 1,
        },
      });

      tl.from("#intro-greet-start", { opacity: 0, y: 140, display: 'none' })
        .to("#intro-greet-start", { opacity: 0 , display: 'none' })

        .from("#intro-greet-mid", { opacity: 0, display: 'none' })
        .to("#intro-greet-mid", { opacity: 0 , display: 'none' })

        .to(container.current, { backgroundColor: "black", color: "white" })

        .from("#intro-greet-end", { opacity: 0, display: 'none' })
        .to("#intro-greet-end", { opacity: 0 , display: 'none' })

        .from("#intro-name", { opacity: 0 , display: 'none' })

        .from("canvas", { opacity: 0 })

    },
    { scope: container }
  );

  return (
    <div className="App" ref={container}>
      <canvas></canvas>
      <div className="intro">
        <h1 id="intro-greet-start">Hello there.</h1>
        <h1 id="intro-greet-mid">Its a bit bright isn't it?</h1>
        <h1 id="intro-greet-end">Thats better.</h1>
        <h1 id="intro-name">I'm Wahid.</h1>
      </div>
    </div>
  );
}

export default App;
