import React, { useContext, useEffect, useState } from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const { backendUrl, companyToken } = useContext(AppContext);
 const [loading, setLoading] = useState(true);

  // fetch posted jobs
  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/list-jobs`,
        { headers: { token: companyToken } }
      );
      if (data.success) {
        setJobs(data.jobsData.reverse());
        console.log(data.jobsData)
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // toggle visibility
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobs();
  }, [companyToken]);

  // loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // empty state
  if (!loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl sm:text-2xl">No Jobs Available For Now</p>
      </div>
    );
  }

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left max-sm:hidden">#</th>
              <th className="px-4 py-2 border-b text-left">Job Title</th>
              <th className="px-4 py-2 border-b text-left max-sm:hidden">
                Date
              </th>
              <th className="px-4 py-2 border-b text-left max-sm:hidden">
                Location
              </th>
              <th className="px-4 py-2 border-b text-center">Applicants</th>
              <th className="px-4 py-2 border-b text-left">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr className="text-gray-700" key={index}>
                <td className="px-4 py-2 border-b max-sm:hidden">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border-b">{job.title}</td>
                <td className="px-4 py-2 border-b max-sm:hidden">
                  {moment(job.date).format("ll")}
                </td>
                <td className="px-4 py-2 border-b max-sm:hidden">
                  {job.location}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {job.applicants}
                </td>
                <td className="px-4 py-2 border-b">
                  <input
                    onChange={() => changeJobVisibility(job._id)}
                    className="scale-125 ml-4"
                    type="checkbox"
                    checked={job.visible}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex mt-4 justify-end">
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
