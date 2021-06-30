const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// let links = [
//   {
//     id: "link-0",
//     url: "www.howtographql.com",
//     description: "Fullstack tutorial for GraphQL",
//   },
// ];

// let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // feed: () => links,
    feed: async (parent, args, context, info) => {
      return context.prisma.link.findMany();
    },
  },
  Mutation: {
    // 2
    // createLink: (parent, args) => {
    createLink: (parent, args, context, info) => {
      //   const link = {
      //     id: `link-${idCount++}`,
      //     description: args.description,
      //     url: args.url,
      //   };
      //   links.push(link);
      //   return link;
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
};

const prisma = new PrismaClient();
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
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
