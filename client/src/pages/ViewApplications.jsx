import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyJobApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });
      if (res.data.success) {
        setApplicants(res.data.applications.reverse());
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );
      if (data.success) fetchCompanyJobApplications();
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobApplications();
  }, [backendUrl, companyToken]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && applicants.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-500">
        No applications found yet.
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <table className="w-full max-w-4xl border-collapse border border-gray-200 bg-white max-sm:text-sm">
        <thead className="bg-gray-100">
          <tr className="border-b">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">User Name</th>
            <th className="px-4 py-2 text-left max-sm:hidden">Job Title</th>
            <th className="px-4 py-2 text-left max-sm:hidden">Location</th>
            <th className="px-4 py-2 text-left">Resume</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((app, idx) => (
            <tr
              key={app._id || idx}
              className={
                idx % 2 === 0 ? "text-gray-700" : "bg-gray-50 text-gray-700 "
              }
            >
              <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
              <td className="px-4 py-2 border-t items-center flex">
                <img
                  src={app.userId.image}
                  alt=""
                  className="w-8 h-8 rounded-full mr-3 max-sm:hidden"
                />
                {app.userId.name}
              </td>
              <td className="px-4 py-2 border-b max-sm:hidden">
                {app.jobId.title}
              </td>
              <td className="px-4 py-2 border-b  max-sm:hidden">
                {app.jobId.location}
              </td>
              <td className="px-4 py-2 border-b ">
                <a
                  href={app.userId.resume}
                  target="_blank"
                  rel="noreferrer"
                  className=" bg-blue-50 text-blue-400 py-1 px-3 rounded inline-flex gap-2 items-center "
                >
                  View Resume
                </a>
              </td>
              <td className="px-2 py-4 border-b relative">
                {app.status === "Pending" ? (
                  <div className="group inline-block relative text-left">
                    <button className="action-button text-gray-500">⋯</button>
                    <div className="absolute hidden group-hover:block md:left-0 bg-white border border-gray-200 shadow rounded mt-2 right-0 top-0 w-32 z-10">
                      <button
                        onClick={() =>
                          changeJobApplicationStatus(app._id, "Accepted")
                        }
                        className="block w-full px-4 py-2 text-left text-green-500 hover:bg-gray-100"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          changeJobApplicationStatus(app._id, "Rejected")
                        }
                        className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`font-semibold ${
                      app.status === "Accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {app.status}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplications;
