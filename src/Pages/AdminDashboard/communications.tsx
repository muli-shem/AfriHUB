import  { useEffect, useState } from 'react';

const Communications = () => {
  interface Communication {
    id: number;
    message: string;
  }

  const [communications, setCommunications] = useState<Communication[]>([]);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/communications');
        const data = await response.json();
        setCommunications(data);
      } catch (error) {
        console.error('Error fetching communications:', error);
      }
    };

    fetchCommunications();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Communications</h1>
      <ul>
        {communications.map((comm) => (
          <li key={comm.id} className="p-2 border-b">{comm.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Communications;
