import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  const navigate = useNavigate();
  const {
    backendUrl,
    fetchUserData,
    setUserData,
    setShowUserLogin,
    setUserToken,
  } = useContext(AppContext);
  const [state, setState] = useState("Login");
  const [isStepTwo, setIsStepTwo] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === "Sign Up" && !isStepTwo) return setIsStepTwo(true);

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("userToken", data.token);
          setUserToken(data.token);
          setUserData(data.user);
          setShowUserLogin(false); // ✅ Hide login popup
          fetchUserData(); // ✅ Re-fetch user from backend

          toast.success("Login successful");
          navigate("/");
        } else toast.error(data.message);
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        if (image) formData.append("image", image);
        if (resume) formData.append("resume", resume);

        const { data } = await axios.post(
          `${backendUrl}/api/users/register`,
          formData
        );
        if (data.success) {
          localStorage.setItem("userToken", data.token);
          setUserToken(data.token);
          setUserData(data.user);
          setShowUserLogin(false);
          fetchUserData();
          toast.success("Login successful");

          navigate("/");
        } else toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-blue/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white text-slate-500 p-10 rounded-xl"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          User {state}
        </h1>
        <p className="text-sm">Welcome, Please {state} to continue</p>

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
                  type="file"
                  id="image"
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
              <>
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
              </>
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
                onClick={() => {
                  setState("Sign Up");
                  setIsStepTwo(false);
                }}
                className="text-blue-600 cursor-pointer"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setState("Login");
                  setIsStepTwo(false);
                }}
                className="text-blue-600 cursor-pointer"
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
          alt=""
        />
      </form>
    </div>
  );
};

export default UserLogin;
