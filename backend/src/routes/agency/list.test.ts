import supertest from "supertest";

import { app } from "../../app";

describe("agency", () => {
    describe("list agencies route", () => {
        describe("with no filters", () => {
            it("should return the agencies", async () => {
                const { body, status } = await supertest(app).get(
                    "/api/agency"
                );
                expect(status).toBe(200);
                // eslint-disable-next-line no-console
                console.log(body);
            });
        });
    });
});
