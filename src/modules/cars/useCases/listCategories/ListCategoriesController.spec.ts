import 'dotenv/config';
import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import { databaseConnect } from '@shared/infra/typeorm';

let connection: Connection;

describe('List Category Controller', () => {
  beforeAll(async () => {
    connection = await databaseConnect('localhost');

    await connection.query('DROP DATABASE rentapi_test');
    await connection.query('CREATE DATABASE rentapi_test');

    await connection.close();

    connection = await databaseConnect('localhost', 'rentapi_test');

    await connection.runMigrations();

    const id = uuidV4();

    const password = await hash('admin', 8);

    await connection
      .query(
        `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
    values('${id}', 'admin', 'admin@email.com', '${password}', true, 'now()', 'XXXXXX')`
      )
      .then(() => console.log('Admin user created!'));
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@email.com',
      password: 'admin',
    });

    await request(app)
      .post('/categories')
      .send({
        name: 'Category name',
        description: 'Category description',
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    const response = await request(app)
      .get('/categories')
      .send()
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    expect(response.status).toBe(200);

    expect(response.body.length).toBe(1);

    expect(response.body[0]).toHaveProperty('id');

    expect(response.body[0].name).toEqual('Category name');
  });
});
