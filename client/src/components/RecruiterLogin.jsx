import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  // ✅ 1. Form state for login/signup flow
  const [state, setState] = useState("Login"); // "Login" or "Sign Up"
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false); // To track "Next" button in Sign Up
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  // ✅ 2. Form fields
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null); // File object (for logo upload)

  // ✅ 3. Form submission handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // ✅ Step 1 of Sign Up — go to image upload step
    if (state === "Sign Up" && !isTextDataSubmited) {
      return setIsTextDataSubmited(true);
    }

    // connection with backend
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });

        if (data.success) {
          // console.log(data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);
        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData
        );

        if (data.success) {
          // console.log(data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    // ✅ Final submission: either Login or Sign Up with image
    console.log("Form Submitted:", {
      name,
      email,
      password,
      image,
    });

    // ✅ (Optional) Reset form or close modal after submission
  };

  // ✅ Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-blue/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white text-slate-500 p-10 rounded-xl"
      >
        {/* ✅ Header */}
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome, Please {state} to continue</p>

        {/* ✅ Show only image upload if it's the 2nd step of Sign Up */}
        {state === "Sign Up" && isTextDataSubmited ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image" className="cursor-pointer">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Logo Preview"
              />
              <input
                type="file"
                id="image"
                hidden
                onChange={handleImageUpload}
              />
            </label>
            <p>
              Upload Company <br /> Logo
            </p>
          </div>
        ) : (
          <>
            {/* ✅ Show Name input only in Sign Up step 1 */}
            {state === "Sign Up" && (
              <div className="flex border mt-5 px-4 py-2 gap-2 items-center rounded-full">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            {/* ✅ Common Email field */}
            <div className="flex border mt-5 px-4 py-2 gap-2 items-center rounded-full">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
              />
            </div>

            {/* ✅ Common Password field */}
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

        {/* ✅ Forgot password link only in Login */}
        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot Password?
          </p>
        )}

        {/* ✅ Primary Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 w-full mt-5 text-center text-white py-2 rounded-full"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmited
            ? "Create Account"
            : "Next"}
        </button>

        {/* ✅ Toggle between Login and Sign Up */}
        <p className="mt-5 text-center">
          {state === "Login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setState("Sign Up");
                  setIsTextDataSubmited(false); // reset step
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
                  setIsTextDataSubmited(false); // reset step
                }}
              >
                Login
              </span>
            </>
          )}
        </p>
        <img
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
