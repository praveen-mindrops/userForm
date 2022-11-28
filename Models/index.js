const server = require("../server");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(server.DB, server.USER, server.PASSWORD, {
  host: server.HOST,
  dialect: server.dialect,
  pool: {
    max: server.pool.max,
    min: server.pool.min,
    acquire: server.pool.acquire,
    idle: server.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Database in connected");
  })
  .catch((err) => {
    console.log("Failed to connect" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./UserModel")(sequelize, Sequelize);
db.Addresses=require("./AddressModel")(sequelize,Sequelize);
db.Images=require("./ImageModel")(sequelize,Sequelize);
db.Pdfs=require("./PdfModel")(sequelize,Sequelize);



db.sequelize.sync({force:false}).then(() => {
  console.log("yes re-sync done!");
});
db.Users.hasMany(db.Addresses,{foriegnKey:'userId',as:"Address"});
db.Addresses.belongsTo(db.Users);
db.Users.hasMany(db.Images,{foriegnKey:'userId',as:"images"});
db.Images.belongsTo(db.Users);
db.Users.hasMany(db.Pdfs,{foriegnKey:'userId',as:"pdf"});
db.Pdfs.belongsTo(db.Users);
module.exports = db;
