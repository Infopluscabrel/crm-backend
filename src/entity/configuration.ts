import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "configuration" })
export class Configuration {

    @PrimaryGeneratedColumn()
    id_conf!: number

    @Column({ type: "float" })
    tva!: number

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date
}