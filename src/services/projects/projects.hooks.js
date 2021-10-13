const { authenticate } = require("@feathersjs/authentication").hooks;
const { Forbidden } = require("@feathersjs/errors");
const { disallow } = require("feathers-hooks-common");
const {
  createProjectBlobforProject,
  getProjectBlobforProject,
  patchProjectBlobforProject,
} = require("../../hooks/projects-projectblobs-association-hooks");
const { setField } = require("feathers-authentication-hooks");

const setUserId = async (context) => {
  // Based on: https://github.com/feathersjs-ecosystem/feathers-authentication-hooks/issues/79

  const userId = context.params?.user?.id;
  if (userId === undefined && context.params.provider !== undefined) {
    // External call where userId seems to be undefined
    throw new Forbidden("Expected field for user.id not available");
  }

  if (context.service?.options?.multi && Array.isArray(context.data)) {
    if (
      context.service.options.multi === true ||
      (Array.isArray(context.service?.options?.multi) &&
        [...context.service.options.multi].includes(context.method))
    ) {
      context.data.forEach((d) => {
        d.userId = userId;
      });
    }
  } else {
    context.data.userId = userId;
  }
  return context;
};
const limitToUser = setField({
  from: "params.user.id",
  as: "params.query.userId",
});

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [limitToUser],
    get: [limitToUser],
    create: [setUserId],
    update: [limitToUser, disallow()],
    patch: [limitToUser],
    remove: [limitToUser],
  },

  after: {
    all: [],
    find: [],
    get: [getProjectBlobforProject],
    create: [createProjectBlobforProject],
    update: [],
    patch: [patchProjectBlobforProject],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
