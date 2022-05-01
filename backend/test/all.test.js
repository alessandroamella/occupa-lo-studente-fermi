const chai = require("chai");
const chaiHttp = require("chai-http");
const { faker } = require("@faker-js/faker");
const CodiceFiscale = require("codice-fiscale-js");

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

    const name = faker.name.firstName();
    const surname = faker.name.lastName();

    const cf = new CodiceFiscale({
        birthplace: "Modena",
        birthplaceProvincia: "MO",
        day: faker.datatype.number({ min: 1, max: 30 }),
        gender: "M",
        month: faker.datatype.number({ min: 1, max: 12 }),
        name,
        surname,
        year: faker.datatype.number({ min: 1990, max: 2003 })
    });

    const rawAgency = {
        responsibleFirstName: name,
        responsibleLastName: surname,
        responsibleFiscalNumber: cf.toString(),
        email: faker.internet.email(name, surname),
        websiteUrl: "https://www.google.com",
        phoneNumber: "3924133359",
        password: faker.internet.password(16),
        agencyName: faker.company.companyName(),
        agencyDescription: faker.lorem.paragraphs(3),
        agencyAddress:
            faker.address.city() + " " + faker.address.secondaryAddress(),
        vatCode: faker.datatype.string(10)
    };

    let agencyDB;

    describe("Create an agency", () => {
        it("emits email param", async () => {
            const res = await agent
                .post("/agency")
                .send({ ...rawAgency, email: "invalid" });
            expect(res).to.have.status(400);
        });

        it("uses short password", async () => {
            const res = await agent
                .post("/agency")
                .send({ ...rawAgency, password: faker.internet.password(4) });
            expect(res).to.have.status(400);
        });

        it("sends correct params", async () => {
            const res = await agent.post("/agency").send(rawAgency);
            expect(res).to.have.status(200);

            agencyDB = res.body;
        });
    });

    describe("Delete an agency", () => {
        it("deletes it", async () => {
            const res = await agent
                .delete("/agency/" + agencyDB._id)
                .send(agencyDB);
            expect(res).to.have.status(200);
        });
    });
});

describe("Students", () => {
    const name = faker.name.firstName();
    const surname = faker.name.lastName();

    const cf = new CodiceFiscale({
        birthplace: "Modena",
        birthplaceProvincia: "MO",
        day: faker.datatype.number({ min: 1, max: 30 }),
        gender: "M",
        month: faker.datatype.number({ min: 1, max: 12 }),
        name,
        surname,
        year: faker.datatype.number({ min: 2003, max: 2005 })
    });

    const rawStudent = {
        googleId: faker.datatype.number({ min: 1000, max: 9999 }),
        firstName: name,
        lastName: surname,
        fiscalNumber: cf.toString(),
        email: `${name}.${surname}@fermi.mo.it`,
        pictureURL: "https://picsum.photos/300",
        phoneNumber: "3924133359",
        fieldOfStudy: "it"
        // spidVerified: false,
    };

    let studentDB;

    describe("test routes while not logged in", () => {
        describe("gets current user ", () => {
            it("should return unauthorized", async () => {
                const res = await agent.get("/student");
                expect(res).to.have.status(401);
            });
        });

        describe("gets available job offers", () => {
            it("returns unauthorized", async () => {
                const res = await agent
                    .get("/student/joboffers")
                    .query({ field: "it" });
                expect(res).to.have.status(401);
            });
        });
    });

    describe("logins in with test route", () => {
        it("logs student in", async () => {
            const res = await agent
                .post("/student/auth/testauth")
                .send(rawStudent);
            expect(res).to.have.status(200);

            studentDB = res.body;
        });

        describe("gets current user ", () => {
            it("returns the student", async () => {
                const res = await agent.get("/student");
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object").with.property("_id");
            });
        });

        describe("gets available job offers", () => {
            it("lists the job offers", async () => {
                const res = await agent
                    .get("/student/joboffers")
                    .query({ field: "it" });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
            });
        });

        describe("delete student", () => {
            it("deletes the student", async () => {
                const res = await agent.delete("/student");
                expect(res).to.have.status(200);
            });
        });
    });
});
