const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;

chai.use(chaiHttp);

const URL = "http://localhost:5000/api";
const agent = chai.request.agent(URL);

describe("Agencies", () => {
    // DEBUG use auth
    describe("List agencies", () => {
        it("executes without auth", async () => {
            const res = await agent.get("/agency");
            expect(res).to.have.status(200);
        });
    });

    let agency;

    describe("Create an agency", () => {
        it("emits email param", async () => {
            const _agency = {
                responsibleFirstName: "Mario",
                responsibleLastName: "Rossi",
                responsibleFiscalNumber: "RSSMRA80A01F839W",
                // email: "mario@rossi.it",
                password: "Mario1234",
                websiteUrl: "https://www.google.it",
                phoneNumber: "3924133359",
                agencyName: "Rossi S.p.A.",
                agencyDescription: "Mario Rossi S.p.A. produce mobili",
                agencyAddress: "Via Garibaldi 1, Napoli, Italia",
                vatCode: "02201090368",
                logoUrl: "https://tpldisplay.bitrey.it/img/seta.png"
            };
            const res = await agent.post("/agency").send(_agency);
            expect(res).to.have.status(400);
        });

        it("sends correct params", async () => {
            const _agency = {
                responsibleFirstName: "Mario",
                responsibleLastName: "Rossi",
                responsibleFiscalNumber: "RSSMRA80A01F839W",
                email: "mario@rossi.it",
                password: "Mario1234",
                websiteUrl: "https://www.google.it",
                phoneNumber: "3924133359",
                agencyName: "Rossi S.p.A.",
                agencyDescription: "Mario Rossi S.p.A. produce mobili",
                agencyAddress: "Via Garibaldi 1, Napoli, Italia",
                vatCode: "02201090368",
                logoUrl: "https://tpldisplay.bitrey.it/img/seta.png"
            };
            const res = await agent.post("/agency").send(_agency);
            expect(res).to.have.status(200);

            agency = res.body;
            // console.log(agency);
        });
    });

    describe("Delete an agency", () => {
        it("deletes it", async () => {
            const res = await agent
                .delete("/agency/" + agency._id)
                .send(agency);
            expect(res).to.have.status(200);
        });
    });
});
