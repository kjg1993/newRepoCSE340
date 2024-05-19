// Needed Resources 
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const { handleErrors } = require('../utilities');
const invValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));

//Route to build inventory by vehicle view
router.get('/detail/:invId', handleErrors(invController.buildByInvId));

// MANAGEMENT ROUTES ** NeEdS tO Be ChAnGeD **
// Route to build inventory index
router.get("/", handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/addclass", handleErrors(invController.buildAddclass));

// Process the new classification data
router.post(
  "/addclass",
  invValidate.classRules(),
  invValidate.checkClassData,
  handleErrors(invController.addClass)
)

// Route to build add vehicle view
router.get("/addvehicle", handleErrors(invController.buildAddvehicle));

// Process the new vehicle data
router.post(
  "/addvehicle",
  invValidate.vehicleRules(),
  invValidate.checkVehicleData,
  handleErrors(invController.addVehicle),
)

// Route to show the 500 error page 
router.get('/broken', handleErrors(invController.buildBrokenPage));



module.exports = router;

