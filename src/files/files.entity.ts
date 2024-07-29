import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../app/entities/core.entity';

@Entity({ name: 'files' })
export class File extends CoreEntity {
    @Column({
        type: 'varchar',
    })
    name!: string;

    @Column({
        type: 'varchar',
    })
    description!: string;

    @Column({
        type: 'integer',
        nullable: true,
    })
    downloads!: number;

    @Column({
        type: 'integer',
    })
    size!: number;

    @Column({
        type: 'varchar',
    })
    extention!: string;

    @Column({
        type: 'varchar',
    })
    aws_key!: string;
}
