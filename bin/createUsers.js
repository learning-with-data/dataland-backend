#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const prompt = require("prompt");
const generator = require("generate-password");
const {
  uniqueNamesGenerator,
  colors,
  animals,
} = require("unique-names-generator");

const app = require("../src/app");

async function main() {
  const argv = yargs(hideBin(process.argv)).argv;
  const n = argv.n;

  const result = await prompt.get(["invitationCode"]);

  for (let i = 0; i < n; i++) {
    let username = uniqueNamesGenerator({
      dictionaries: [colors, animals],
    });
    let userInfo = {
      email: username + "@example.com",
      username: username,
      password: generator.generate({
        length: 10,
        numbers: true,
      }),
      invitationCode: result.invitationCode,
    };
    let user = await app.service("users").create(userInfo);
    console.log(user.username, "\t", userInfo.password);
  }
}

main();
