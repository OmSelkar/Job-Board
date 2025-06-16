import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useUser } from "@clerk/clerk-react";
const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const {user} = useUser()
  const {getToken} = useAuth()
  const [resume, setResume] = useState(null);
  const { backendUrl, userData, userApplications, fetchUserData } =
    useContext(AppContext);
    const updateResume = async()=>{
      
    }
  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[64vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 mr-2 px-4 py-2 rounded-lg">
                  Select Resume
                </p>

                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="" />
              </label>
              <button
                onClick={() => setIsEdit(false)}
                className="bg-green-100 border border-green-500 px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                href=""
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 px-4 py-2 rounded-lg"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Applied Jobs</h2>
        <table className=" min-w-full border rounded-lg bg-white">
          <thead>
            <tr>
              <th className="px-4 py-3 border-b text-left">Company</th>
              <th className="px-4 py-3 border-b text-left">Job Title</th>
              <th className="px-4 py-3 border-b text-left max-sm:hidden">
                Location
              </th>
              <th className="px-4 py-3 border-b text-left max-sm:hidden">
                Date
              </th>
              <th className="px-4 py-3 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobsApplied.map((job, index) =>
              true ? (
                <tr>
                  <td className="flex gap-2 border-b px-4 py-3 text-center">
                    <img className="w-8 h-8" src={assets.company_icon} alt="" />
                    {job.company}{" "}
                  </td>
                  <td className="px-4 py-2 border-b">{job.title} </td>
                  <td className="px-4 py-2 border-b max-sm:hidden">
                    {job.location}{" "}
                  </td>
                  <td className="px-4 py-2 border-b max-sm:hidden">
                    {moment(job.date).format("ll")}{" "}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-4 py-1.5 rounded-lg ${
                        job.status === "Accepted"
                          ? "bg-green-100"
                          : job.status === "Rejected"
                          ? "bg-red-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {job.status}
                    </span>{" "}
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
