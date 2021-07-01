const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const fs = require("fs");
const path = require("path");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const prisma = new PrismaClient();
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

// context resolver argument ~>
// POJO that every resolver in the chain can read from and write to.
// A means for resolvers to communicate

// You can write to the context object once the GraphQL server is initialized,
// as well as access it from inside the resolvers via the `context` arguement.

// Prisma Client exposes a CRUD API for the models in your data model for you to read and write in your database.
// These methods are auto-generated based on your model definitions in schema.prisma
