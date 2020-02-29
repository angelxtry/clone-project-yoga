import * as bcrypt from 'bcrypt';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import Chat from './Chat';
import Message from './Message';
import Ride from './Ride';

const BCRYPT_ROUND = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @IsEmail()
  email: string | null;

  @Column({ type: 'boolean', default: false })
  verifiedEmail: boolean;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: 'text', nullable: true })
  fbId: string;

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

  @ManyToOne(() => Chat, (chat) => chat.participants)
  chat: Chat;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => Ride, (ride) => ride.passenger)
  rideAsPassenger: Ride[];

  @OneToMany(() => Ride, (ride) => ride.driver)
  rideAsDriver: Ride[];

  @CreateDateColumn()
  createdAt: String;

  @UpdateDateColumn()
  updatedAt: String;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUND);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export default User;
