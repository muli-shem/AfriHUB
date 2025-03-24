import  { useEffect, useState } from 'react';

const Reports = () => {
  interface Report {
    id: number;
    title: string;
  }

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Reports</h1>
      <ul>
        {reports.map((report) => (
          <li key={report.id} className="p-2 border-b">{report.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
