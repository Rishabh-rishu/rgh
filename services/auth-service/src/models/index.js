import sequelize from "../config/database.js";
import User from "./auth.model.js";
import Tenant from "./tenant.model.js";
import SecurityGuard from "./security.gaurd.model.js";

export {
  sequelize,
  User,
  Tenant,
  SecurityGuard
};
