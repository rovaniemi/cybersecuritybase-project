import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item"
    }
  ]
});

UserSchema.set("toJSON", {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

UserSchema.methods.getTokenData = function() {
  return {
    id: this.id,
    email: this.email
  };
};

UserSchema.methods.verifyPassword = function(candidatePassword, callback) {
  callback(null, candidatePassword == this.password);
};

UserSchema.methods.equals = function(user) {
  return this._id == user._id;
};

UserSchema.methods.canRead = function(object) {
  return (
    this.equals(object) ||
    (object.owner && object.owner == this.id) ||
    this.role == "admin"
  );
};

UserSchema.methods.canEdit = function(object) {
  return this.canRead(object); // can be extended later
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
