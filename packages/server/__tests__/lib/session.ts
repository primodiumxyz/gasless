import TestAgent from "supertest/lib/agent";
import { expect } from "vitest";

export async function loginUser(agent: TestAgent) {
  const response = await agent.post("/session").expect(200);

  expect(response.body).toEqual({ authenticated: true });

  return response;
}

export async function logoutUser(agent: TestAgent) {
  const response = await agent.delete("/session").expect(200);

  expect(response.body).toEqual({ authenticated: false });

  return response;
}
