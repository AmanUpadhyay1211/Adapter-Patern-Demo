import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface MetaAttributes {
  id: number;
  globalVersion: number;
}

export class Meta extends Model<MetaAttributes> implements MetaAttributes {
  declare id: number;
  declare globalVersion: number;
}

Meta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    globalVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "meta",
    timestamps: false,
  }
);

