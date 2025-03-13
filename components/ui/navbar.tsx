import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">Link Productive</h1>
        <Link
          href="/login"
          className="text-gray-600 px-4 py-2 transition-all duration-300 hover:text-gray-900 hover:underline"
        >
          Logout
        </Link>
      </div>
    </nav>
  );
}
