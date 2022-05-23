import { differenceInDays, formatDistance } from "date-fns";
import { it } from "date-fns/locale";
import React, { useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import PurpleRightArrow from "../PurpleRightArrow";

const StudentJobOfferCard = ({ agency, jobOffer, active, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    //   FILTER BY FIELD OF STUDY
    <div
      className={`flex pl-4 py-8 w-full items-center bg-white transition-all hover:bg-gray-100 cursor-pointer ${
        active ? "bg-gray-100" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...rest}
    >
      {agency?.logoUrl && (
        <img
          src={agency?.logoUrl}
          alt="Agency logo"
          className="max-h-24 aspect-square mr-4 object-cover"
          loading="lazy"
        />
      )}
      <div>
        <h4 className="text-xl font-semibold">{jobOffer.title}</h4>
        <p>{agency?.agencyName || <Placeholder xs={8} animation="glow" />}</p>
        <div className="mt-1 text-gray-600">
          <p>
            {jobOffer.fieldOfStudy === "it"
              ? "Informatica"
              : jobOffer.fieldOfStudy === "electronics"
              ? "Elettronica"
              : jobOffer.fieldOfStudy === "chemistry"
              ? "Chimica"
              : "Altro"}
          </p>
          <p
            className={`text-sm ${
              differenceInDays(new Date(), new Date(jobOffer.createdAt)) < 3
                ? "font-semibold"
                : ""
            }`}
          >
            {formatDistance(new Date(jobOffer.createdAt), new Date(), {
              addSuffix: true,
              locale: it
            })}
          </p>
        </div>
      </div>
      <div className="ml-auto mr-3">
        <PurpleRightArrow
          active={active}
          isFocused={isFocused}
          isHovered={isHovered}
        />
      </div>
    </div>
  );
};

export default StudentJobOfferCard;
