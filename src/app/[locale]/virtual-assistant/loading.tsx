import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

export default function Loading() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Skeleton height="3rem" width="300px" className="mb-2" />
        <Skeleton height="1.5rem" width="400px" />
      </div>
      
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Skeleton height="2rem" width="200px" />
          <Skeleton height="2rem" width="200px" />
          <Skeleton height="2rem" width="200px" />
        </div>
      </Card>
      
      <Card>
        <div style={{ height: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton height="4rem" width="100%" />
          <Skeleton height="4rem" width="80%" />
          <Skeleton height="4rem" width="90%" />
          <Skeleton height="4rem" width="70%" />
        </div>
      </Card>
    </div>
  );
}


