// Needed Resources 
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const { handleErrors } = require('../utilities');


// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));

//Route to build inventory by vehicle view
router.get('/detail/:invId', handleErrors(invController.buildByInvId));

// Route to show the 500 error page 
router.get('/broken', handleErrors(invController.buildBrokenPage));

module.exports = router;

