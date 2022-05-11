import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import RequireAgencyLogin from "./RequireAgencyLogin";
import { useSelector } from "react-redux";

const selectAgency = state => state.agency;

const AgencyDashboard = () => {
  const { agency } = useSelector(selectAgency);

  return (
    <RequireAgencyLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div>
          <p>
            Sono la <span className="font-semibold">agency dashboard!!</span>
          </p>
        </div>

        <div className="rounded border w-full">
          {agency?.bannerUrl && (
            <img
              src={agency.bannerUrl}
              alt="Agency banner"
              className="w-full max-h-40 object-cover"
            />
          )}

          <div className="p-3">
            <h1 className="font-semibold tracking-tighter text-3xl">
              {agency?.agencyName}
            </h1>
            <p>{agency?.agencyDescription}</p>

            <div className="mt-3">
              <div class="mapouter">
                <div className="gmap_canvas">
                  <iframe
                    title="Agency position"
                    width="600"
                    height="500"
                    src="https://maps.google.com/maps?q=viale%20udine%2022%20sassuolo&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  ></iframe>
                </div>
              </div>

              <p className="text-gray-700">{agency.agencyAddress}</p>
            </div>
          </div>
        </div>

        <div>
          La tua azienda:{" "}
          <pre>
            <code>{JSON.stringify(agency, null, 4)}</code>
          </pre>
        </div>
        <Outlet />
      </Container>
    </RequireAgencyLogin>
  );
};

export default AgencyDashboard;
