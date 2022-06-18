import { MikroORM, RequiredEntityData } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up;
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server is started on port 4000");
  });
};

main();
