const assert = require("assert");
const app = require("../../src/app");

describe("'users' service", () => {
  it("registered the service", () => {
    const service = app.service("users");

    assert.ok(service, "Registered the service");
  });

  it("creates a user, encrypts password", async () => {
    const user = await app.service("users").create({
      email: "test@example.com",
      username: "testtest",
      password: "secret"
    });

    // Makes sure the password got encrypted
    assert.ok(user.password !== "secret");
  });

  it("removes password for external requests", async () => {
    // Setting `provider` indicates an external request
    const params = { provider: "rest" };

    const user = await app.service("users").create({
      email: "test2@example.com",
      username: "test2test2",
      password: "secret2"
    }, params);

    // Make sure password has been removed
    assert.ok(!user.password);
  });


});
