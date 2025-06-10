import Fuse from "fuse.js";

import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    // 1. Fallback: show all jobs if no filters/search applied
    if (
      selectedCategories.length === 0 &&
      selectedLocations.length === 0 &&
      searchFilter.title.trim() === "" &&
      searchFilter.location.trim() === ""
    ) {
      setFilteredJobs([...jobs].reverse());
      setCurrentPage(1);
      return;
    }

    // 2. Setup Fuse for fuzzy search
    const fuse = new Fuse(jobs, {
      keys: ["title", "location", "description"],
      threshold: 0.4, // Looser = more results, tighter = more accurate
      includeScore: true,
    });

    // 3. Combine title + location into one search string
    const searchQuery = `${searchFilter.title} ${searchFilter.location}`.trim();

    // 4. Perform fuzzy search if searchQuery is not empty
    let searchResults = jobs;
    if (searchQuery !== "") {
      const result = fuse.search(searchQuery);
      searchResults = result.map((r) => r.item); // extract actual job objects
    }

    // 5. Apply category and location filters
    const finalFiltered = searchResults
      .filter((job) => {
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(job.category);
        const locationMatch =
          selectedLocations.length === 0 ||
          selectedLocations.includes(job.location);
        return categoryMatch && locationMatch;
      })
      .reverse(); // Optional: show newest first

    // 6. Set state
    setFilteredJobs(finalFiltered);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-6 py-8">
      {/* SideBar */}
      <div className="lg:w-1/4 w-full bg-white px-4">
        {/* Search filter form Hero Component */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">
                Current Search Filter:
              </h3>
              <div className="mb-4 text-gray-600">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-400 px-4 py-1 rounded">
                    {searchFilter.title}
                    <img
                      onClick={(e) =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="inline-flex items-center gap-2.5 bg-red-50 border border-red-400 px-4 py-1 ml-2 rounded">
                    {searchFilter.location}
                    <img
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="lg:hidden px-6 py-1.5 rounded border border-gray-400"
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Category</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li key={index} className="flex gap-3 items-center">
                <label className="flex gap-3 items-center cursor-pointer select-none">
                  <input
                    className="transition duration-200 ease-in-out scale-125"
                    type="checkbox"
                    onChange={() => {
                      handleCategoryChange(category);
                    }}
                    checked={selectedCategories.includes(category)}
                  />
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 pt-14">
            Search by Locations
          </h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li key={index} className="flex gap-3 items-center">
                <label className="flex gap-3 items-center cursor-pointer select-none">
                  <input
                    className="transition duration-200 ease-in-out scale-125"
                    type="checkbox"
                    onChange={() => {
                      handleLocationChange(location);
                    }}
                    checked={selectedLocations.includes(location)}
                  />
                  {location}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Job Listings */}
      <section className="lg:w-3/4 w-full text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest jobs
        </h3>
        <p className="mb-8">Get your desired jobs from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 mt-10">
          {/* Left Arrow */}
          {currentPage > 1 && (
            <a href="#job-list">
              <img
                onClick={() => setCurrentPage(currentPage - 1)}
                src={assets.left_arrow_icon}
                alt="Previous"
              />
            </a>
          )}

          {/* Page Numbers */}
          {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
            (_, index) => (
              <a key={index} href="#job-list">
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-100 text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </button>
              </a>
            )
          )}

          {/* Right Arrow */}
          {currentPage < Math.ceil(filteredJobs.length / 6) && (
            <a href="#job-list">
              <img
                onClick={() => setCurrentPage(currentPage + 1)}
                src={assets.right_arrow_icon}
                alt="Next"
              />
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default JobListing;
