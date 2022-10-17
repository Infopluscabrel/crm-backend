import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne,
    JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn
} from "typeorm"
import { Unite } from "./enums";
import { Stock } from "./stock";
import { User } from "./user";

@Entity({ name: "entree_stock" })
export class EntreeStock {

    @PrimaryGeneratedColumn()
    id_es!: number

    @OneToOne(() => Stock, {
        eager: true,
        cascade: true,
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "stock_id" })
    stock!: Stock

    @ManyToOne(() => User)
    @JoinColumn({ name: "proprietaire" })
    proprietaire!: User

    @Column({ type: "int" })
    quantite!: number

    @Column({
        type: "enum",
        enum: Unite,
        nullable: false
    })
    unit!: Unite;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date
}