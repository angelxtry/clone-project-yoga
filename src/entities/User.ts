import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', default: false })
  verifiedEmail: boolean;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  verifiedPhoneNumber: Boolean;

  @Column({ type: 'text' })
  profilePhoto: string;

  @Column({ type: 'boolean', default: false })
  isDriving: Boolean;

  @Column({ type: 'boolean', default: false })
  isRiding: Boolean;

  @Column({ type: 'boolean', default: false })
  isTaken: Boolean;

  @Column({ type: 'double precision', default: 0 })
  lastLng: number;

  @Column({ type: 'double precision', default: 0 })
  lastLat: number;

  @Column({ type: 'double precision', default: 0 })
  lastOrientation: number;

  @CreateDateColumn()
  createdAt: String;

  @UpdateDateColumn()
  updatedAt: String;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export default User;
