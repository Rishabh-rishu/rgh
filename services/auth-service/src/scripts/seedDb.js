const bcrypt = require('bcryptjs');
const { Role, Permission, RolePermission, User, sequelize } = require('../models');

const roles = [
  { roleName: 'admin', description: 'Platform administrator' },
  { roleName: 'tenant', description: 'Property tenant/resident' },
  { roleName: 'security_guard', description: 'Security guard' },
  { roleName: 'service_team', description: 'Service team member' },
  { roleName: 'service_provider', description: 'External service provider' },
];

const permissions = [
  { permissionName: 'manage_users', module: 'auth' },
  { permissionName: 'manage_properties', module: 'property' },
  { permissionName: 'manage_bookings', module: 'booking' },
  { permissionName: 'manage_operations', module: 'operations' },
  { permissionName: 'manage_community', module: 'community' },
  { permissionName: 'view_notifications', module: 'notification' },
];

async function main() {
  await sequelize.sync();

  for (const role of roles) {
    await Role.findOrCreate({
      where: { roleName: role.roleName },
      defaults: role,
    });
  }

  for (const permission of permissions) {
    await Permission.findOrCreate({
      where: { permissionName: permission.permissionName },
      defaults: permission,
    });
  }

  const adminRole = await Role.findOne({ where: { roleName: 'admin' } });
  const allPermissions = await Permission.findAll();

  for (const permission of allPermissions) {
    await RolePermission.findOrCreate({
      where: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
      defaults: { roleId: adminRole.id, permissionId: permission.id },
    });
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await User.findOrCreate({
    where: { email: 'admin@rgh.com' },
    defaults: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@rgh.com',
      phone: '+966500000000',
      passwordHash,
      roleId: adminRole.id,
    },
  });

  console.log('Auth service seeded successfully');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
