import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class RequestLog {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 512 })
  url: string;

  @Column({ type: 'enum', enum: ['ERROR', 'REQUEST', 'RESPONSE'] })
  type: string;

  @Column({ type: 'enum', enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
  method: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'text' })
  data: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
