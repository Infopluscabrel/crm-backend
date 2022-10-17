import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,
    OneToMany, OneToOne, DeleteDateColumn, UpdateDateColumn, CreateDateColumn
}
    from "typeorm"
import { MoyenPaiement, Status, TypeVente } from "./enums";
import { Facture } from "./facture";
import { LigneCommande } from "./ligneCommande";
import { User } from "./user";

@Entity("vente")
export class Vente {

    @PrimaryGeneratedColumn()
    id_vente!: number

    @OneToOne(() => Facture)
    @JoinColumn({ name: "facture_id" })
    fact!: Facture

    @Column({
        type: "enum",
        enum: Status,
        default: Status.INIT,
    })
    paiement_status!: Status

    @ManyToOne(() => User)
    @JoinColumn({ name: "from_user_id" })
    fromUser!: User

    @ManyToOne(() => User)
    @JoinColumn({ name: "to_user_id" })
    toUser!: User

    @Column({ type: "double" })
    total!: number

    @OneToMany(() => LigneCommande, (lc) => lc.vente, {
        cascade: true
    })
    lcoms!: LigneCommande[]

    @Column({
        type: "enum",
        enum: TypeVente,
        nullable: false
    })
    type!: TypeVente;

    @Column({
        type: "enum",
        enum: MoyenPaiement,
        nullable: false
    })
    moyen_paiement!: string

    @Column({ type: 'timestamp', nullable: true })
    date_paiement!: Date;

    @Column({ type: "int", default: () => '0' })
    validee!: number

    @Column({ type: 'timestamp', nullable: true })
    date_validation!: Date;

    @Column({ type: "int", default: () => '0' })
    livree!: number

    @Column({ type: 'timestamp', nullable: true })
    date_livraison!: Date;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    deleted_date!: Date
}