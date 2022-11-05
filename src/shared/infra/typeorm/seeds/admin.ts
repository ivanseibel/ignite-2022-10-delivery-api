import { hash } from 'bcrypt';
import { getConnection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

async function createAdminUser() {
  const id = uuidV4();
  const password = await hash('admin', 8);

  const connection = getConnection();

  await connection
    .query(
      `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
    values('${id}', 'admin', 'admin@email.com', '${password}', true, 'now()', 'XXXXXX')`
    )
    .then(() => console.log('Admin user created!'));

  await connection.close();
}

export { createAdminUser };
