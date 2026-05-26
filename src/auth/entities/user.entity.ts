import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    type: 'text',
    select: false,
  })
  password: string;

  @Column({
    type: 'text'
  })
  fullName: string;

  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[]

  @BeforeInsert()
  prepareEmailInsert(){
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  prepareEmailUpdate(){
    this.prepareEmailInsert()
  }
}
