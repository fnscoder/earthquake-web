import React from "react";
import "./SearchResult.css";

const SearchResult = ({ city, result }) => {

  if (!result || !result.earthquake_date) {
    return <div className="result">No results found</div>;
  }

  return (
    <div className="result">
      <p>
        Result for {city && city.name} between {result.start_date} and{" "}
        {result.end_date}: The closest Earthquake to {city && city.name} was a M{" "}
        {result.magnitude} - {result.title} on{" "}
        {result.earthquake_date}
      </p>
    </div>
  );
};

export default SearchResult;
