const Accident = require("../model/accidentSchema");

const createAccidentController = async (req, res) => {
  try {
    const { phoneNumber, description, location, images } = req.body;

    const accident = await Accident.create({
      phoneNumber,
      description,
      location,
      images: images || [],
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Accident reported successfully",
      data: {
        id: accident._id,
        status: accident.status,
        createdAt: accident.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

module.exports = { createAccidentController };
