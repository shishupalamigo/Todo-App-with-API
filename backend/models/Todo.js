var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    isDone: {type: Boolean, default:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
