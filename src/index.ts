import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import microConfig from "./mikro-orm.config";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import "reflect-metadata";
// import { Post } from "./entities/Post";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  console.log("======= SQL Ready =========");

  // Create Post
  // const post = orm.em.create(Post, { title: "Hello World!" });
  // await orm.em.persistAndFlush(post);

  const app = express();
  const appServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false
    }),
    context : () => ({em : orm.em}),
  });
  
  await appServer.start()
  appServer.applyMiddleware({ app });

  // app.get('/', (_, res) => {
  //   res.send("Hello !!");

  // });
  app.listen(4000, () => {
    console.log("Server started on port 4000")

  })

  // List all posts
  // const posts = await orm.em.find(Post, {});
  // console.log(posts)
};

main().catch((err) => {
  console.error(err);
});
