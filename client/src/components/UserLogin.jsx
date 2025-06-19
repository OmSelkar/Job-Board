// src/components/UserLogin.jsx
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser';

const UserLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, onUserLoggedIn, setShowUserLogin } =
    useContext(AppContext);

  const [state, setState] = useState("Login"); // "Login" or "Sign Up"
  const [isStepTwo, setIsStepTwo] = useState(false); // second step of sign‑up

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);

  const handleImageUpload = (e) =>
    e.target.files[0] && setImage(e.target.files[0]);
  const handleResumeUpload = (e) =>
    e.target.files[0] && setResume(e.target.files[0]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // step‑1 of sign up just advances the form
    if (state === "Sign Up" && !isStepTwo) {
      return setIsStepTwo(true);
    }

    try {
      let resp;
      if (state === "Login") {
        resp = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);
        if (resume) formData.append("resume", resume);
        resp = await axios.post(`${backendUrl}/api/auth/register`, formData);
      }

      const { data } = resp;
      if (data.success) {
        // centralised in AppContext
        onUserLoggedIn({ token: data.token, user: data.user });
        // ✅ Send welcome email from frontend
  await emailjs.send(
    'service_ygxiqjk', // e.g. 'service_xxxxxx'
    'template_6mcma5b',
    {
      user_name: data.user.name,
      user_email: data.user.email,
      registration_date: new Date().toLocaleDateString(),
    },
    'VIHnUNFHSgZGZ23OS' // Your EmailJS public key
  );
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-blue/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white text-slate-500 p-10 rounded-xl"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          User {state}
        </h1>
        <p className="text-sm">Welcome, please {state} to continue</p>

        {state === "Sign Up" && isStepTwo ? (
          <>
            <div className="flex items-center gap-4 my-6">
              <label htmlFor="image" className="cursor-pointer">
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="Profile Preview"
                />
                <input
                  id="image"
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
              <p>Upload Profile Image (optional)</p>
            </div>
            <div className="my-6">
              <label className="block text-sm mb-2">Upload Resume</label>
              <input
                type="file"
                onChange={handleResumeUpload}
                className="text-sm"
                required
              />
            </div>
          </>
        ) : (
          <>
            {state === "Sign Up" && (
              <div className="flex border mt-5 px-4 py-2 gap-2 items-center rounded-full">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="flex border mt-5 px-4 py-2 gap-2 items-center rounded-full">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex border mt-5 px-4 py-2 gap-2 items-center rounded-full">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 w-full mt-5 text-white py-2 rounded-full"
        >
          {state === "Login" ? "Login" : isStepTwo ? "Create Account" : "Next"}
        </button>

        <p className="mt-5 text-center">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setState("Sign Up");
                  setIsStepTwo(false);
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setState("Login");
                  setIsStepTwo(false);
                }}
              >
                Login
              </span>
            </>
          )}
        </p>

        <img
          onClick={() => setShowUserLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="Close"
        />
      </form>
    </div>
  );
};

export default UserLogin;
