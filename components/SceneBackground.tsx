"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type BackgroundMode = "particles" | "wave";

function ParticleCloud() {
  const points = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { pointer } = useThree();

  const particles = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!points.current) {
      return;
    }
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, pointer.x, 0.03);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, pointer.y, 0.03);

    points.current.rotation.y = state.clock.elapsedTime * 0.035 + mouse.current.x * 0.08;
    points.current.rotation.x = mouse.current.y * 0.05;
    points.current.position.x = mouse.current.x * 0.18;
    points.current.position.y = mouse.current.y * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#7b66ff"
        size={0.03}
        transparent
        opacity={0.26}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function WaveField() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    }),
    []
  );

  useFrame((state) => {
    if (!mesh.current || !material.current) {
      return;
    }

    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, pointer.x, 0.04);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, pointer.y, 0.04);

    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    mesh.current.rotation.x = -0.98 + mouse.current.y * 0.04;
    mesh.current.rotation.z = mouse.current.x * 0.08;
  });

  return (
    <mesh ref={mesh} position={[0, -1.3, -2]} rotation={[-1, 0, 0]}>
      <planeGeometry args={[18, 18, 120, 120]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          varying float vElevation;

          void main() {
            vec3 pos = position;
            float waveA = sin(pos.x * 0.7 + uTime * 0.45);
            float waveB = cos(pos.y * 0.55 + uTime * 0.35);
            float mouseInfluence = (uMouse.x * pos.x + uMouse.y * pos.y) * 0.1;
            float elevation = (waveA + waveB + mouseInfluence) * 0.22;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying float vElevation;
          void main() {
            float alpha = 0.12 + vElevation * 0.16;
            vec3 base = vec3(0.23, 0.45, 0.95);
            vec3 accent = vec3(0.50, 0.35, 1.0);
            vec3 color = mix(base, accent, smoothstep(-0.2, 0.3, vElevation));
            gl_FragColor = vec4(color, clamp(alpha, 0.08, 0.28));
          }
        `}
      />
    </mesh>
  );
}

type SceneBackgroundProps = {
  mode: BackgroundMode;
  reduceMotion?: boolean;
};

export function SceneBackground({ mode, reduceMotion = false }: SceneBackgroundProps) {
  const [useStaticBackdrop, setUseStaticBackdrop] = useState(reduceMotion);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setUseStaticBackdrop(reduceMotion || query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reduceMotion]);

  if (useStaticBackdrop) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(49,92,236,0.28),transparent_42%),radial-gradient(circle_at_86%_12%,rgba(126,55,204,0.18),transparent_38%)]" />
        <div className="ambient-grid absolute inset-0 opacity-20" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-70" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 65 }}>
        <ambientLight intensity={0.35} />
        {mode === "particles" ? <ParticleCloud /> : <WaveField />}
      </Canvas>
    </div>
  );
}
