import amenityService from "../services/amenity.service.js";

 const createAmenity = async (req, res) => {
  try {
    const amenity = await amenityService.createAmenity(req.body);

    return res.status(201).json({
      success: true,
      message: "Amenity created successfully",
      data: amenity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const getAmenity = async (req, res) => {
  try {
    const amenity = await amenityService.getAmenityById(req.params.id);

    return res.status(200).json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const getAllAmenities = async (req, res) => {
  try {
    const amenities = await amenityService.getAllAmenities();

    return res.status(200).json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const   updateAmenity = async (req, res) => {
  try {
    const amenity = await amenityService.updateAmenity(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Amenity updated successfully",
      data: amenity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const deleteAmenity = async (req, res) => {
  try {
    await amenityService.deleteAmenity(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Amenity deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export default {
    createAmenity,
    getAmenity,
    getAllAmenities,
    updateAmenity,
    deleteAmenity
}
