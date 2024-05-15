import React, { useState, useEffect, useRef } from "react";
import "./CreateCityModal.css";

export default function CreateCityModal({ isOpen, onClose, onCityCreated }) {
  const [cityName, setCityName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
        setSuccessMessage("");
        setErrors({});
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const validateFields = () => {
    const newErrors = {};
    if (!cityName) newErrors.cityName = "City name is required.";
    if (!latitude) {
      newErrors.latitude = "Latitude is required.";
    } else if (latitude < -90 || latitude > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90.";
    }
    if (!longitude) {
      newErrors.longitude = "Longitude is required.";
    } else if (longitude < -180 || longitude > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180.";
    }
    if (!state) newErrors.state = "State is required.";
    if (!country) newErrors.country = "Country is required.";
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cityData = {
      name: cityName,
      lat: latitude,
      long: longitude,
      state,
      country,
    };

    fetch("http://127.0.0.1:8000/cities/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cityData),
    })
      .then((response) => response.json().then(data => ({ status: response.status, body: data })))
      .then(({ status, body }) => {
        if (status === 201) {
          setSuccessMessage(`The city ${cityName} was created successfully.`);
          onCityCreated(body);
          setCityName("");
          setLatitude("");
          setLongitude("");
          setState("");
          setCountry("");
          setErrors({});
        } else if (body.errors) {
          setErrors(body.errors);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrors({ apiError: "An unexpected error occurred." });
      });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {successMessage && <p className="success">{successMessage}</p>}
        <form className="ui form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>City Name</label>
            <input
              type="text"
              name="cityName"
              placeholder="City Name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              required
            />
            {errors.cityName && <p className="error">{errors.cityName}</p>}
          </div>

          <div className="form-field">
            <label>Latitude</label>
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
            {errors.latitude && <p className="error">{errors.latitude}</p>}
          </div>

          <div className="form-field">
            <label>Longitude</label>
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
            {errors.longitude && <p className="error">{errors.longitude}</p>}
          </div>

          <div className="form-field">
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            {errors.state && <p className="error">{errors.state}</p>}
          </div>

          <div className="form-field">
            <label>Country</label>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </div>

          {errors.apiError && <p className="error">{errors.apiError}</p>}

          <button className="ui button" type="submit">
            Create City
          </button>
        </form>
      </div>
    </div>
  );
}
