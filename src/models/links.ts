import * as mongoose from "mongoose";
import connection from "../utils/mongoose";

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  archived: Boolean,
  link: String,
  tags: Array,
  title: String,
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
