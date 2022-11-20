import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('users')
class User {
  constructor() {
    this.id = uuidV4();
    this.is_admin = false;
    this.avatar = null;
    this.created_at = new Date();
  }

  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  driver_license: string;

  @Column()
  is_admin: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  avatar: string;

  @Expose({ name: 'avatar_url' })
  avatar_url(): string {
    if (!this.avatar) {
      return null;
    }

    return process.env.STORAGE_PROVIDER === 'local'
      ? `${process.env.APP_API_URL}/avatar/${this.avatar}`
      : `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
  }
}

export { User };
