import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class CoreEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    public createdAt!: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    public updatedAt!: Date;
}
