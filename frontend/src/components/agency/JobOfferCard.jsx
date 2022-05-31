import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PurpleRightArrow from "../PurpleRightArrow";
import TextEditor from "../textEditor";

const Separator = () => {
  return <div className="hidden md:block mx-2">-</div>;
};

const JobOfferCard = ({ jobOffer, clickable, className, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();

  function getPlural() {
    return Number.isInteger(jobOffer?.numberOfPositions) &&
      jobOffer.numberOfPositions === 1
      ? "e"
      : "i";
  }

  return (
    <div
      className={`flex m-2 md:m-4 hover:bg-gray-100 transition-all hover:scale-105 ${
        clickable ? "cursor-pointer" : ""
      } rounded-md border p-3 md:py-4 md:px-8 ${className || ""}`}
      onClick={() =>
        clickable && navigate("/agency/joboffer?id=" + jobOffer._id)
      }
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
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {jobOffer.description && (
            <TextEditor readOnly short content={jobOffer.description} />
          )}
        </div>

        <div className="mt-2 text-gray-500 flex flex-col items-center md:flex-row justify-start">
          <p>
            <span className="font-medium">{jobOffer?.numberOfPositions}</span>{" "}
            posizion{getPlural()} disponibil{getPlural()}
          </p>
          <Separator />
          <p className="hidden md:block mx-2">
            Diploma {jobOffer?.mustHaveDiploma ? "" : "non"} richiesto
          </p>
          <Separator />
          <p className="hidden md:block mx-2">
            {jobOffer.fieldOfStudy && jobOffer.fieldOfStudy !== "any" ? (
              <span>
                Indirizzo di{" "}
                <span className="font-medium">
                  {jobOffer?.fieldOfStudy === "it"
                    ? "informatica"
                    : jobOffer.fieldOfStudy === "electronics"
                    ? "elettronica"
                    : "chimica"}
                </span>
              </span>
            ) : (
              <span>Qualunque indirizzo</span>
            )}
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
      {clickable && (
        <PurpleRightArrow isFocused={isFocused} isHovered={isHovered} />
      )}
    </div>
  );
};

export default JobOfferCard;
