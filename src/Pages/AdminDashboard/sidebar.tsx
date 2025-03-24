
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      <nav className="space-y-4">
        <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700">Home</Link>
        <Link to="/leaders" className="block py-2 px-4 rounded hover:bg-gray-700">Leaders</Link>
        <Link to="/projects" className="block py-2 px-4 rounded hover:bg-gray-700">Projects</Link>
        <Link to="/communications" className="block py-2 px-4 rounded hover:bg-gray-700">Communications</Link>
        <Link to="/reports" className="block py-2 px-4 rounded hover:bg-gray-700">Reports</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
