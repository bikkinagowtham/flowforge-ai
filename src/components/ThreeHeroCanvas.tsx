import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroCanvasProps {
  activePhase?: 'plan' | 'execute' | 'verify';
  onSelectPhase?: (phase: 'plan' | 'execute' | 'verify') => void;
}

export const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({ activePhase, onSelectPhase }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CSS canvas:', e);
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 3, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Group for nodes and orbits
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // Orbit Ring
    const radius = 3.6;
    const ringGeometry = new THREE.RingGeometry(radius - 0.03, radius + 0.03, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x334155,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    systemGroup.add(ringMesh);

    // Nodes definition: Plan (Cyan), Exec (Blue), Verify (Violet)
    const nodesData = [
      {
        phase: 'plan' as const,
        color: 0x06b6d4,
        angle: 0,
        label: 'Plan',
      },
      {
        phase: 'execute' as const,
        color: 0x3b82f6,
        angle: (2 * Math.PI) / 3,
        label: 'Execute',
      },
      {
        phase: 'verify' as const,
        color: 0xa855f7,
        angle: (4 * Math.PI) / 3,
        label: 'Verify',
      },
    ];

    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; phase: 'plan' | 'execute' | 'verify' }[] = [];

    nodesData.forEach((node) => {
      const x = Math.cos(node.angle) * radius;
      const z = Math.sin(node.angle) * radius;

      // Core sphere
      const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(x, 0, z);

      // Glowing outer halo
      const haloGeo = new THREE.SphereGeometry(0.75, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      sphere.add(halo);

      systemGroup.add(sphere);
      nodeMeshes.push({ mesh: sphere, halo, phase: node.phase });
    });

    // Central core (Nemotron AI Engine)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x76b900, // NVIDIA green
      emissive: 0x76b900,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    systemGroup.add(coreMesh);

    // Particle field
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Flowing energy packets
    const packetCount = 4;
    const packetMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < packetCount; i++) {
      const pGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      systemGroup.add(pMesh);
      packetMeshes.push(pMesh);
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / height) * 2 - 1);
      targetRotationY = mouseX * 0.4;
      targetRotationX = 0.2 - mouseY * 0.2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping rotation
      systemGroup.rotation.y += (targetRotationY - systemGroup.rotation.y) * 0.05 + 0.003;
      systemGroup.rotation.x += (targetRotationX - systemGroup.rotation.x) * 0.05;

      // Pulse core
      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.x = elapsedTime * 0.2;
      const coreScale = 1 + Math.sin(elapsedTime * 2) * 0.05;
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      // Animate node halos & active highlights
      nodeMeshes.forEach((n) => {
        n.halo.rotation.y += 0.01;
        n.halo.rotation.z += 0.01;
        const isActive = activePhase === n.phase;
        const scale = isActive ? 1.4 + Math.sin(elapsedTime * 4) * 0.1 : 1.0;
        n.mesh.scale.set(scale, scale, scale);
      });

      // Move data packets along the ring
      packetMeshes.forEach((p, index) => {
        const offset = (index / packetCount) * Math.PI * 2;
        const packetAngle = elapsedTime * 1.2 + offset;
        p.position.x = Math.cos(packetAngle) * radius;
        p.position.z = Math.sin(packetAngle) * radius;
        p.position.y = Math.sin(elapsedTime * 3 + index) * 0.15;
      });

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.02;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      ringGeometry.dispose();
      ringMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      nodeMeshes.forEach((n) => {
        n.mesh.geometry.dispose();
      });
      packetMeshes.forEach((p) => {
        p.geometry.dispose();
      });
      renderer?.dispose();
    };
  }, [activePhase]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Floating labels overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Orchestration Triad: 3D Live WebGL</span>
      </div>

      <div className="absolute bottom-4 inset-x-4 flex justify-between items-center text-xs text-slate-400 pointer-events-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectPhase?.('plan')}
            className={`pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
              activePhase === 'plan'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-cyan-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Plan
          </button>
          <button
            onClick={() => onSelectPhase?.('execute')}
            className={`pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
              activePhase === 'execute'
                ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-blue-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Execute
          </button>
          <button
            onClick={() => onSelectPhase?.('verify')}
            className={`pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-all ${
              activePhase === 'verify'
                ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-purple-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Verify
          </button>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
          NVIDIA Nemotron • Nebius Token Factory
        </span>
      </div>
    </div>
  );
};
