import { useLogout } from "../hooks/auth";

function HomePage() {
  const { logout } = useLogout();
  const name = localStorage.getItem("name");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
            <circle cx="15" cy="15" r="8" stroke="#1d4ed8" strokeWidth="2" />
            <path
              d="M21 21l6 6"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 11v4M13 13h4"
              stroke="#1d4ed8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-blue-700 font-medium text-lg">Item Finder</span>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-4 py-2 rounded-lg transition-colors">
          Log out
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <circle cx="15" cy="15" r="8" stroke="#1d4ed8" strokeWidth="2" />
            <path
              d="M21 21l6 6"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 11v4M13 13h4"
              stroke="#1d4ed8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          Welcome back, {name}!
        </h1>
        <p className="text-sm text-gray-500 max-w-xs">
          Your homepage is coming soon. Use the navigation to get started.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
