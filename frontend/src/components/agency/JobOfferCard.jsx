import React, { useState } from "react";
import { format } from "date-fns";
import { ArrowRight } from "react-bootstrap-icons";

const Separator = () => {
  return <div className="hidden md:block mx-2">-</div>;
};

const JobOfferCard = ({ jobOffer, className, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`flex m-2 md:m-4 hover:bg-gray-100 transition-all hover:scale-105 cursor-pointer rounded-md border p-3 md:py-4 md:px-8 ${
        className || ""
      }`}
      {...rest}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="overflow-hidden">
        <h3 className="font-semibold tracking-tight text-xl">
          {jobOffer.title}
        </h3>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {jobOffer.description}
        </p>

        <div className="mt-2 text-gray-500 flex flex-col items-center md:flex-row justify-start">
          <p>
            <span className="font-medium">{jobOffer?.numberOfPositions}</span>{" "}
            posizioni disponibili
          </p>
          <Separator />
          <p className="hidden md:block mx-2">
            Diploma {jobOffer?.mustHaveDiploma ? "" : "non"} richiesto
          </p>
          <Separator />
          <p className="hidden md:block mx-2">
            Indirizzo di{" "}
            <span className="font-medium">
              {jobOffer?.fieldOfStudy === "it"
                ? "informatica"
                : jobOffer.fieldOfStudy === "electronics"
                ? "elettronica"
                : "chimica"}
            </span>
          </p>
          <Separator />
          <p className="hidden md:block mx-2">
            Scade il{" "}
            <span className="font-medium">
              {jobOffer?.expiryDate &&
                format(new Date(jobOffer.expiryDate), "dd/MM/yyyy")}
            </span>
          </p>
        </div>
      </div>
      <div className="float-right flex text-4xl items-center ml-4">
        <ArrowRight
          className={`p-2 rounded-full transition-all ${
            isHovered || isFocused ? "bg-purple-500 text-white" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default JobOfferCard;
