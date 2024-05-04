import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function Navbar() {
  let navigate = useNavigate();


  return (
    <>
      <nav className="bg-body-tertiary bg-blue-900">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between py-4">
            <div>
              <Link to="#" className="text-lg font-bold text-white">
                DealsDray
              </Link>
            </div>
            <button
              className="block lg:hidden focus:outline-none"
              onClick={() => alert("Toggle mobile menu")}
            >
              <svg
                className="w-6 h-6 fill-current text-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zM3 11a1 1 0 100 2h16a1 1 0 100-2H3zm0 6a1 1 0 110-2h16a1 1 0 110 2H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <Link
                to="/"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/createemployees"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Create Employee
              </Link>
              <Link
                to="/employees"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Employee List
              </Link>
            </div>
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <span className="text-white">
                { sessionStorage.getItem("userName") || "Guest"}
              </span>
              <button
                className="text-white hover:text-gray-300 transition duration-300"
                onClick={() => navigate("/login")}
              >
                 {sessionStorage.getItem("userName") == null ? "Login" : "Logout"}
                 {console.log('session',sessionStorage.getItem("userName"))}

              </button>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
