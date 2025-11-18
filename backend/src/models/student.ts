import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import type { StudentAttributes } from "../types/student";

export class Student extends Model<StudentAttributes> implements StudentAttributes {
  declare id: string;
  declare rollNumber: string;
  declare name: string;
  declare bloodGroup: string;
  declare class: string;
  declare section: string;
  declare phone: string;
  declare email: string;
  declare attendance: number;
  declare lastUpdated: string;
}

Student.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    attendance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    lastUpdated: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "students",
    timestamps: false,
  }
);

