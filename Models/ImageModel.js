module.exports = (sequelize, DataTypes) => {

    const Image = sequelize.define("Image", {
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
    return Image;
  };
  