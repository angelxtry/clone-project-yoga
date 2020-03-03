import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Column,
  OneToOne,
} from 'typeorm';
import Message from './Message';
import User from './User';
import Ride from './Ride';

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToMany(() => User, (user) => user.chat)
  participants: User[];

  @Column({ nullable: true })
  passengerId: number;

  @ManyToOne(() => User, (user) => user.chatAsPassenger)
  passenger: User;

  @Column({ nullable: true })
  driverId: number;

  @ManyToOne(() => User, (user) => user.chatAsDriver)
  driver: User;

  @Column({ nullable: true })
  rideId: number;

  @OneToOne(() => Ride, (ride) => ride.chat, { nullable: true })
  ride: Ride;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
export default Chat;
