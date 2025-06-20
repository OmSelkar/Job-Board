import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  const [userToken, setUserToken] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");
      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async (token) => {
    if (!token) return;
    setUserLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setUserData(data.user);
      else setUserData(null);
    } catch (err) {
      setUserData(null);
      toast.error(err.message);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    const ct = localStorage.getItem("companyToken");
    if (ct) setCompanyToken(ct);

    const ut = localStorage.getItem("userToken");
    if (ut) setUserToken(ut);
  }, []);

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: { token: companyToken },
      });
      if (data.success) {
        setCompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Functions to fetch the users applied application data
  const fetchUserApplications = async (token) => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      data.success
        ? setUserApplications(data.applications)
        : toast.error(data.message);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("Unauthorized fetching applications:", err.response.data);
      } else {
        toast.error(err.message);
      }
    }
  };
  useEffect(() => {
    if (companyToken) fetchCompanyData();
  }, [companyToken]);

  useEffect(() => {
    if (userToken) {
      fetchUserData(userToken);
      fetchUserApplications(userToken);
    } else {
      // clear when logged out
      setUserData(null);
      setUserApplications([]);
    }
  }, [userToken]);
  const logoutUser = () => {
    localStorage.removeItem("userToken");
    setUserToken(null);
    setUserData(null);
    toast.success("Logged out successfully");
  };

  const onUserLoggedIn = ({ token, user }) => {
    localStorage.setItem("userToken", token);
    setUserToken(token);
    setUserData(user);
    setShowUserLogin(false);
    toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
  };

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    showUserLogin,
    setShowUserLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    userLoading,
    setUserLoading,
    fetchUserData,
    fetchUserApplications,
    userToken,
    setUserToken,
    logoutUser,
    onUserLoggedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContextProvider, AppContext };
