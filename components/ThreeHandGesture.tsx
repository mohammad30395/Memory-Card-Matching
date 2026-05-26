"use client";

import { useEffect, useRef } from "react";

export default function ThreeHandGesture() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let observer: ResizeObserver | null = null;
    let disposed = false;

    async function start() {
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
      animate();
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

  return <div ref={mountRef} className="h-[280px] w-full sm:h-[360px]" aria-label="Animated 3D hand gesture" />;
}
