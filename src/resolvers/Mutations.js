const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

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

async function createLink(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

module.exports = {
  signup,
  login,
  createLink,
};
