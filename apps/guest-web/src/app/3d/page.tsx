import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DAZZTEL 3D • Interactive Architectural Model (G+3)',
  description: 'Interactive 3D building massing model, floor-by-floor breakdown, cut-aways, and room schedule for DAZZTEL.',
};

export default function Building3DPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: '#ECEAE5' }}>
      <iframe
        src="/3d.html"
        title="Dazztel 3D Architectural Model"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  );
}
