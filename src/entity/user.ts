import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn,
    CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from "typeorm"
import { Role } from "./role"
import { IsDate, IsEmail, IsInt, length, Length } from "class-validator"

@Entity("user")
export class User {

    @PrimaryGeneratedColumn()
    id_user!: number

    @Column("varchar", { length: 50 })
    @Length(3, 50)
    nom!: string

    @Column("varchar", { length: 50 })
    @Length(0, 50)
    prenom!: string

    @Column("varchar", { length: 50, unique: true })
    @Length(3, 50)
    login!: string

    @Column("varchar", { unique: true })
    @IsEmail()
    email!: string

    @Column("varchar", { unique: true })
    password!: string

    @Column({ type: 'datetime', nullable: true })
    //@IsDate()
    date_naissance!: Date;

    @Column({ default: false })
    //@IsInt()
    est_limite!: boolean

    @Column({ nullable: true })
    montant_limite!: boolean

    @Column("varchar", { length: 12, nullable: false })
    telephone!: string

    @Column({ nullable: true })
    adresse!: string

    @Column({ nullable: true })
    image!: string

    @Column({ nullable: true })
    cni_recto!: string

    @Column({ nullable: true })
    cni_verso!: string

    @Column("varchar", { length: 100, nullable: true })
    offre!: string

    @Column("varchar", { nullable: true })
    detail_offre!: string

    @OneToOne(() => Role)
    @JoinColumn()
    role!: Role

    @Column({ nullable: true })
    engagement!: string

    @Column({ nullable: true })
    etat_stock!: string

    @OneToOne(() => User)
    @JoinColumn()
    parrain!: User

    @Column({ nullable: true })
    //@IsInt()
    etat_signature!: boolean

    @Column({ type: 'datetime', nullable: true })
    //@IsDate()
    date_signature!: Date

    @Column({ nullable: true })
    //@IsInt()
    validation!: boolean

    @Column("varchar", { nullable: true })
    patente!: string

    @Column("varchar", { nullable: true })
    nui!: string

    @Column("varchar", { nullable: true })
    etat_validation!: string

    @Column({ type: 'datetime', nullable: true })
    //@IsDate()
    date_validation!: Date

    @Column({ type: 'datetime', nullable: true })
    //@IsDate()
    date_expiration!: Date

    @Column("float", { nullable: true })
    precompte!: number

    @Column("float", { nullable: true })
    ristorne!: number

    /* @Column()
    token!: string

    @Column()
    refresh_token!: string*/
    @Column({ type: 'datetime', nullable: true })
    //@IsDate()
    date_connexion!: Date

    @Column("varchar", { nullable: true })
    IdOauth!: string

    @Column({ nullable: true })
    mode_login!: string

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    delet_date!: Date
}