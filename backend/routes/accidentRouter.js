const express = require("express");
const accidentValidation = require("../middlewares/accidentValidation");
const { createAccidentController } = require("../controllers/accidentController");

const accidentRouter = express.Router();

accidentRouter.post("/report", accidentValidation, createAccidentController);

module.exports = accidentRouter;
