import { AgencyDoc } from "@models";

export function agencyRegistration(agency: AgencyDoc) {
    return `
    <!DOCTYPE html>
<html lang="en">
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
      style="width: 100%; background-color: rgb(41, 42, 42); display: flex"
    >
      <img
        loading="lazy"
        src="https://ssh.edu.it/images/logos/fermi.png"
        alt="Occupa lo studente logo"
        style="
          max-width: 3rem;
          object-fit: contain;
          margin-right: 0.2rem;
          margin-left: auto;
        "
      />
      <p
        style="
          font-size: 2rem;
          font-weight: 300;
          color: white;
          margin-left: 0.2rem;
          margin-right: auto;
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
        La tua azienda
        <strong>"${agency.agencyName}"</strong>
        è in fase di revisione
      </h1>

      <section style="margin-bottom: 2rem">
        <h2 style="margin-top: 2rem; margin-bottom: 0">Azienda registrata!</h2>
        <p style="margin-top: 0.5rem">
          La segreteria deciderà a breve se approvarla o rifiutarla sul portale
          <a
            class="dotted-url"
            href="https://occupalostudente.bitrey.it/"
            target="_blank"
            rel="noopener noreferrer"
            style="color: inherit; text-decoration: underline dotted"
          >
            Occupa lo Studente
          </a>.
        </p>
        <p>
          È possibile che verrai contattato dal personale scolastico per email (<strong>${agency.email}</strong>) o per telefono (<strong>${agency.phoneNumber}</strong>).
        </p>
        <p style="margin-top: 2rem">
          Nota che, finché la tua azienda non verrà approvata, gli studenti non
          potranno visualizzarla e non potrai creare offerte di lavoro.
        </p>
        <p>
          In caso di dubbi puoi contattare la segreteria al numero
          <a
            class="dotted-url"
            href="tel:+39059211092"
            style="color: inherit; text-decoration: underline dotted"
          >
            059211092
          </a>
          o via email all'indirizzo
          <a
            class="dotted-url"
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:motf080005@istruzione.it"
            style="color: inherit; text-decoration: underline dotted"
          >
            motf080005@istruzione.it
          </a>
        </p>
      </section>
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
