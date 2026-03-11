(function () {
  const rootEl = document.getElementById("bg-root");
  if (!rootEl || !window.React || !window.ReactDOM) {
    return;
  }

  const { useEffect, useRef } = React;

  function BackgroundCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const nodeCount = 18;
      const gridSize = 90;
      const nodes = Array.from({ length: nodeCount }).map((_, index) => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        phase: index * 0.6
      }));

      let width = 0;
      let height = 0;
      let dpr = window.devicePixelRatio || 1;
      let rafId = 0;
      const start = performance.now();

      const resize = () => {
        const rect = rootEl.getBoundingClientRect();
        width = rect.width || window.innerWidth;
        height = rect.height || window.innerHeight;
        dpr = window.devicePixelRatio || 1;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const drawGrid = () => {
        ctx.strokeStyle = "rgba(36, 209, 143, 0.06)";
        ctx.lineWidth = 1;
        for (let x = 0; x <= width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      };

      const drawConnections = (t) => {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0.25) {
              continue;
            }
            const alpha = 0.12 * (1 - dist / 0.25);
            ctx.strokeStyle = `rgba(86, 207, 225, ${alpha})`;
            ctx.lineWidth = 1;
            const x1 = nodes[i].x * width;
            const y1 = nodes[i].y * height;
            const x2 = nodes[j].x * width;
            const y2 = nodes[j].y * height;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            if ((i + j) % 4 === 0) {
              const travel = (t * 0.08 + nodes[i].phase) % 1;
              const px = x1 + (x2 - x1) * travel;
              const py = y1 + (y2 - y1) * travel;
              ctx.fillStyle = `rgba(36, 209, 143, ${alpha + 0.1})`;
              ctx.beginPath();
              ctx.arc(px, py, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      };

      const drawNodes = (t) => {
        nodes.forEach((node) => {
          const pulse = 0.4 + 0.6 * Math.sin(t * 1.4 + node.phase);
          ctx.fillStyle = `rgba(36, 209, 143, ${0.25 + pulse * 0.25})`;
          ctx.beginPath();
          ctx.arc(node.x * width, node.y * height, 3.2, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      const updateNodes = () => {
        nodes.forEach((node) => {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0.05 || node.x > 0.95) {
            node.vx *= -1;
          }
          if (node.y < 0.05 || node.y > 0.95) {
            node.vy *= -1;
          }
        });
      };

      const draw = (timeMs) => {
        const t = (timeMs - start) * 0.001;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#020409";
        ctx.fillRect(0, 0, width, height);

        drawGrid();
        drawConnections(t);
        drawNodes(t);
        updateNodes();
      };

      const renderFrame = (timeMs) => {
        draw(timeMs);
        rafId = window.requestAnimationFrame(renderFrame);
      };

      const startAnimation = () => {
        if (prefersReduced.matches) {
          draw(start);
          return;
        }
        rafId = window.requestAnimationFrame(renderFrame);
      };

      const stopAnimation = () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };

      const handlePreferenceChange = () => {
        stopAnimation();
        startAnimation();
      };

      resize();
      startAnimation();
      window.addEventListener("resize", resize);
      prefersReduced.addEventListener?.("change", handlePreferenceChange);

      return () => {
        stopAnimation();
        window.removeEventListener("resize", resize);
        prefersReduced.removeEventListener?.("change", handlePreferenceChange);
      };
    }, []);

    return React.createElement("canvas", { ref: canvasRef, role: "presentation", "aria-hidden": "true" });
  }

  const root = ReactDOM.createRoot ? ReactDOM.createRoot(rootEl) : null;
  if (root) {
    root.render(React.createElement(BackgroundCanvas));
  } else {
    ReactDOM.render(React.createElement(BackgroundCanvas), rootEl);
  }
})();
