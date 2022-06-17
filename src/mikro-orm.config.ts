import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  dbName: "rgpn",
  type: "postgresql",
  debug: !__prod__,
  entities: [Post],
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
