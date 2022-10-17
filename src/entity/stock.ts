import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne,
    JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne
} from "typeorm"
import { Unite } from "./enums";
import { Produit } from "./produit";
import { User } from "./user"

@Entity({ name: "stock" })
export class Stock {

    @PrimaryGeneratedColumn()
    id_stock!: number;

    @OneToOne(() => Produit)
    @JoinColumn({ name: "prod_id" })
    produit!: Produit

    @Column({ type: "double" })
    prix_unite!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "proprietaire" })
    user!: User

    @Column({ type: "int" })
    quantite!: number;

    @Column({
        type: "enum",
        enum: Unite,
        nullable: false
    })
    unit!: Unite;

    @Column({ default: false })
    validation!: boolean

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    delete_date!: Date;
}