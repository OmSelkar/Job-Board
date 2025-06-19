import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { userData, logoutUser,setShowRecruiterLogin,setShowUserLogin } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="shadow py-4 bg-white">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer w-[138px] h-[30px]"
          src={assets.logo}
          alt="Logo"
        />

        {userData ? (
          <div className="flex items-center gap-3 relative ">
            <Link to="/applications">Applied Jobs</Link>
            <p>|</p>
            <p className="max-sm:hidden">Hi, {userData.name.split(" ")[0]}</p>
            <div className="relative group">
              <img
                src={userData.image || assets.default_profile}
                className="w-8 h-8 rounded-full cursor-pointer"
                alt="User"
              />
              
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-full pt-12">
                  <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                    <li onClick={logoutUser} className="px-2 py-1 cursor-pointer pr-10">Logout</li>
                  </ul>
                </div>
            </div>
          </div>
        ) : (
          <div className="gap-4 flex max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => setShowUserLogin(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
