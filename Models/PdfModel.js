module.exports = (sequelize, DataTypes) => {

    const Pdf = sequelize.define("Pdf", {
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
    });
    return Pdf;
  };