module.exports = (sequelize, DataTypes) => {

  const Address = sequelize.define("Address", {
    street1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPermanent: {
      type: DataTypes.BOOLEAN,
      allowNull:false
    },
  });
  return Address;
};
