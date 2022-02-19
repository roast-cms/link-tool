import * as mongoose from "mongoose";
import connection from "../utils/mongoose";

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  link: String,
  tags: Array,
  vendors: [
    {
      url: String,
      locale: String,
      value: Number,
      name: String,
    },
  ],
});

const Links = connection.model("Link", linkSchema);

export default Links;
