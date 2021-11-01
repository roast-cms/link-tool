import * as mongoose from "mongoose";
import connection from "../utils/mongoose";

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  link: String,
  vendors: [
    {
      url: String,
      locale: String,
      value: Number,
      name: String,
    },
  ],
});

const Links = ({
  databaseURI,
  redisURL,
}: {
  databaseURI: string;
  redisURL: string;
}) =>
  connection({
    databaseURI,
    redisURL,
  }).model("Link", linkSchema);

export default Links;
