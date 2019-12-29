import mongoose from "mongoose";
import response from "../helpers/response";

const Item = mongoose.model("Item");
const User = mongoose.model("User");

exports.list = async function(req, res) {
  if (req.currentUser) {
    const everyItem = await Item.find({}).exec();
    const items = everyItem.map(e => {
      const itemOwner = new String(e._doc.owner);
      const currentUser = new String(req.currentUser._id);
      return {
        ...e._doc,
        owner: itemOwner.valueOf() == currentUser.valueOf()
      };
    });
    res.render("items", {
      items
    });
  } else {
    res.redirect("/");
  }
};

exports.create = async function(req, res) {
  const item = new Item({ name: req.body.name });
  const user = await User.findById(req.currentUser._id);
  item.owner = user;
  item.save(function(err, item) {
    if (err) return response.sendBadRequest(res, err);

    user.items = user.items.concat([item]);
    user.save(function(err, user) {
      if (err) return response.sendBadRequest(res, err);
      res.redirect("/items");
    });
  });
};

exports.read = function(req, res) {
  Item.remove({ _id: req.params.id }, function(err, item) {
    if (err) return response.sendNotFound(res);
    res.redirect("/items");
  });
};

exports.update = function(req, res) {
  Item.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    function(err, item) {
      if (err) return response.sendBadRequest(res, err);
      if (!req.currentUser.canEdit(item)) return response.sendForbidden(res);
      res.json(item);
    }
  );
};

exports.delete = function(req, res) {
  Item.remove({ _id: req.params.id }, function(err, item) {
    if (err) return response.sendNotFound(res);
    res.redirect("/");
  });
};
