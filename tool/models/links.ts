const mongoose = require("mongoose");
const connection = require("../utils/mongoose");

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
