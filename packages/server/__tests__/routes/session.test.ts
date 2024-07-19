import { expect, it } from "vitest";

import { createHttpAgent, createUserWallet, sleep } from "@tests/lib/common";
import { loginUser, logoutUser } from "@tests/lib/session";

it("should not include user session when uninitialized", async () => {
  const agent = createHttpAgent();

  const response = await agent.get("/session").expect(200);

  expect(response.headers["set-cookie"]).toBeFalsy();
});

it("should not be authenticated by default", async () => {
  const agent = createHttpAgent();

  const response = await agent.get("/session").expect(200);

  expect(response.body).toEqual({ authenticated: false });
});

it("should return authenticated after login", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  await loginUser(user, agent);

  //check response again for sanity
  const response = await agent.get("/session").expect(200);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(true);
});

it("should return unauthenticated after logout", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  //login
  await loginUser(user, agent);

  //logout
  await logoutUser(agent);

  //check response again for sanity
  const response = await agent.get("/session").expect(200);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(false);
});

it("should allow authentication if already authenticated", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  await loginUser(user, agent);

  // try to login again
  await loginUser(user, agent);

  const response = await agent.get("/session").expect(200);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(true);
});

it("should expire session after a short timebound delegation", async () => {
  const agent = createHttpAgent();
  const user = createUserWallet();

  await loginUser(user, agent, 5);

  await sleep(1000 * 5);

  const response = await agent.get("/session").expect(200);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(false);
});
