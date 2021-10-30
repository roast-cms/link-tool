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
    },
  ],
});

const Links = connection.model("Link", linkSchema);
export default Links;
