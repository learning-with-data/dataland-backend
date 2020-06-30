const assert = require("assert");
const app = require("../../src/app");

describe("'projects' service", () => {
  // Create a couple of users who will (or will not) be project creators
  let user1, user2;
  const user1Info = {
    email: "someone1@example.com",
    username: "someone1",
    password: "supersecret"
  };
  const user2Info = {
    email: "someone2@example.com",
    username: "someone2",
    password: "supersecret"
  };
  before(async () => {
    user1 = await app.service("users").create(user1Info);
    user2 =await app.service("users").create(user2Info);
  });

  it("registered the service", () => {
    const service = app.service("projects");

    assert.ok(service, "Registered the service");
  });

  it("creates a project", async () => {
    const project = await app.service("projects").create({
      title: "Test project",
      userId: user1.id,
      description: "Test description"
    });

    assert.ok(project);
  });

  it("creates a project and assigns the right userId", async () => {
    const params = { user: user1 };

    const project = await app.service("projects").create({
      title: "Test project 2",
      description: "Test description 2"
    }, params);

    assert.equal(project.userId, user1.id);
  });

  it("creates a project and allows the creator to patch the project", async () => {
    const params = { user: user1 };

    const project = await app.service("projects").create({
      title: "Test project 3",
      description: "Test description 3"
    }, params);

    const updatedProject = await app.service("projects").patch(project.id, {
      description: "Updated description"
    }, params);

    assert.equal(updatedProject.description, "Updated description");
  });

  it("creates a project and allows the creator to remove the project", async () => {
    const params = { user: user1 };

    const project = await app.service("projects").create({
      title: "Test project 4",
      description: "Test description 4"
    }, params);

    const updatedProject = await app.service("projects").remove(project.id, params);

    assert.equal(updatedProject.id, project.id);

    // Make a second get() call to make sure that the project was really removed
    await assert.rejects(app.service("projects").get(project.id, params), {name: "NotFound"});
  });

  it("creates a project and disallows another user from getting, patching, or removing, or finding the project", async () => {
    const params1 = { user: user1 };

    const project = await app.service("projects").create({
      title: "Test project 4",
      description: "Test description 4"
    }, params1);

    const params2 = { user: user2 };

    // get()
    await assert.rejects(app.service("projects").get(project.id, params2), {name: "NotFound"});

    // patch()
    await assert.rejects(app.service("projects").patch(project.id, {description: "Updated description (disallowed)"}, params2),
      {name: "NotFound"});
    
    // remove()
    await assert.rejects(app.service("projects").remove(project.id, params2), {name: "NotFound"});

    // find(), with just the user information
    const foundProjectsWithoutProjectId = await app.service("projects").find(params2);
    assert.strictEqual(foundProjectsWithoutProjectId.data.length, 0);

    // find(), with the user information, and an explicity query for the project id
    const foundProjectsWithProjectId = await app.service("projects").find(Object.assign(params2, {id: project.id}));
    assert.strictEqual(foundProjectsWithProjectId.data.length, 0);
  });

  it("disallows calls to update()", async () => {
    const params1 = { user: user1 };

    const project = await app.service("projects").create({
      title: "Test project 5",
      description: "Test description 5"
    }, params1);

    await assert.rejects(app.service("projects").update(project.id, {...project, title: "New title"}), {name: "MethodNotAllowed"});


  });

});
