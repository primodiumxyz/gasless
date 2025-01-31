import { expect, it } from "vitest";

import { createHttpAgent, createUserWallet, sleep } from "@tests/lib/common";
import { loginUser, logoutUser } from "@tests/lib/session";

it("should not include user session when uninitialized", async () => {
  const agent = createHttpAgent();

  // Check the session is not initialized
  const response = await agent.get("/session").expect(200);
  expect(response.headers["set-cookie"]).toBeFalsy();
});

it("should not be authenticated by default", async () => {
  const agent = createHttpAgent();

  // Check the session is not initialized
  const response = await agent.get("/session").expect(200);
  expect(response.body).toEqual({ authenticated: false });
});

it("should return authenticated after login", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  // Login the user (setup delegation)
  await loginUser(user, agent);

  // Check the response again for sanity
  const response = await agent.get("/session").expect(200);
  expect(response.body.authenticated).toBe(true);
});

it("should return unauthenticated after logout", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  // Login the user (setup delegation)
  await loginUser(user, agent);

  // Logout the user
  await logoutUser(agent);

  // Check the response again for sanity
  const response = await agent.get("/session").expect(200);
  expect(response.body.authenticated).toBe(false);
});

it("should allow authentication if already authenticated", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  // Login the user (setup delegation)
  await loginUser(user, agent);

  // Try to login again
  await loginUser(user, agent);

  // Check the response again for sanity
  const response = await agent.get("/session").expect(200);
  expect(response.body.authenticated).toBe(true);
});

it("should expire session after a short timebound delegation", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  // Login the user (setup delegation)
  await loginUser(user, agent, 5);

  // Wait for the delegation to expire
  await sleep(1000 * 5);

  const response = await agent.get("/session").expect(200);
  expect(response.body.authenticated).toBe(false);
});
