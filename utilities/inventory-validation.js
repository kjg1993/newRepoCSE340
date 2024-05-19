const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add Class Validation Rules
 * ********************************* */
validate.classRules = () => {
  return [
    body("classification_name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be longer than 3 characters")
    .isAlpha()
    .withMessage("Please use only letters in the name"),
  ]
}

/* ******************************
 * Check class data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/addclass", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  Add Class Validation Rules
 * ********************************* */
validate.vehicleRules = () => {
  return [
    body("inv_make")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Make must be longer than 3 characters"),

    body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be longer than 3 characters"),

    body("inv_year")
    .trim()
    .isNumeric({ no_symbols: true })
    .withMessage("Year must be digits only")
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be 4 digits"),

    body("inv_description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a description"),

    body("inv_image")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide an image path"),

    body("inv_thumbnail")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide an thumbnail path"),

    body("inv_price")
    .trim()
    .isNumeric()
    .withMessage("Please input valid price"),

    body("inv_miles")
    .trim()
    .isNumeric({ no_symbols: true })
    .withMessage("Please input miles without commas or decimals"),

    body("inv_color")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a vehicle color"),
  ]
}

/* ******************************
 * Check class data and return errors or continue to registration
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classSelect = await utilities.getClassSelect()
    res.render("./inventory/addvehicle", {
      errors,
      title: "Add Vehicle",
      nav,
      classSelect,
      // classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}




module.exports = validate