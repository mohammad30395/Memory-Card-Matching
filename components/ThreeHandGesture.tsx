"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

export default function ThreeHandGesture() {
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
        camera.position.set(0, 0.2, 7);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.className = "absolute inset-0 size-full";
        mount.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const palmMaterial = new THREE.MeshStandardMaterial({
          color: 0x67e8f9,
          metalness: 0.14,
          roughness: 0.32,
        });
        const accentMaterial = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          metalness: 0.08,
          roughness: 0.4,
        });

        const palm = new THREE.Mesh(new THREE.SphereGeometry(1.05, 32, 32), palmMaterial);
        palm.scale.set(0.96, 1.18, 0.34);
        palm.position.y = -0.4;
        group.add(palm);

        const fingerGeometry = new THREE.CapsuleGeometry(0.18, 1.25, 8, 16);
        [-0.56, -0.18, 0.2, 0.58].forEach((x, index) => {
          const finger = new THREE.Mesh(fingerGeometry, palmMaterial);
          finger.position.set(x, 0.72 + Math.sin(index) * 0.08, 0.03);
          finger.rotation.z = (index - 1.5) * 0.08;
          finger.scale.y = index === 1 || index === 2 ? 1.1 : 0.94;
          group.add(finger);
        });

        const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 1.05, 8, 16), accentMaterial);
        thumb.position.set(-0.96, -0.08, 0.02);
        thumb.rotation.z = 0.88;
        group.add(thumb);

        const wrist = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 1.0, 8, 16), accentMaterial);
        wrist.position.set(0, -1.62, -0.02);
        wrist.rotation.x = Math.PI / 2;
        group.add(wrist);

        const glow = new THREE.PointLight(0x67e8f9, 32, 7);
        glow.position.set(0, 1.8, 2.5);
        scene.add(glow);
        scene.add(new THREE.AmbientLight(0xffffff, 1.45));

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
          group.rotation.y = Math.sin(time * 0.7) * 0.38;
          group.rotation.x = Math.sin(time * 0.45) * 0.12 - 0.08;
          group.position.y = Math.sin(time * 1.1) * 0.08;
          renderer?.render(scene, camera);
        };

        resize();
        observer = new ResizeObserver(resize);
        observer.observe(mount);
        setIsReady(true);
        animate();
      } catch {
        if (!disposed) {
          setHasError(true);
        }
      }
    }

    start();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-[300px] w-full overflow-hidden rounded-3xl sm:h-[420px]"
      aria-label="Animated hand gesture visualization"
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
        <div className="relative grid size-44 place-items-center rounded-[2rem] border border-white/18 bg-slate-950/72 text-7xl shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:size-56 sm:text-8xl">
          <span className="absolute inset-4 rounded-[1.5rem] border border-cyan-200/18" />
          <span className="animate-pulse">✋</span>
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
