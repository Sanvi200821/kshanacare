function DNA3DBackground() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 45,
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={1.2} />

      <pointLight
        position={[4, 4, 5]}
        intensity={3}
      />

      <DNAHelix />

      <Sparkles
        count={120}
        scale={[12, 8, 8]}
        size={2}
        speed={0.25}
      />
    </Canvas>
  );
}