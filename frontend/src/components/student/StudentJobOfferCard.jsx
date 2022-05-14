import { differenceInDays, format, formatDistance } from "date-fns";
import { it } from "date-fns/locale";
import React from "react";

const StudentJobOfferCard = ({ agency, jobOffer }) => {
  return (
    //   FILTER BY FIELD OF STUDY
    <div className="flex w-full items-center">
      {agency.logoUrl && (
        <img
          src={agency.logoUrl}
          alt="Agency logo"
          className="max-h-20 aspect-square mr-3 my-3"
        />
      )}
      <div>
        <h4 className="tracking-tighter text-xl font-semibold">
          {jobOffer.title}
        </h4>
        <p>{agency.agencyName}</p>
        <div className="mt-1-text-gray-600">
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
    </div>
  );
};

export default StudentJobOfferCard;
