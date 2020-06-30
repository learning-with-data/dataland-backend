const assert = require("assert");
const app = require("../../src/app");

describe("'projectblobs' service", () => {
  let user1;
  let project;
  const user1Info = {
    email: "someone3@example.com",
    username: "someone3",
    password: "supersecret"
  };
  before(async () => {
    user1 = await app.service("users").create(user1Info);
    project = await app.service("projects").create({
      title: "Test project",
      userId: user1.id,
      description: "Test description"
    });
  });
  
  it("registered the service", () => {
    const service = app.service("projectblobs");
    assert.ok(service, "Registered the service");
  });

  it("associates a projectBlob property (null by default) to projects.get", async () => {
    const p = await app.service("projects").get(project.id);
    assert.equal(p.projectBlob, null);
  });

  it("does not create a projectBlob property for project patch where projectBlob is nonexistent", async () => {
    const p = await app.service("projects").patch(project.id, {title: "New title"});
    assert.equal(p.title, "New title");
    const blobs = await app.service("projectblobs").find({query: {projectId: project.id}});
    assert.equal(blobs.total, 0);
  });

  it("creates a projectBlob property for project patch where projectBlob is supplied", async () => {
    const projectBlob = new ArrayBuffer(3);
    const p = await app.service("projects").patch(project.id, { projectBlob });
    assert.deepEqual(p.projectBlob, projectBlob);
    const blobs = await app.service("projectblobs").find({query: {projectId: project.id}});
    assert.equal(blobs.total, 1);
  });

  it("does not create a new projectBlob property with a project patch w/ an empty projectBuffer", async () => {
    const projectBlob = new ArrayBuffer(0);
    const p = await app.service("projects").patch(project.id, { projectBlob });
    assert.notDeepEqual(p.projectBlob, projectBlob);
    const blobs = await app.service("projectblobs").find({query: {projectId: project.id}});
    assert.equal(blobs.total, 1);
  });

  it("creates a projectBlob property with the last patch w/ non-empty projectBuffer call", async () => {
    const projectBlob = new ArrayBuffer(5);
    const p = await app.service("projects").patch(project.id, { projectBlob });
    assert.deepEqual(p.projectBlob, projectBlob);
    const blobs = await app.service("projectblobs").find({query: {projectId: project.id}});
    assert.equal(blobs.total, 2);
  });

  it("rejects external calls", async () => {
    const params = { provider: "rest" };

    // find()
    await assert.rejects(app.service("projectblobs").find(params), {name: "MethodNotAllowed"});

    // get()
    await assert.rejects(app.service("projectblobs").get(1, params), {name: "MethodNotAllowed"});

    // create()
    await assert.rejects(app.service("projectblobs").create({blob: new ArrayBuffer(2), projectId: 1}, params), {name: "MethodNotAllowed"});

    // update()
    await assert.rejects(app.service("projectblobs").update(1, {blob: new ArrayBuffer(2), projectId: 1}, params), {name: "MethodNotAllowed"});

    // patch()
    await assert.rejects(app.service("projectblobs").patch(1, {blob: new ArrayBuffer(2), projectId: 1}, params), {name: "MethodNotAllowed"});

    // remove()
    await assert.rejects(app.service("projectblobs").remove(1, params), {name: "MethodNotAllowed"});

  });

});
