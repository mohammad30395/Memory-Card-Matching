"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

type TextureKind = "back" | "gem";

function drawRoundedRect(context: CanvasRenderingContext2D, size: number) {
  const radius = 48;
  const inset = 12;

  context.beginPath();
  context.moveTo(inset + radius, inset);
  context.lineTo(size - inset - radius, inset);
  context.quadraticCurveTo(size - inset, inset, size - inset, inset + radius);
  context.lineTo(size - inset, size - inset - radius);
  context.quadraticCurveTo(size - inset, size - inset, size - inset - radius, size - inset);
  context.lineTo(inset + radius, size - inset);
  context.quadraticCurveTo(inset, size - inset, inset, size - inset - radius);
  context.lineTo(inset, inset + radius);
  context.quadraticCurveTo(inset, inset, inset + radius, inset);
  context.closePath();
}

export default function ThreeMemoryCards() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let frameId = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let observer: ResizeObserver | null = null;
    let disposed = false;

    async function start() {
      try {
        const THREE = await import("three");
        const mount = mountRef.current;
        if (!mount || disposed) {
          return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0.15, 7.3);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.className = "absolute inset-0 size-full";
        mount.appendChild(renderer.domElement);

        const board = new THREE.Group();
        board.rotation.x = -0.18;
        scene.add(board);

        const cardGeometry = new THREE.BoxGeometry(1.02, 1.34, 0.09);
        const faceGeometry = new THREE.PlaneGeometry(0.9, 1.2);
        const geometries: import("three").BufferGeometry[] = [cardGeometry, faceGeometry];
        const edgeMaterial = new THREE.MeshStandardMaterial({
          color: 0x172033,
          metalness: 0.2,
          roughness: 0.42,
        });
        const materials: import("three").Material[] = [edgeMaterial];
        const textures: import("three").Texture[] = [];

        const createTexture = (kind: TextureKind, accent: string) => {
          const size = 512;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Canvas unavailable");
          }

          drawRoundedRect(context, size);
          if (kind === "back") {
            const gradient = context.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, "#22d3ee");
            gradient.addColorStop(0.48, accent);
            gradient.addColorStop(1, "#4338ca");
            context.fillStyle = gradient;
            context.fill();

            context.strokeStyle = "rgba(255,255,255,0.58)";
            context.lineWidth = 12;
            context.stroke();

            context.fillStyle = "rgba(7,12,24,0.72)";
            context.font = "900 210px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText("?", size / 2, size / 2 + 12);

            context.strokeStyle = "rgba(255,255,255,0.42)";
            context.lineWidth = 7;
            for (let i = 0; i < 4; i += 1) {
              const x = 120 + i * 92;
              context.beginPath();
              context.moveTo(x, 92);
              context.lineTo(x + 18, 128);
              context.lineTo(x + 56, 136);
              context.lineTo(x + 25, 158);
              context.lineTo(x + 32, 197);
              context.lineTo(x, 178);
              context.lineTo(x - 32, 197);
              context.lineTo(x - 25, 158);
              context.lineTo(x - 56, 136);
              context.lineTo(x - 18, 128);
              context.closePath();
              context.stroke();
            }
          } else {
            context.fillStyle = "#f8fafc";
            context.fill();
            context.strokeStyle = "rgba(15,23,42,0.24)";
            context.lineWidth = 11;
            context.stroke();

            context.strokeStyle = accent;
            context.lineWidth = 20;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.beginPath();
            context.moveTo(size / 2, 128);
            context.lineTo(356, size / 2);
            context.lineTo(size / 2, 384);
            context.lineTo(156, size / 2);
            context.closePath();
            context.stroke();
            context.fillStyle = "rgba(34,211,238,0.2)";
            context.fill();

            context.fillStyle = "#0f172a";
            context.font = "900 54px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText("MATCH", size / 2, 426);
          }

          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = 8;
          textures.push(texture);
          return texture;
        };

        const backMaterial = new THREE.MeshStandardMaterial({
          map: createTexture("back", "#a855f7"),
          roughness: 0.5,
          metalness: 0.04,
        });
        const gemMaterial = new THREE.MeshStandardMaterial({
          map: createTexture("gem", "#06b6d4"),
          roughness: 0.44,
          metalness: 0.02,
        });
        materials.push(backMaterial, gemMaterial);

        const makeCard = (
          x: number,
          y: number,
          rotationZ: number,
          faceMaterial: import("three").MeshStandardMaterial,
          faceUp: boolean,
        ) => {
          const card = new THREE.Group();
          card.position.set(x, y, faceUp ? 0.28 : 0);
          card.rotation.z = rotationZ;

          const body = new THREE.Mesh(cardGeometry, edgeMaterial);
          card.add(body);

          const face = new THREE.Mesh(faceGeometry, faceMaterial);
          face.position.z = 0.052;
          card.add(face);

          board.add(card);
          return card;
        };

        const cards = [
          makeCard(-1.15, 0.88, -0.18, backMaterial, false),
          makeCard(0, 0.92, 0.05, backMaterial, false),
          makeCard(1.14, 0.84, 0.18, backMaterial, false),
          makeCard(-1.18, -0.7, 0.16, gemMaterial, true),
          makeCard(0, -0.64, -0.06, gemMaterial, true),
          makeCard(1.18, -0.72, -0.15, backMaterial, false),
        ];
        const cardBaseDepths = cards.map((card) => card.position.z);

        const badge = new THREE.Group();
        badge.position.set(0, -0.02, 0.82);
        board.add(badge);

        const ringGeometry = new THREE.TorusGeometry(0.54, 0.035, 12, 60);
        geometries.push(ringGeometry);
        const ring = new THREE.Mesh(
          ringGeometry,
          new THREE.MeshStandardMaterial({
            color: 0x34d399,
            emissive: 0x0f766e,
            emissiveIntensity: 0.45,
            roughness: 0.35,
          }),
        );
        badge.add(ring);

        const checkMaterial = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0x92400e,
          emissiveIntensity: 0.38,
          roughness: 0.28,
        });
        materials.push(ring.material, checkMaterial);

        const shortCheckGeometry = new THREE.CapsuleGeometry(0.055, 0.38, 8, 16);
        const longCheckGeometry = new THREE.CapsuleGeometry(0.055, 0.68, 8, 16);
        geometries.push(shortCheckGeometry, longCheckGeometry);

        const checkA = new THREE.Mesh(shortCheckGeometry, checkMaterial);
        checkA.position.set(-0.14, -0.02, 0.01);
        checkA.rotation.z = -0.72;
        badge.add(checkA);

        const checkB = new THREE.Mesh(longCheckGeometry, checkMaterial);
        checkB.position.set(0.15, 0.09, 0.01);
        checkB.rotation.z = 0.82;
        badge.add(checkB);

        const glow = new THREE.PointLight(0x67e8f9, 28, 7);
        glow.position.set(-1.8, 2.3, 3.4);
        scene.add(glow);
        const warmGlow = new THREE.PointLight(0xfbbf24, 15, 6);
        warmGlow.position.set(2.2, -1.3, 2.8);
        scene.add(warmGlow);
        scene.add(new THREE.AmbientLight(0xffffff, 1.35));

        const resize = () => {
          if (!renderer || !mountRef.current) {
            return;
          }

          const width = Math.max(260, mountRef.current.clientWidth);
          const height = Math.max(260, mountRef.current.clientHeight);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        };

        const animate = () => {
          frameId = window.requestAnimationFrame(animate);
          const time = window.performance.now() / 1000;
          board.rotation.y = Math.sin(time * 0.56) * 0.28;
          board.rotation.x = -0.18 + Math.sin(time * 0.42) * 0.08;
          board.position.y = Math.sin(time * 0.95) * 0.08;
          badge.rotation.z = Math.sin(time * 1.2) * 0.08;
          cards.forEach((card, index) => {
            card.position.z = cardBaseDepths[index] + Math.sin(time * 1.4 + index) * 0.028;
          });
          renderer?.render(scene, camera);
        };

        resize();
        observer = new ResizeObserver(resize);
        observer.observe(mount);
        setIsReady(true);
        animate();

        return () => {
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          textures.forEach((texture) => texture.dispose());
        };
      } catch {
        if (!disposed) {
          setHasError(true);
        }
      }
    }

    let disposeScene: (() => void) | undefined;
    start().then((dispose) => {
      disposeScene = dispose;
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      disposeScene?.();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-[300px] w-full overflow-hidden rounded-3xl sm:h-[420px]"
      aria-label="Animated memory card match visualization"
    >
      <div
        className={clsx(
          "absolute inset-0 grid place-items-center transition duration-500",
          isReady && !hasError ? "opacity-35" : "opacity-100",
        )}
      >
        <div className="absolute inset-8 rounded-full border border-cyan-200/18 bg-[radial-gradient(circle,rgba(103,232,249,0.2)_0%,rgba(251,191,36,0.12)_34%,transparent_66%)]" />
        <div className="absolute left-[12%] top-[16%] h-28 w-20 rotate-[-14deg] rounded-2xl border border-white/18 bg-white/10 shadow-2xl shadow-cyan-950/30" />
        <div className="absolute right-[16%] top-[20%] h-32 w-24 rotate-[16deg] rounded-2xl border border-cyan-200/25 bg-cyan-300/16 shadow-2xl shadow-cyan-950/30" />
        <div className="absolute bottom-[12%] left-[28%] h-28 w-20 rotate-[8deg] rounded-2xl border border-amber-200/22 bg-amber-200/14 shadow-2xl shadow-black/25" />
        <div className="relative grid size-44 place-items-center rounded-[2rem] border border-white/18 bg-slate-950/72 text-5xl font-black text-cyan-100 shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:size-56 sm:text-6xl">
          <span className="absolute inset-4 rounded-[1.5rem] border border-cyan-200/18" />
          <span className="animate-pulse">?</span>
        </div>
      </div>

      {hasError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/12 bg-slate-950/70 px-4 py-2 text-xs font-bold text-cyan-100 backdrop-blur">
          3D preview unavailable
        </div>
      )}
    </div>
  );
}
