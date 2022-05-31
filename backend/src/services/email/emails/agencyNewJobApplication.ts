import { AgencyDoc, JobOfferDoc, StudentDoc } from "@models";

export function agencyNewJobApplication(
    agency: AgencyDoc,
    student: StudentDoc,
    jobOffer?: JobOfferDoc
) {
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
            Hai ricevuto una candidatura per la tua azienda!
        </h1>

        <section style="margin-bottom: 2rem">
            <p style="margin-top: 0.5rem">
            Lo studente
            <strong>${student.firstName} ${student.lastName}</strong>
            si è candidato presso
            <strong>${agency.agencyName}</strong>
            ${
                jobOffer
                    ? "per l'offerta di lavoro di <strong>" +
                      jobOffer.title +
                      "</strong>"
                    : ""
            }
            </p>
            <p style="margin-top: 1rem">
            Puoi visualizzare tutti i dettagli, come curriculum, informazioni
            aggiuntive ecc. nella area aziende di
            <a
                class="dotted-url"
                href="https://occupalostudente.bitrey.it/agency"
                target="_blank"
                rel="noopener noreferrer"
                style="color: inherit; text-decoration: underline dotted"
            >
                Occupa lo Studente.
            </a>
            </p>

            <div style="margin-top: 3rem; margin-bottom: 2rem; text-align: center">
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
                href="https://occupalostudente.bitrey.it/agency/dashboard?view=jobapplications"
                target="_blank"
                rel="noopener noreferrer"
            >
                Visualizza candidatura
            </a>
            </div>
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
            Per supporto contattare
            <a
            class="dotted-url"
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:alessandro.amella@live.it"
            style="color: inherit; text-decoration: underline dotted"
            >
            alessandro.amella@live.it
            </a>
        </div>
        </footer>
    </body>
    </html>
`;
}
