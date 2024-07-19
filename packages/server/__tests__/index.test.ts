import supertest from "supertest";
import { expect, it } from "vitest";

it("should respond to GET / route", async () => {
  const response = await supertest(`http://localhost:3000`).get("/").expect(200);

  expect(response.body).toEqual({ status: "OK" });
});
