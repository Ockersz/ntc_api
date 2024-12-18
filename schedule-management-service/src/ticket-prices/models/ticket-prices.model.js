const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * @swagger
 * components:
 *  schemas:
 *    TicketPrices:
 *      type: object
 *      required:
 *        - type
 *        - price
 *        - status
 *      properties:
 *        priceId:
 *          type: integer
 *          description: The unique identifier for a ticket price
 *        type:
 *          type: string
 *          description: The type of ticket price
 *        price:
 *          type: decimal
 *          description: The price of the ticket
 *        status:
 *          type: integer
 *          description: The status of the ticket price
 */

const TicketPrices = sequelize.define(
  "ticket_prices",
  {
    priceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("luxury", "semi-luxury", "normal"), // 1: Active, 0: Cancelled, 2: Maintenance
      allowNull: false,
      defaultValue: "normal",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = TicketPrices;
