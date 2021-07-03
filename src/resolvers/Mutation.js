const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function createLink(parent, args, context, info) {
  console.log(context);
  const { userId } = context;

  console.log(userId);

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  context.pubsub.publish("NEW_LINK", newLink);
  return newLink;
}

async function signup(parent, args, context, info) {
  // 1: encrypt user password with bycryptJS library
  const password = await bcrypt.hash(args.password, 10);

  // 2: create a Prisma instance of user to store in the db
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  // 3: generate a json web token which is signed with an env variable
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4: return user and token in an object that adheres to the shape of an AutoPayload object
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  // 1: retrieve user from Prisma
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2: validate user with Bcrypt
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  // 3: generate a json web token which is signed with an env variable
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4: return user and token in an object that adheres to the shape of the AutoPayload object
  return {
    token,
    user,
  };
}

async function vote(parent, args, context, info) {
  // 1: validate incoming token
  const userId = getUserId(context);

  // 2: query the vote instance
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  // check to see if vote already exists:
  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // 3: create the new vote that's connected to a User and a Link
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  createLink,
  signup,
  login,
  vote,
};
