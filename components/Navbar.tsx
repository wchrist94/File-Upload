import Link from "next/link";

function Navbar() {
  return (
<nav className="bg-white bg-opacity-60 py-1 shadow-lg border-b-2 border-black border-opacity-40 fixed top-0 w-full z-10">      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-black body-font font-merienda">File Depot</span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <Link href="/">
                <p className="block py-2 pl-3 pr-4 text-black">
                  Home
                </p>
              </Link>

            </li>
            <li>
            <Link href="/depot">
                <p className="block py-2 pl-3 pr-4 text-black">
                  Deposit
                </p>
              </Link>
            </li>
            <li>
              <Link href="/search">
                <p className="block py-2 pl-3 pr-4 text-black">
                  Search
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
