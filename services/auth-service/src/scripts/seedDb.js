import bcrypt from "bcryptjs";
import sequelize from "../config/database.js";
import User from "../models/auth.model.js";

async function main() {
  await sequelize.sync();

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await User.findOrCreate({
    where: { email: "admin@rgh.com" },
    defaults: {
      firstName: "System",
      lastName: "Admin",
      email: "admin@rgh.com",
      phone: "+966500000000",
      passwordHash,
      role: "admin",
      isVerified: true,
      isBlocked: false,
    },
  });

  await User.findOrCreate({
    where: { email: "tenant@rgh.com" },
    defaults: {
      firstName: "John",
      lastName: "Doe",
      email: "tenant@rgh.com",
      phone: "+966500000001",
      passwordHash,
      role: "tenant",
      isVerified: true,
      isBlocked: false,
    },
  });

  await User.findOrCreate({
    where: { email: "guard@rgh.com" },
    defaults: {
      firstName: "Security",
      lastName: "Guard",
      email: "guard@rgh.com",
      phone: "+966500000002",
      passwordHash,
      role: "security_guard",
      isVerified: true,
      isBlocked: false,
    },
  });

  console.log("Users seeded successfully");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });