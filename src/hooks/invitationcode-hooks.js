const { Forbidden } = require("@feathersjs/errors");

exports.checkInvitationCode = (context) => {
  const expectedInvitationCode = context.app.get("invitation_code");
  const submittedInvitationCode = context.data.invitationCode;

  if (submittedInvitationCode !== expectedInvitationCode) {
    throw new Forbidden("Invalid invitation code");
  } else {
    return context;
  }
};
