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
      password: "secret",
      invitationCode: "chang3m3",
    });

    // Makes sure the password got encrypted
    assert.ok(user.password !== "secret");
  });

  it("removes password for external requests", async () => {
    // Setting `provider` indicates an external request
    const params = { provider: "rest" };

    const user = await app.service("users").create(
      {
        email: "test2@example.com",
        username: "test2test2",
        password: "secret2",
        invitationCode: "chang3m3",
      },
      params
    );

    // Make sure password has been removed
    assert.ok(!user.password);
  });

  it("does not allow user to modify other user", async () => {
    const user1 = await app.service("users").create({
      email: "test3@example.com",
      username: "testtest3",
      password: "secret",
      invitationCode: "chang3m3",
    });

    const user2 = await app.service("users").create({
      email: "test4@example.com",
      username: "testtest4",
      password: "secret",
      invitationCode: "chang3m3",
    });

    const params = { provider: "rest", user: user2 };

    await assert.rejects(
      app
        .service("users")
        .update(user1.id, { ...user1, password: "newpass" }, params),
      { name: "NotAuthenticated" }
    );
  });

  it("does not allow user creation without invite code", async () => {
    await assert.rejects(
      app.service("users").create({
        email: "test5@example.com",
        username: "test5test5",
        password: "secret",
      }),
      { name: "Forbidden" }
    );
  });

  it("does allow user creation with correct invite code", async () => {
    await assert.rejects(
      app.service("users").create({
        email: "test5@example.com",
        username: "test5test5",
        password: "secret",
        invitationCode: "chang3m3now",
      }),
      { name: "Forbidden" }
    );

    await assert.ok(
      app.service("users").create({
        email: "test5@example.com",
        username: "test5test5",
        password: "secret",
        invitationCode: "chang3m3",
      })
    );
  });
});
