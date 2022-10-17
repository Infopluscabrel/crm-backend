import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne,
    CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from "typeorm"
import { Unite } from "./enums";
import { Produit } from "./produit";
import { Stock } from "./stock";
import { Vente } from "./vente";

@Entity({ name: "ligne_commande" })
export class LigneCommande {

    @PrimaryGeneratedColumn()
    id_lc!: number

    @OneToOne(() => Produit)
    @JoinColumn({ name: "prod_id" })
    produit!: Produit

    @OneToOne(() => Stock)
    @JoinColumn({ name: "stock_id" })
    stock!: Stock

    @ManyToOne(() => Vente, (vente) => vente.lcoms, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: "vente_id" })
    vente!: Vente

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

    @DeleteDateColumn()
    delete_date!: Date
}