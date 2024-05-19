const utilities = require("../utilities/index");
const baseController = {};

baseController.buildHome = async function(req, res) {
  const nav = await utilities.getNav();
  req.flash("notice", "This is a flash message."); // Set the flash message here
  res.render("index", { title: "Home", nav });
  // res.render("index", {title: "Home", nav, errors: null,})
};

module.exports = baseController;
