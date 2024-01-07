import { useEffect, useState } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger, TextPlugin } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function App() {
  const container = useRef(null);
  const canvasRef = useRef(null);

  const [mode, setMode] = useState("moveUp");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMouse({ x: e.screenX, y: e.screenY });
    console.log(mouse);
  };

  useEffect(() => {
    let canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");

    const TWO_PI = Math.PI * 2;
    let stars = [];
    let starCount = canvas.width < 768 ? 200 : 550;
    let dt = 0.1;
    let starColors = ["#ffffff", "#ffe9c4", "#d4fbff"];
    let gravity = 10000;

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
        ax: 0,
        ay: 0,
      });
    }

    function drawStars() {
      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];

        star.vx += star.ax * dt;
        star.vy += star.ay * dt;
        star.x += star.vx * dt;
        star.y += star.vy * dt;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, TWO_PI);
        ctx.fillStyle = star.color;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 13 * star.radius;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke();
        ctx.fill();
      }
    }

    function moveUp() {
      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        star.vy = 10 / star.depth;
        if (star.y > canvas.height) {
          star.y = -10;
        }
      }
    }

    function gravityCursor() {
      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        let dx = mouse.x - star.x;
        let dy = mouse.y - star.y;
        let distSq = dx * dx + dy * dy;
        let dist = Math.sqrt(distSq);
        let force = gravity / distSq;
        star.ax = (force * dx) / dist;
        star.ay = (force * dy) / dist;
      }
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mode === "gravity") gravityCursor();
      else if (mode === "moveUp") moveUp();
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
          onComplete: () => {
            setMode("moveUp");
          },
        })

        .from("canvas", { opacity: 0 })
        .to("#intro-name", { opacity: 0, display: "none" })

        .from("#intro-skill", { opacity: 0, display: "none" })

        .from("#skill", { opacity: 0, display: "none" })
        .to("#skill", {
          text: { value: "data analyst", delimiter: "" },
          duration: 5,
        })
        .to("#skill", {
          text: { value: "physicist", delimiter: "" },
        });
    },
    { scope: container }
  );

  return (
    <div className="App" ref={container}>
      <canvas onMouseMove={handleMouseMove} ref={canvasRef}></canvas>
      <div className="intro">
        <h1 id="intro-greet-start">Hello there.</h1>
        <h1 id="intro-greet-mid">Its a bit bright isn't it?</h1>
        <h1 id="intro-greet-end">Thats better :)</h1>
        <h1 id="intro-name">I'm Wahid.</h1>
        <h1 id="intro-skill">
          I'm a <span id="skill">web developer</span>
        </h1>
      </div>
    </div>
  );
}

export default App;
