import { Op } from "sequelize";
import Amenity from "../models/amenity.model.js";

class AmenityService {
  async createAmenity(payload) {
    return await Amenity.create(payload);
  }

  async getAllAmenities({
    page = 1,
    limit = 10,
    search = "",
    status,
  }) {
    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          amenityNameEn: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          amenityNameAr: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Amenity.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      amenities: rows,
    };
  }

  async getAmenityById(id) {
    const amenity = await Amenity.findByPk(id);

    if (!amenity) {
      throw new Error("Amenity not found.");
    }

    return amenity;
  }

  async updateAmenity(id, payload) {
    const amenity = await Amenity.findByPk(id);

    if (!amenity) {
      throw new Error("Amenity not found.");
    }

    await amenity.update(payload);

    return amenity;
  }

  async updateAmenityStatus(id) {
    const amenity = await Amenity.findByPk(id);

    if (!amenity) {
      throw new Error("Amenity not found.");
    }

    const newStatus =
      amenity.status === "Active" ? "Inactive" : "Active";

    await amenity.update({
      status: newStatus,
    });

    return amenity;
  }

  async deleteAmenity(id) {
    const amenity = await Amenity.findByPk(id);

    if (!amenity) {
      throw new Error("Amenity not found.");
    }

    await amenity.destroy();

    return true;
  }
}

export default new AmenityService();