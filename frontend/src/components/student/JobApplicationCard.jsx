import React, { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Placeholder from "react-bootstrap/Placeholder";
import PurpleRightArrow from "../PurpleRightArrow";

const Separator = () => {
  return <div className="hidden md:block mx-2">-</div>;
};

const JobApplicationCard = ({
  jobApplication,
  clickable,
  className,
  setCurrentJobApplication,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`flex m-2 md:m-4 hover:bg-gray-100 transition-all hover:scale-105 ${
        clickable ? "cursor-pointer" : ""
      } rounded-md border p-3 md:py-4 md:px-8 ${className || ""}`}
      onClick={() => clickable && setCurrentJobApplication(jobApplication)}
      {...rest}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="overflow-hidden">
        <h3 className="font-semibold tracking-tight text-xl">
          {jobApplication?.agencyName || (
            <Placeholder xs={6} animation="glow" />
          )}
        </h3>
        {jobApplication?.jobOfferTitle && (
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {jobApplication.jobOfferTitle}
          </p>
        )}

        <div className="mt-2 text-gray-500 flex flex-col items-center md:flex-row justify-start">
          <p>
            Candidatura a{" "}
            <span className="font-medium">
              <Link to={"/student/agency/" + jobApplication?.forAgency}>
                {jobApplication?.agencyName}
              </Link>
            </span>
          </p>
          <Separator />
          {jobApplication?.jobOfferTitle && (
            <>
              <p>
                Per l'offerta di{" "}
                <span className="font-medium">
                  <Link
                    to={
                      "/student/agency/" +
                      jobApplication.forAgency +
                      "?joboffer=" +
                      jobApplication.forJobOffer
                    }
                  >
                    {jobApplication.jobOfferTitle}
                  </Link>
                </span>
              </p>
              <Separator />
            </>
          )}
          <p className="hidden md:block">
            Inviata il{" "}
            <span className="font-medium">
              {format(new Date(jobApplication.createdAt), "dd/MM/yyyy")}
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

export default JobApplicationCard;
