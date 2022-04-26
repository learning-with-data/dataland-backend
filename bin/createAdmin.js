#!/usr/bin/env node

const prompt = require("prompt");

const app = require("../src/app");

const schema = {
  properties: {
    username: {
      required: true,
    },
    email: {
      required: true,
    },
    password: {
      required: true,
      hidden: true,
    },
  },
};

async function main() {
  const result = await prompt.get(schema);

  const userInfo = {
    email: result.email,
    username: result.username,
    password: result.password,
    admin: true,
    invitationCode: "chang3m3",
  };

  const user = await app.service("users").create(userInfo);
  console.log(`User ${user.username} successfully created`);
}

main();
