const { authenticate } = require("@feathersjs/authentication").hooks;
const { disallow } = require("feathers-hooks-common");
const {getProjectBlobforProject, patchProjectBlobforProject} = require("../../hooks/projects-projectblobs-association-hooks");
const { setField } = require("feathers-authentication-hooks");

const setUserId = setField({
  from: "params.user.id",
  as: "data.userId"
});
const limitToUser = setField({
  from: "params.user.id",
  as: "params.query.userId"
});

module.exports = {
  before: {
    all: [ authenticate("jwt") ],
    find: [
      limitToUser
    ],
    get: [
      limitToUser
    ],
    create: [
      setUserId
    ],
    update: [
      limitToUser, disallow()
    ],
    patch: [
      limitToUser
    ],
    remove: [
      limitToUser
    ]
  },

  after: {
    all: [],
    find: [],
    get: [getProjectBlobforProject],
    create: [],
    update: [],
    patch: [patchProjectBlobforProject],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
