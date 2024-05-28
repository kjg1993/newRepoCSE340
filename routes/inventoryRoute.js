// Needed Resources
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const { handleErrors, } = require("../utilities");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  handleErrors(invController.buildByClassificationId)
);


router.get(
  "/", 
  utilities.checkAuthorization,
  handleErrors(invController.buildManagement)
)

//Route to build inventory by vehicle view
router.get("/detail/:invId", handleErrors(invController.buildByInvId));

// Build edit vehicle information view
router.get("/edit/:inv_id", utilities.checkAuthorization, handleErrors(invController.buildVehicleEdit));

// Build inventory management table inventory view
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Ruta para construir el índice de inventario
router.get("/", handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/addclass", utilities.checkAuthorization, handleErrors(invController.buildAddclass));

// Route to build add vehicle view
router.get("/addvehicle", utilities.checkAuthorization, handleErrors(invController.buildAddvehicle));

// Process the new classification data
router.post(
  "/addclass",
  utilities.checkAuthorization,
  invValidate.classRules(),
  invValidate.checkClassData,
  handleErrors(invController.addClass)
);

// Process the new vehicle data
router.post(
  "/addvehicle",
  invValidate.vehicleRules(),
  invValidate.checkVehicleData,
  handleErrors(invController.addVehicle)
);

// Process the update vehicle data
router.post(
  "/update",
  invValidate.vehicleRules(),
  invValidate.checkVehicleData,
  handleErrors(invController.updateVehicle)
);

// Build vehicle deletion confirmation view
router.get("/delete/:inv_id", utilities.checkAuthorization, handleErrors(invController.buildVehicleDeleteConfirm))

// Post route /delete
router.post(
  "/delete",
  utilities.checkAuthorization, 
  handleErrors(invController.deleteVehicle)
)

// Route to show the 500 error page
router.get("/broken", handleErrors(invController.buildBrokenPage));

module.exports = router;
