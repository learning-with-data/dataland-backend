const assert = require("assert");
const app = require("../../src/app");
const crypto = require("crypto");

describe("'projectblobs' service", () => {
  let user1;
  let project;
  const user1Info = {
    email: "someone3@example.com",
    username: "someone3",
    password: "supersecret",
    invitationCode: "chang3m3",
  };
  before(async () => {
    user1 = await app.service("users").create(user1Info);
    project = await app.service("projects").create({
      title: "Test project",
      userId: user1.id,
      description: "Test description",
    });
  });

  it("registered the service", () => {
    const service = app.service("projectblobs");
    assert.ok(service, "Registered the service");
  });

  it("associates the supplied projectBlob when a project is created", async () => {
    const projectBlob = new ArrayBuffer(3);
    const p = await app.service("projects").create({
      title: "New blob test",
      description: "New description",
      projectBlob: projectBlob,
    });
    const blobs = await app
      .service("projectblobs")
      .find({ query: { projectId: p.id } });
    assert.equal(blobs.total, 1);
  });

  it("associates the supplied projectBlobs (or not) when multiple projects are created", async () => {
    const projects = [
      {
        title: "Multi blob test 1",
        description: "Test description",
        projectBlob: crypto.randomBytes(2),
      },
      {
        title: "Multi blob test 2",
        description: "Test description",
        projectBlob: crypto.randomBytes(4),
      },
      {
        title: "Multi blob test 3",
        description: "Test description",
      },
      {
        title: "Multi blob test 4",
        description: "Test description",
        projectBlob: crypto.randomBytes(8),
      },
    ];

    const ps = await app.service("projects").create(projects);
    let i = 0;
    for (const p of ps) {
      const blobs = await app
        .service("projectblobs")
        .find({ query: { projectId: p.id } });
      if (i == 2) {
        // Special case where there should be no projectblob
        assert.equal(blobs.total, 0);
      } else {
        assert.equal(blobs.total, 1);
        assert.equal(
          Buffer.compare(blobs.data[0].projectBlob, projects[i].projectBlob),
          0
        );
      }

      i++;
    }
  });

  it("associates a projectBlob property (null by default) to projects.get", async () => {
    const p = await app.service("projects").get(project.id);
    assert.equal(p.projectBlob, null);
  });

  it("does not create a projectBlob property for project patch where projectBlob is nonexistent", async () => {
    const p = await app
      .service("projects")
      .patch(project.id, { title: "New title" });
    assert.equal(p.title, "New title");
    const blobs = await app
      .service("projectblobs")
      .find({ query: { projectId: project.id } });
    assert.equal(blobs.total, 0);
  });

  it("creates a projectBlob property for project patch where projectBlob is supplied", async () => {
    const projectBlob = new ArrayBuffer(3);
    const p = await app.service("projects").patch(project.id, { projectBlob });
    assert.deepEqual(p.projectBlob, projectBlob);
    const blobs = await app
      .service("projectblobs")
      .find({ query: { projectId: project.id } });
    assert.equal(blobs.total, 1);
  });

  it("does not create a new projectBlob property with a project patch w/ an empty projectBuffer", async () => {
    const projectBlob = new ArrayBuffer(0);
    const p = await app.service("projects").patch(project.id, { projectBlob });
    assert.notDeepEqual(p.projectBlob, projectBlob);
    const blobs = await app
      .service("projectblobs")
      .find({ query: { projectId: project.id } });
    assert.equal(blobs.total, 1);
  });

  it("creates a projectBlob property with the last patch w/ non-empty projectBuffer call", async () => {
    const projectBlob = new ArrayBuffer(5);
    const p = await app.service("projects").patch(project.id, { projectBlob });
    assert.deepEqual(p.projectBlob, projectBlob);
    const blobs = await app
      .service("projectblobs")
      .find({ query: { projectId: project.id } });
    assert.equal(blobs.total, 2);
  });

  it("rejects external calls", async () => {
    const params = { provider: "rest" };

    // find()
    await assert.rejects(app.service("projectblobs").find(params), {
      name: "MethodNotAllowed",
    });

    // get()
    await assert.rejects(app.service("projectblobs").get(1, params), {
      name: "MethodNotAllowed",
    });

    // create()
    await assert.rejects(
      app
        .service("projectblobs")
        .create({ projectBlob: new ArrayBuffer(2), projectId: 1 }, params),
      { name: "MethodNotAllowed" }
    );

    // update()
    await assert.rejects(
      app
        .service("projectblobs")
        .update(1, { projectBlob: new ArrayBuffer(2), projectId: 1 }, params),
      { name: "MethodNotAllowed" }
    );

    // patch()
    await assert.rejects(
      app
        .service("projectblobs")
        .patch(1, { projectBlob: new ArrayBuffer(2), projectId: 1 }, params),
      { name: "MethodNotAllowed" }
    );

    // remove()
    await assert.rejects(app.service("projectblobs").remove(1, params), {
      name: "MethodNotAllowed",
    });
  });
});
