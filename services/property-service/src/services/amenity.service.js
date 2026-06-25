import Amenity from "../models/amenity.model.js";

class AmenityService {
  async createAmenity(data) {
    return await Amenity.create(data);
  }

  async getAmenityById(id) {
    return await Amenity.findByPk(id);
  }

  async getAllAmenities() {
    return await Amenity.findAll({
      where: {
        isDeleted: false,
      },
    });
  }

  async updateAmenity(id, data) {
    const amenity = await Amenity.findByPk(id);

    if (!amenity) {
      throw new Error("Amenity not found");
    }

    await amenity.update(data);

    return amenity;
  }

  async deleteAmenity(id) {
    const amenity = await Amenity.findByPk(id);

    if (!amenity) {
      throw new Error("Amenity not found");
    }

    await amenity.update({
      isDeleted: true,
    });

    return true;
  }
}

export default new AmenityService();