import React from "react";
import { useSearchParams } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

const FieldOfStudyDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const field = searchParams.get("field");

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-light"
        className="text-gray-700 border-gray-700"
        id="dropdown-basic"
      >
        {field === "it"
          ? "Informatica"
          : field === "electronics"
          ? "Elettronica"
          : field === "chemistry"
          ? "Chimica"
          : "Tutti"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            searchParams.delete("field");
            setSearchParams(searchParams);
          }}
        >
          Tutti
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            searchParams.set("field", "it");
            setSearchParams(searchParams);
          }}
        >
          Informatica
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            searchParams.set("field", "electronics");
            setSearchParams(searchParams);
          }}
        >
          Elettronica
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            searchParams.set("field", "chemistry");
            setSearchParams(searchParams);
          }}
        >
          Chimica
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FieldOfStudyDropdown;
