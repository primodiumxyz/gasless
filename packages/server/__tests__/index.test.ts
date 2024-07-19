import supertest from "supertest";
import { expect, it } from "vitest";

import { TEST_SERVER_ENDPOINT } from "@tests/lib/constants";

it("should respond to GET / route", async () => {
  const response = await supertest(TEST_SERVER_ENDPOINT).get("/").expect(200);

  expect(response.body).toEqual({ status: "OK" });
});
