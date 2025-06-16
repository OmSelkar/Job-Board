import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { userData, setShowRecruiterLogin, setShowUserLogin,logoutUser } =
    useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer"
          src={assets.logo}
          alt=""
        />

        {userData ? (
          <div className="flex items-center gap-3">
            <Link to="/applications">Applied Jobs</Link>
            <p>|</p>
            <p className="max-sm:hidden">Hi, {userData.name}</p>
            <img src={userData.image} className="w-8 h-8 rounded-full" />
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
