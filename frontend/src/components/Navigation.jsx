import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-2xl">📊</span>
            <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              SDM Manager
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium transition-colors pb-2 border-b-2 ${
                isActive('/')
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📈 Dashboard
            </Link>

            <Link
              to="/search"
              className={`font-medium transition-colors pb-2 border-b-2 ${
                isActive('/search')
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              🔍 Pencarian & Index
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
