import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { MathUtils } from 'three'
function Core({ pointer, active }) {
  const group = useRef()
  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.2 + 0.35, 5, delta)
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, pointer.current.x * 0.25 + 0.45, 5, delta)
  })
  return <group ref={group}><RoundedBox args={[1.15, 0.2, 1.15]} radius={0.08}><meshStandardMaterial color="#17273b" metalness={0.8} roughness={0.25} /></RoundedBox><RoundedBox position={[0, 0.15, 0]} args={[0.7, 0.11, 0.7]} radius={0.04}><meshStandardMaterial color={active % 2 ? '#aa91ff' : '#55dff5'} emissive={active % 2 ? '#6541a8' : '#13627c'} emissiveIntensity={0.7} metalness={0.6} roughness={0.2} /></RoundedBox>{Array.from({ length: 6 }, (_, i) => [-1, 1].map(side => <mesh key={`${i}-${side}`} position={[side * 0.69, -0.02, (i - 2.5) * 0.17]}><boxGeometry args={[0.23, 0.06, 0.045]} /><meshStandardMaterial color="#88adbe" metalness={0.9} roughness={0.3} /></mesh>))}</group>
}
export default function OutputScene({ pointer, active }) {
  return <Canvas camera={{ position: [0, 2.5, 3.8], fov: 33 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}><ambientLight intensity={1.3} /><pointLight position={[2, 4, 3]} intensity={16} color="#55dff5" /><pointLight position={[-3, 2, -1]} intensity={12} color="#aa91ff" /><Core pointer={pointer} active={active} /></Canvas>
}
