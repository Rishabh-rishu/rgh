import { Op } from "sequelize";
import ThirdParty from "../models/thirdParty.model.js";
import bcrypt from "bcryptjs";

class ThirdPartyService {
  async createThirdParty(payload) {
    // Generate unique 4-digit Third Party ID
    let thirdPartyId;

    while (true) {
      thirdPartyId = Math.floor(1000 + Math.random() * 9000).toString();

      const exists = await ThirdParty.findOne({
        where: { thirdPartyId },
      });

      if (!exists) {
        break;
      }
    }

    // Generate default password
    const password = `${payload.firstName}@123456`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const thirdParty = await ThirdParty.create({
      ...payload,
      thirdPartyId,
      password:hashedPassword,
    });

    return thirdParty;
  }

  async getAllThirdParties(query) {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      status,
    } = query;

    const offset = (Number(page) - 1) * Number(limit);

    const where = {
      isDeleted: false,
    };

    if (search) {
      where[Op.or] = [
        {
          firstName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          lastName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          serviceName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          thirdPartyId: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await ThirdParty.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
      thirdParties: rows,
    };
  }

  async getThirdPartyById(id) {
    const thirdParty = await ThirdParty.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!thirdParty) {
      throw new Error("Third party not found.");
    }

    return thirdParty;
  }

  async updateThirdParty(id, payload) {
    const thirdParty = await ThirdParty.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!thirdParty) {
      throw new Error("Third party not found.");
    }

    await thirdParty.update(payload);

    return thirdParty;
  }

  async updateThirdPartyStatus(id) {
    const thirdParty = await ThirdParty.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!thirdParty) {
      throw new Error("Third party not found.");
    }

    const status =
      thirdParty.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await thirdParty.update({ status });

    return {
      message: `Third party ${
        status === "ACTIVE" ? "activated" : "deactivated"
      } successfully.`,
      data: thirdParty,
    };
  }

  async deleteThirdParty(id) {
    const thirdParty = await ThirdParty.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!thirdParty) {
      throw new Error("Third party not found.");
    }

    await thirdParty.update({
      isDeleted: true,
    });

    return true;
  }
}

export default new ThirdPartyService();