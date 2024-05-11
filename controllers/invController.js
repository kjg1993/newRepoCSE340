const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();

    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    res.status(500).send("Internal Server Error"); // or handle error in a meaningful way
  }
};

/** *********************************
 * Buildinventory by single vehicle view
 *
 * ************************************/
// Define a function to handle building inventory by inventory ID
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const grid = await utilities.buildVehicleGrid(data);
  let nav = await utilities.getNav();
  const vehicleMake = data[0].inv_make;
  const vehicleModel = data[0].inv_model;
  const vehicleYear = data[0].inv_year;
  // view -- vehicle.ejs
  res.render("./inventory/vehicle", {
    title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
    nav,
    grid,
  });
};

/* ***************************
 *  Build intentional error view
 * ************************** */
invCont.buildBrokenPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  // view -- broken.ejs
  res.render("./inventory/broken", {
    title: 'Oops, error',
    nav,
  })
}


module.exports = invCont;
