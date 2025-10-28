import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 p-8">
      <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200"
      >
        Go Back Home
      </Link>
    </div>
  )
}

export default NotFound
