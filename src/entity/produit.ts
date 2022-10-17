import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne,
    CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from "typeorm"
import { CatProd } from "./categorieProduit"

@Entity({ name: "produit" })
export class Produit {

    @PrimaryGeneratedColumn()
    id_produit!: number;

    @Column()
    nom_produit!: string;

    @Column({ length: 100, nullable: true })
    profil_produit!: string;

    @ManyToOne(() => CatProd, (cat_prod) => cat_prod.produits)
    cat_prod!: CatProd;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    delete_date!: Date;
}