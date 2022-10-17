import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "facture" })
export class Facture {

    @PrimaryGeneratedColumn()
    id_facture!: number

    @Column({ nullable: true })
    qrcode!: string

    @Column({ type: "double" })
    net_a_payer!: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
    updated_at!: Date
}