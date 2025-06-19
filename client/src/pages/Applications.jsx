import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets"; // still using dummy data
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const { backendUrl, userData, fetchUserData, userToken, userApplications,fetchUserApplications } =
    useContext(AppContext);

  const updateResume = async () => {
    if (!resume) {
      return toast.error("Please select a resume file first");
    }
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        await fetchUserData();
        toast.success(data.message);
        setIsEdit(false);
        setResume(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(()=>{
    if(userToken){
      fetchUserApplications()
    }
  },[userToken])
  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[64vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>

        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && !userData.resume) ? (
            <>
              <label htmlFor="resumeUpload" className="flex items-center">
                <p className="bg-blue-100 text-blue-600 mr-2 px-4 py-2 rounded-lg">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="upload icon" />
              </label>
              <button
                onClick={updateResume}
                className="bg-green-100 border border-green-500 px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setResume(null);
                }}
                className="text-gray-500 border border-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              {userData?.resume && (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                >
                  View Resume
                </a>
              )}
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

        <table className="min-w-full border rounded-lg bg-white">
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
            {userApplications.map((job, idx) => {
              const company = job.companyId;
              const jobInfo = job.jobId;
              return (
                <tr key={idx}>
                  <td className="flex gap-2 border-b px-4 py-3 items-center">
                    <img
                      className="w-8 h-8"
                      src={company?.image || assets.company_icon}
                      alt={company?.name || "Company"}
                    />
                    {company?.name || "—"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {jobInfo?.title || "—"}
                  </td>
                  <td className="px-4 py-2 border-b max-sm:hidden">
                    {jobInfo?.location || "—"}
                  </td>
                  <td className="px-4 py-2 border-b max-sm:hidden">
                    {job.date ? moment(job.date).format("ll") : "—"}
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
                      {job.status || ""}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
