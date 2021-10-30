import * as mongoose from "mongoose";
import connection from "../utils/mongoose";

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  key: String,
  links: [
    {
      link: String,
    },
  ],
});

const Link = connection.model("Link", linkSchema);
export default Link;
