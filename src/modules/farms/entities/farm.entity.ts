import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export class Base {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public userId: string

  @Column()
  public name: string;

  @Column()
  public address: string;

  @Column({nullable: true})
  public yield: number

  @Column({nullable: true})
  public size: number

  @Column("boolean", {default: false})
  public deleted: boolean

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}

@Entity()
export class Farm extends Base{
  @ManyToOne(() => User)
  public user: User;

  @Column("point")
  public coordinates: string | object
}

export class FarmWithDistance extends Base{

  public distance?: null | {
    text: string,
    value: number
  }

  public user? : {
    email: string
  }

  public owner? : string

  public coordinates?: {
    x: number,
    y: number
  }

}
