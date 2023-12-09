import {
  Column,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({ tableName: "invoice_item", timestamps: false })
export class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;

  @Column({ allowNull: false })
  declare invoiceId: number;
}
