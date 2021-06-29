const { ApolloServer } = require("apollo-server");

// 1: Defines GraphQL schema
const typeDefs = `
  type Query {
    info: String!
  }
`;
// '!' means that value cannot be null

// 2: implementation of GraphQL schema
const resolvers = {
  Query: {
    //   must return the same time as defined in typeDef
    info: () => `This is the API of a Hackernews Clone`,
  },
};

// 3: Schemas get bundled and passed to the server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
