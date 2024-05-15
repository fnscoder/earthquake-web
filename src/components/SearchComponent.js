import React, { useState, useEffect } from "react";
import CreateCityModal from "./CreateCityModal";
import SearchResult from "./SearchResult";
import "./SearchComponent.css";

export default function SearchComponent() {
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchResult, setSearchResult] = useState(null);
  const cities_url = process.env.REACT_APP_API_URL + "cities/";
  const search_url = process.env.REACT_APP_API_URL + "search?";

  useEffect(() => {
    fetch(cities_url)
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  const validateFields = () => {
    const newErrors = {};

    if (!cityId) newErrors.city = "City is required.";
    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    } 
    if (!endDate) {
      newErrors.endDate = "End date is required.";
    } 
    if (startDate && endDate && startDate >= endDate) {
      newErrors.endDate = "End date must be later than the start date.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const params = new URLSearchParams({
      city: cityId,
      start_date: startDate,
      end_date: endDate,
    });

    fetch(`${search_url}${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResult(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCityCreated = (newCity) => {
    setCities((prevCities) => [...prevCities, newCity]);
  };

  const handleCityChange = (e) => {
    setCityId(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, city: null }));
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, startDate: null }));
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, endDate: null }));
  };

  return (
    <div>
      <div className="form-container">
        <h2>Search Earthquakes</h2>
        <form className="ui form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>City</label>
            <select
              name="city"
              value={cityId}
              onChange={handleCityChange}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <p className="error">{errors.city}</p>}
          </div>

          <div className="form-field">
            <label>Start Date</label>
            <input
              aria-label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
            {errors.startDate && <p className="error">{errors.startDate}</p>}
          </div>

          <div className="form-field">
            <label>End Date</label>
            <input
              aria-label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
            {errors.endDate && <p className="error">{errors.endDate}</p>}
          </div>

          <div className="buttons">
            <button className="ui button" type="submit">
              Search
            </button>
            <button
              type="button"
              className="ui button"
              onClick={() => setModalOpen(true)}
            >
              Add New City
            </button>
          </div>
        </form>
        <CreateCityModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCityCreated={handleCityCreated}
        />
      </div>
      {searchResult && (
        <SearchResult
          city={cities.find((c) => String(c.id) === cityId)}
          result={searchResult}
        />
      )}
    </div>
  );
}
