// 1: import prisma client
const { PrismaClient } = require("@prisma/client");

// 2: instantiate a new client
const prisma = new PrismaClient();

//3: send queries to the db
async function main() {
  const allLinks = await prisma.link.findMany();
  const newLink = await prisma.link.create({
    data: {
      url: "https://www.google.com",
      description: "it's google!",
    },
  });
  console.log(allLinks);
}

//4: invoke main function
main()
  .catch((e) => {
    throw e;
  })
  // 5: close db connections when script terminates
  .finally(async () => {
    await prisma.$disconnect();
  });
