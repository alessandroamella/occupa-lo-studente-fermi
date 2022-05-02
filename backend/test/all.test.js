const chai = require("chai");
const chaiHttp = require("chai-http");
const { faker, Faker } = require("@faker-js/faker");
const CodiceFiscale = require("codice-fiscale-js");
const moment = require("moment");

const { expect } = chai;

chai.use(chaiHttp);

const URL = "http://localhost:5000/api";
const agent = chai.request.agent(URL);

describe("Agencies", () => {
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
    vatCode: faker.datatype.string(10),
    logoUrl: "https://picsum.photos/500"
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
      expect(res).to.have.cookie("agencytoken");

      agencyDB = res.body;
    });
  });

  describe("View agency", () => {
    it("shows logged in agency", async () => {
      const res = await agent.get("/agency");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object").with.property("_id");
    });
  });

  describe("Edit agency", () => {
    it("updates the email", async () => {
      const res = await agent
        .put("/agency")
        .send({ email: faker.internet.email() });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object").with.property("_id");

      agencyDB = res.body;
    });
  });

  describe("Job offers", () => {
    const rawJobOffer = {
      agency: agencyDB?._id,
      title: faker.lorem.word(10),
      description: faker.lorem.sentences(10),
      fieldOfStudy: faker.random.arrayElement([
        "it",
        "electronics",
        "chemistry"
      ]),
      expiryDate: faker.date.between(
        moment().add(1, "week").toISOString(),
        moment().add(10, "months").toISOString()
      ),
      mustHaveDiploma: faker.datatype.boolean(),
      numberOfPositions: faker.datatype.number({ min: 1, max: 10 })
    };

    let jobOfferDB;

    describe("Create a job offer", () => {
      it("uses an invalid expiry date", async () => {
        rawJobOffer.agency = agencyDB._id;

        const res = await agent
          .post("/joboffer")
          .send({ ...rawJobOffer, expiryDate: faker.datatype.string() });
        expect(res).to.have.status(400);
      });

      it("uses expiry date too in the future", async () => {
        const res = await agent
          .post("/joboffer")
          .send({ ...rawJobOffer, expiryDate: moment().add(2, "years") });
        expect(res).to.have.status(400);
      });

      it("uses an invalid field of study", async () => {
        const res = await agent
          .post("/joboffer")
          .send({ ...rawJobOffer, fieldOfStudy: faker.lorem.word(16) });
        expect(res).to.have.status(400);
      });

      it("uses valid data", async () => {
        const res = await agent.post("/joboffer").send(rawJobOffer);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object").with.property("_id");

        jobOfferDB = res.body;
      });
    });

    describe("Get a job offer", () => {
      it("uses an invalid ObjectId", async () => {
        const res = await agent.get("/joboffer/" + faker.lorem.word());
        expect(res).to.have.status(400);
      });

      it("finds the job offer", async () => {
        const res = await agent.get("/joboffer/" + jobOfferDB?._id);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object").with.property("_id");
      });
    });

    describe("Edit a job offer", () => {
      it("updates the title", async () => {
        const res = await agent
          .put("/joboffer/" + jobOfferDB?._id)
          .send({ title: faker.lorem.word(10) });
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object").with.property("_id");

        jobOfferDB = res.body;
      });
    });

    describe("Delete a job offer", async () => {
      it("uses an invalid ObjectId", async () => {
        const res = await agent.delete("/joboffer/" + faker.lorem.word());
        expect(res).to.have.status(400);
      });

      it("deletes the job offer", async () => {
        const res = await agent.delete("/joboffer/" + jobOfferDB?._id);
        expect(res).to.have.status(200);
      });
    });
  });

  describe("Delete an agency", () => {
    it("deletes it", async () => {
      const res = await agent.delete("/agency");
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

  describe("Test routes while not logged in", () => {
    describe("gets current user ", () => {
      it("returns unauthorized", async () => {
        const res = await agent.get("/student");
        expect(res).to.have.status(401);
      });
    });

    describe("gets approved agencies", () => {
      it("returns unauthorized", async () => {
        const res = await agent.get("/student/agencies").query({ field: "it" });
        expect(res).to.have.status(401);
      });
    });

    describe("delete student", () => {
      it("returns unauthorized", async () => {
        const res = await agent.delete("/student");
        expect(res).to.have.status(401);
      });
    });
  });

  describe("Login using test route", () => {
    it("logs student in", async () => {
      const res = await agent.post("/student/auth/testauth").send(rawStudent);
      expect(res).to.have.status(200);
      expect(res).to.have.cookie("studenttoken");

      studentDB = res.body;
    });

    describe("gets current user ", () => {
      it("returns the student", async () => {
        const res = await agent.get("/student");
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object").with.property("_id");
      });
    });

    describe("gets approved agencies", () => {
      it("lists the agencies", async () => {
        const res = await agent.get("/student/agencies").query({ field: "it" });
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
