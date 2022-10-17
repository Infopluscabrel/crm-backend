import { Length } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm"
import { Produit } from "./produit";

@Entity({ name: "categorie_produit" })
export class CatProd {

    @PrimaryGeneratedColumn()
    id_categorie!: number

    @Column("varchar", { length: 200 })
    @Length(5, 200)
    libelle!: string

    @OneToMany(() => Produit, (produit) => produit.cat_prod)
    produits!: Produit[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
    updated_at!: Date

    @DeleteDateColumn()
    delete_date!: Date
}