exports.getProjectBlobforProject = async (context) => {
  if (context.method != "get") {
    throw new Error("This hook only works for \"get\" methods.");
  }
  if (context.type != "after") {
    throw new Error("This hook can only be an \"after\" hook.");
  }

  const projectBlobs = await context.app.service("projectblobs").find({
    query: {
      projectId: context.id,
      $select: ["projectBlob"],
      $sort: { createdAt: -1 },
      $limit: 1,
    },
  });
  const projectBlob = projectBlobs.total
    ? projectBlobs.data[0]
    : { blob: null };
  context.result.projectBlob = projectBlob.projectBlob;

  return context;
};

exports.patchProjectBlobforProject = async (context) => {
  if (context.method != "patch") {
    throw new Error("This hook only works for the \"patch\" method.");
  }
  if (context.type != "after") {
    throw new Error("This hook can only be an \"after\" hook.");
  }

  const projectBlob = context.data.projectBlob;
  if (!projectBlob || !projectBlob.byteLength) {
    return context;
  }

  // Save projectBlob the database
  await context.app
    .service("projectblobs")
    .create({ projectBlob: projectBlob, projectId: context.id });

  // Reattach projectBlob to the result to be sent back to the client
  context.result.projectBlob = projectBlob;

  return context;
};

exports.createProjectBlobforProject = async (context) => {
  if (context.method != "create") {
    throw new Error("This hook only works for the \"create\" method.");
  }
  if (context.type != "after") {
    throw new Error("This hook can only be an \"after\" hook.");
  }

  // Based on: https://github.com/feathersjs-ecosystem/feathers-authentication-hooks/issues/79
  if (context.service?.options?.multi && Array.isArray(context.result)) {
    // multi
    if (
      context.service.options.multi === true ||
      (Array.isArray(context.service?.options?.multi) &&
        [...context.service.options.multi].includes(context.method))
    ) {
      let i = 0;
      // TODO: Investigate if doing a multi-create for projectBlob gives us a performance advantage here
      for (const project of context.result) {
        const projectBlob = context.data[i].projectBlob;
        if (projectBlob && projectBlob.byteLength) {
          await context.app
            .service("projectblobs")
            .create({ projectBlob: projectBlob, projectId: project.id });
          project.projectBlob = projectBlob;
        }
        i++;
      }
      return context;
    }
  } else {
    // single
    const projectBlob = context.data.projectBlob;
    if (!projectBlob || !projectBlob.byteLength) {
      return context;
    }
    await context.app
      .service("projectblobs")
      .create({ projectBlob: projectBlob, projectId: context.result.id });

    context.result.projectBlob = projectBlob;

    return context;
  }
};
