const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { PubSub } = require("apollo-server");
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

const pubsub = new PubSub();
const prisma = new PrismaClient();
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
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

// PubSub from the apollo-server library is used to implement subscriptions to the following events:
// A new model is created
// An existing model updated
// An existing model is deleted

// First add an instance of PubSub to the context, just as we did with PrismaClient,
// and then calling its methods in the resolvers that handle each of the above events.

// Once you pass `pubsub` variable to the resolvers, you can access the methods needed to implement our subscriptions
// from inside our resolvers via `context.pubsub`.
