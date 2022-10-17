import { IsInt, Length } from "class-validator";
import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn
} from "typeorm"

@Entity({ name: "role" })
export class Role {

    @PrimaryGeneratedColumn()
    id_role!: number

    @Column("varchar", { length: 30 })
    @Length(10, 30)
    libelle!: string

    @Column({ type: "int" })
    @IsInt()
    niveau!: number

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    delete_date!: Date
}