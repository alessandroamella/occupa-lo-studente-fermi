import React, { useState } from "react";
import { Search } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setMessage } from "../../slices/alertSlice";

const SearchJobOffers = () => {
  const [jobOfferInput, setJobOfferInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [disabled, setDisabled] = useState(false);

  const dispatch = useDispatch();

  async function searchJobOffer() {
    setDisabled(true);

    try {
      if (jobOfferInput) {
        searchParams.set("q", jobOfferInput);
      } else {
        searchParams.delete("q");
      }
      setSearchParams(searchParams);
    } catch (err) {
      console.log(err?.response?.data?.err || err);
      dispatch(
        setMessage({
          title: "Errore nella ricerca",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
    }

    setDisabled(false);
  }

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Programmatore Node.js"
        onChange={e => setJobOfferInput(e.target.value)}
        autoComplete="agency-name"
        disabled={disabled}
        value={jobOfferInput}
        required
        className="shadow transition-colors hover:border-gray-300 focus:border-gray-700 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        autoFocus
        onKeyDown={e => e.key === "Enter" && searchJobOffer()}
      />

      <button
        disabled={disabled}
        className="ml-3 flex items-center rounded-full p-3 border bg-white disabled:bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        onClick={searchJobOffer}
      >
        <Search />
      </button>
    </div>
  );
};

export default SearchJobOffers;
