import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @ManyToOne(() => User)
  public user: User;

  @Column()
  public userId: string

  @Column()
  public name: string;

  @Column()
  public address: string;

  @Column("point")
  public coordinates: string;

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
