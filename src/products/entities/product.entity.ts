import {BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {v4 as uuid} from "uuid";
import {ApiProperty} from "@nestjs/swagger";
import {ProductImage} from "./product-image.entity";
import {User} from "../../auth/entities/user.entity";

@Entity({
    name: 'products'
})
export class Product {
    @ApiProperty({
        example: uuid(),
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ApiProperty({
        example: 'T-Shirt Tesla',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;
    @ApiProperty({
        example: 0,
        description: 'Price product'
    })
    @Column('float', {
        default: 0
    })
    price: number
    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string
    @ApiProperty()
    @Column({
        type: 'text',
        unique: true
    })
    slug: string
    @ApiProperty()
    @Column({
        type: "int",
        default: 0
    })
    stock: number
    @ApiProperty()
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[]
    @ApiProperty()
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[]
    @ApiProperty()
    @Column({
        type: 'text',
        default: 'N/A'
    })
    gender: string;

    @OneToMany(() => ProductImage, (images) => images.product, {
        cascade: true,eager: true
    })
    images: ProductImage[]

    @ManyToOne(
        () => User, (user) => user.product,
        {eager: true}
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        if (this.slug){
            this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
        }
    }
}