import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    excerpt: string;

    @Column()
    description: string;

    @Column()
    created_at: string;

    @Column()
    thumbnail: string;

    @Column()
    tag: string;
}
