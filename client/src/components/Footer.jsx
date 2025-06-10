import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto py-3 mt-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Logo + Text */}
        <div className="flex items-center gap-4">
          <img width={160} src={assets.logo} alt="Logo" />
          <p className="text-sm text-gray-500 border-l border-gray-400 pl-4 max-sm:hidden">
            © SaturnMoo | All Rights Reserved.
          </p>
        </div>

        {/* Right Side: Social Icons */}
        <div className="flex gap-3">
          <img width={38} src={assets.facebook_icon} alt="Facebook" />
          <img width={38} src={assets.twitter_icon} alt="Twitter" />
          <img width={38} src={assets.instagram_icon} alt="Instagram" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
