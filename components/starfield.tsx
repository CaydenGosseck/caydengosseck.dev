"use client";

import { useEffect, useRef } from "react";

type Star = {
    x: number;
    y: number;
    size: number;
    twinkleSpeed: number;
    twinklePhase: number;
};

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const stars: Star[] = Array.from({ length: 250 }, () => ({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.2 + 0.3,
            twinkleSpeed: Math.random() * 0.015 + 0.003,
            twinklePhase: Math.random() * Math.PI * 2,
        }));

        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 1;

            for (const star of stars) {
                const opacity = 0.3 + 0.7 * Math.abs(Math.sin(t * star.twinkleSpeed + star.twinklePhase));
                ctx.beginPath();
                ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(240, 232, 216, ${opacity})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            draw();
        }

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
        />
    );
}
