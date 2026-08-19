import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    let raf = 0;
    let tx = -100;
    let ty = -100;
    let cx = -100;
    let cy = -100;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add("cursor-visible");
    };
    const onOver = (e) => {
      const hit = e.target.closest("a, button, input, select, textarea, label, [data-cursor]");
      el.classList.toggle("cursor-active", !!hit);
    };
    const loop = () => {
      cx += (tx - cx) * 0.35;
      cy += (ty - cy) * 0.35;
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <div ref={ref} className="custom-cursor" aria-hidden="true" />;
}
