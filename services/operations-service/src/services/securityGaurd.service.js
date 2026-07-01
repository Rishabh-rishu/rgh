import SecurityGuard from "../models/securityGaurd.model.js";

class SecurityGuardService {
  async create(data) {
    return await SecurityGuard.create(data);
  }

  async getAll({ page = 1, limit = 10 }) {
    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const { rows, count } = await SecurityGuard.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }

  async getById(id) {
    return await SecurityGuard.findByPk(id);
  }

  async update(id, data) {
    const guard = await SecurityGuard.findByPk(id);

    if (!guard) throw new Error("Security Guard not found");

    await guard.update(data);

    return guard;
  }

  async delete(id) {
    const guard = await SecurityGuard.findByPk(id);

    if (!guard) throw new Error("Security Guard not found");

    await guard.destroy();

    return true;
  }
}

export default new SecurityGuardService();