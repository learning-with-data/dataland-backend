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
  const projectBlob = projectBlobs.total ? projectBlobs.data[0] : {blob: null};
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
  await context.app.service("projectblobs").create({projectBlob: projectBlob, projectId: context.id});
  
  // Reattach projectBlob to the result to be sent back to the client
  context.result.projectBlob = projectBlob;

  return context;
};
