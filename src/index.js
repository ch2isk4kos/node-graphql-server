const { ApolloServer } = require("apollo-server");

// root fields Query, Mutation, Subscription define the available API operations

// 1: Defines GraphQL schema
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }
  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;
// '!' means that value cannot be null

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

// 2: implementation of GraphQL schema
const resolvers = {
  Query: {
    //   must return the same time as defined in typeDef
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};
// GraphQL queries resolve by invoking the resolver functions for the fields contained in the query.

// 3: Schemas get bundled and passed to the server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
