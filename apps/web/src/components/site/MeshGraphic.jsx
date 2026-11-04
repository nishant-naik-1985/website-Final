import React, { useEffect, useRef } from 'react';

// Animated triangulated mesh for the home page hero, echoing the mesh "C" in
// the logo. Two slow "load" zones drift across it, brightening and slightly
// displacing the mesh like a simulation result. Drawn on a canvas so it costs
// a few KB instead of a large image; it pauses off-screen and shows a still
// frame for visitors who prefer reduced motion.

const ELECTRIC = [36, 116, 245]; // --electric, hsl(217 91% 55%)
const HIGHLIGHT = [110, 205, 255]; // cyan, like the hot end of a result contour

// Small seeded random generator, so the mesh layout is the same on every visit.
function createRandom(seed) {
    let state = seed;
    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

function buildMesh(width, height) {
    const random = createRandom(7);
    const spacing = Math.max(56, Math.min(84, width / 18));
    const rowHeight = spacing * 0.866;
    const cols = Math.ceil(width / spacing) + 3;
    const rows = Math.ceil(height / rowHeight) + 3;

    const grid = [];
    const nodes = [];
    for (let r = 0; r < rows; r += 1) {
        grid[r] = [];
        for (let c = 0; c < cols; c += 1) {
            // Offsetting odd rows by half a cell gives a triangular lattice.
            const node = {
                x: (c - 1) * spacing + (r % 2 ? spacing / 2 : 0) + (random() - 0.5) * spacing * 0.45,
                y: (r - 1) * rowHeight + (random() - 0.5) * spacing * 0.45,
                phase: random() * Math.PI * 2,
                amplitude: 2 + random() * 4,
                hub: random() < 0.07,
            };
            grid[r][c] = node;
            nodes.push(node);
        }
    }

    const edges = [];
    for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
            const node = grid[r][c];
            if (c + 1 < cols) edges.push([node, grid[r][c + 1]]);
            if (r + 1 < rows) {
                const below = r % 2 ? [c, c + 1] : [c - 1, c];
                below.forEach((bc) => {
                    if (bc >= 0 && bc < cols) edges.push([node, grid[r + 1][bc]]);
                });
            }
        }
    }

    return { nodes, edges };
}

function mix(from, to, amount) {
    return from.map((value, i) => Math.round(value + (to[i] - value) * amount));
}

function drawFrame(ctx, mesh, width, height, time) {
    ctx.clearRect(0, 0, width, height);

    // Two load zones drifting on slow, out-of-step paths.
    const sigma = Math.max(width, height) * 0.11;
    const zones = [
        {
            x: width * (0.5 + 0.38 * Math.sin(time * 0.00011)),
            y: height * (0.5 + 0.3 * Math.sin(time * 0.00023)),
        },
        {
            x: width * (0.5 + 0.38 * Math.sin(time * 0.00007 + 2.1)),
            y: height * (0.5 + 0.32 * Math.cos(time * 0.00017 + 1.3)),
        },
    ];

    // Displace each node and record how strongly the zones affect it (0..1).
    mesh.nodes.forEach((node) => {
        let intensity = 0;
        let dx = 0;
        let dy = 0;
        zones.forEach((zone) => {
            const ox = node.x - zone.x;
            const oy = node.y - zone.y;
            const distance = Math.hypot(ox, oy) || 1;
            const influence = Math.exp(-(distance * distance) / (2 * sigma * sigma));
            intensity += influence;
            // Push nodes outward from the zone centre, like local deformation.
            dx += (ox / distance) * influence * 7;
            dy += (oy / distance) * influence * 7;
        });
        const wave = Math.sin(node.phase + time * 0.0007) * node.amplitude;
        node.intensity = Math.min(1, intensity);
        node.px = node.x + dx + wave * 0.6;
        node.py = node.y + dy + wave;
    });

    ctx.lineWidth = 1;
    mesh.edges.forEach(([a, b]) => {
        const intensity = (a.intensity + b.intensity) / 2;
        const [r, g, bl] = mix(ELECTRIC, HIGHLIGHT, intensity);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${0.14 + intensity * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.stroke();
    });

    mesh.nodes.forEach((node) => {
        const [r, g, b] = mix(ELECTRIC, HIGHLIGHT, node.intensity);
        if (node.hub) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.12 + node.intensity * 0.25})`;
            ctx.beginPath();
            ctx.arc(node.px, node.py, 7 + node.intensity * 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + node.intensity * 0.7})`;
        ctx.beginPath();
        ctx.arc(node.px, node.py, (node.hub ? 2.6 : 1.3) + node.intensity * 1.6, 0, Math.PI * 2);
        ctx.fill();
    });
}

export default function MeshGraphic({ className = '' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return undefined;

        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        let mesh = null;
        let width = 0;
        let height = 0;
        let frame = 0;
        let visible = true;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            mesh = buildMesh(width, height);
            // A fixed time gives reduced-motion visitors a pleasing still frame.
            if (reduceMotion || !visible) drawFrame(ctx, mesh, width, height, 9000);
        };

        const tick = (time) => {
            drawFrame(ctx, mesh, width, height, time);
            frame = requestAnimationFrame(tick);
        };

        const start = () => {
            if (reduceMotion || frame || !visible || document.hidden) return;
            frame = requestAnimationFrame(tick);
        };
        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        resize();

        // Only animate while the hero is on screen and the tab is visible.
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        visibilityObserver.observe(canvas);
        const onVisibilityChange = () => (document.hidden ? stop() : start());
        document.addEventListener('visibilitychange', onVisibilityChange);

        start();

        return () => {
            stop();
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`block h-full w-full ${className}`}
            style={{
                // Fade the mesh out towards the edges of the frame.
                maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 100%)',
            }}
        />
    );
}
