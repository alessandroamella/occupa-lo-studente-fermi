import MarkdownIt from "markdown-it";

import { AgencyDoc } from "@models";

const md = new MarkdownIt({
    linkify: true,
    typographer: true
});

export function secretaryNewAgency(agency: AgencyDoc) {
    return `<!DOCTYPE html>
  <html lang="it">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Occupa lo studente email</title>
    </head>
    <body
      style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
          'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
          'Helvetica Neue', sans-serif;
        padding: 0;
        margin: 0;
      "
    >
      <header
        style="
          width: 100%;
          background-color: rgb(41, 42, 42);
          display: flex
        "
      >
        <img
          loading="lazy"
          src="https://ssh.edu.it/images/logos/fermi.png"
          alt="Occupa lo studente logo"
          style="max-width: 3rem; object-fit: contain; margin-right: 0.2rem; margin-left: auto"
        />
        <p
          style="
            font-size: 2rem;
            font-weight: 300;
            color: white;
            margin-left: 0.2rem;
            margin-right: auto
          "
        >
          Occupa lo studente
        </p>
      </header>
  
      <div
        class="container"
        style="
          padding-bottom: 2rem;
          padding: 1rem;
          padding-right: 3rem;
          padding-left: 3rem;
        "
      >
        <h1 style="font-weight: 500; margin-bottom: 0">
          Nuova richiesta di approvazione da
          <strong>"${agency.agencyName}"</strong>
        </h1>
  
        <section>
          <h3 style="font-weight: 300; margin-bottom: 0.3rem">Descrizione</h3>
          <p style="margin-top: 0">
            ${md.render(agency.agencyDescription)}
          </p>
        </section>
  
        <div>
          <h3 style="font-weight: 300; margin-bottom: 0.6rem">
            Informazioni sul responsabile
          </h3>
          <table style="border-collapse: collapse; width: 100%">
            <tr>
              <th
                style="
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
                  border-right: 1px solid #d1d1d1;
                  border-left: 1px solid #d1d1d1;
                "
              >
                Nome
              </th>
              <th
                style="
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
                  border-right: 1px solid #d1d1d1;
                  border-left: 1px solid #d1d1d1;
                "
              >
                Cognome
              </th>
              <th
                style="
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
                  border-right: 1px solid #d1d1d1;
                  border-left: 1px solid #d1d1d1;
                "
              >
                Codice fiscale
              </th>
            </tr>
            <tr>
              <td
                style="border: 1px solid #dddddd; text-align: left; padding: 8px"
              >
                ${agency.responsibleFirstName}
              </td>
              <td
                style="border: 1px solid #dddddd; text-align: left; padding: 8px"
              >
                ${agency.responsibleLastName}
              </td>
              <td
                style="border: 1px solid #dddddd; text-align: left; padding: 8px"
              >
                ${agency.responsibleFiscalNumber}
              </td>
            </tr>
          </table>
        </div>
  
        <section style="margin-top: 1rem">
          <div
            style="
              border-radius: 6px;
              width: fit-content;
              margin-right: auto;
              margin-left: auto;
              padding: 1rem;
              padding-left: 2rem;
              padding-right: 2rem;
            "
          >
            <h3
              style="
                font-weight: 300;
                margin-bottom: 0.3rem;
                margin-top: 0;
                text-align: center;
              "
            >
              Informazioni aziendali
            </h3>
            <div
              style="
                display: flex;
                justify-content: center;
                margin-top: 1rem;
                align-items: center;
              "
            >
              ${
                  agency.logoUrl
                      ? `
              <div style="margin-right: 1rem">
                <img
                  loading="lazy"
                  src="${agency.logoUrl}"
                  style="width: 18rem; height: 18rem; object-fit: contain"
                  alt="Agency logo"
                />
              </div>
                `
                      : ""
              }
              <div style="margin-left: 1rem; margin-top: auto; margin-bottom: auto">
                <div>
                  <h2 style="margin-top: 0">${agency.agencyName}</h2>
                </div>
                <div style="display: flex; align-items: center">
                  <img
                    loading="lazy"
                    style="margin-right: 0.25rem; max-width: 1rem"
                    src="https://i.imgur.com/sa9fjfu.png"
                    alt="Position"
                  />
                  <a
                    class="dotted-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.google.com/maps/search/?api=1&query=${
                        agency.agencyAddress
                    }"
                    style="color: inherit; text-decoration: underline dotted"
                  >
                    ${agency.agencyAddress}
                  </a>
                </div>
                <div
                  class="agency-card-new-field"
                  style="display: flex; align-items: center; margin-top: 1rem"
                >
                  <img
                    loading="lazy"
                    src="https://i.imgur.com/61scpcT.png"
                    style="margin-right: 0.3rem; max-width: 1rem"
                    alt="Phone number"
                  />
                  <a
                    class="dotted-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="tel:${agency.phoneNumber}"
                    style="color: inherit; text-decoration: underline dotted"
                  >
                    ${agency.phoneNumber}
                  </a>
                </div>
                <div
                  class="agency-card-new-field"
                  style="display: flex; align-items: center; margin-top: 1rem"
                >
                  <img
                    loading="lazy"
                    src="https://i.imgur.com/Ig1rYHz.png"
                    style="margin-right: 0.4rem; max-width: 1rem"
                    alt="Email"
                  />
                  <a
                    class="dotted-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="mailto:${agency.email}"
                    style="color: inherit; text-decoration: underline dotted"
                  >
                    ${agency.email}
                  </a>
                </div>
                <div
                  class="agency-card-new-field"
                  style="display: flex; align-items: center; margin-top: 1rem"
                >
                  <img
                    loading="lazy"
                    src="https://i.imgur.com/uPeXi0p.png"
                    style="margin-right: 0.35rem; max-width: 1rem"
                    alt="Website URL"
                  />
                  <a
                    class="dotted-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="${agency.websiteUrl}"
                    style="color: inherit; text-decoration: underline dotted"
                  >
                    ${agency.websiteUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <div style="margin-top: 2rem; margin-bottom: 2rem; text-align: center">
          <a
            style="
              padding: 1rem;
              outline: none;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              background-color: #fe3c00;
              color: white;
              font-size: 1.5rem;
              -webkit-appearance: none;
              text-decoration: none;
            "
            href="https://occupalostudente.bitrey.it/secretary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apri dashboard
          </a>
        </div>
      </div>
      <footer
        class="container"
        style="
          background-color: #f7f7f7;
          text-align: center;
          color: #5e5e5e;
          padding: 1rem;
          padding-right: 3rem;
          padding-left: 3rem;
          padding-bottom: 1.5rem;
        "
      >
        <div>
          <p>
            <span style="font-weight: 500">Occupa lo studente</span>
            di Alessandro Amella e Yaroslav Pavlik &copy; 2022
          </p>
        </div>
        <div>
            Per supporto contattare la segreteria al numero
            <a
              class="dotted-url"
              href="tel:+39059211092"
              style="color: inherit; text-decoration: underline dotted"
            >
              059211092
          </a>
        </div>
      </footer>
    </body>
  </html>
  `;
}
