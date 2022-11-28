const models = require("../Models");
const catchAsync = require("../Utils/catchAsync.js");
const AppError = require("../Utils/AppError");
const { Op } = require("sequelize");
const { Addresses, Images, Pdfs } = require("../Models");
UserModel = models.Users;
AddressModel = models.Addresses;
ImageModel = models.Images;

exports.createUserDetails = catchAsync(async (req, res, next) => {
 
  const data = {
    first_name: req?.body?.first_name,
    last_name: req?.body?.last_name,
    email: req?.body?.email,
    dob: req?.body?.dob,
  };

  const userAge = (dob) => {
    const todayDate = new Date().getTime();
    const birthDate = new Date(dob).getTime();
    const age = (todayDate - birthDate) / (1000 * 60 * 60 * 24 * 365);

    return age;
  };
  if (userAge(data.dob) < 18) {
    return next(new AppError("Age should be 18 or above 18 years", 403));
  }
  let perma;
  let doc;
  let userId;
  let file;
  let address = JSON.parse(req?.body?.address);
  let resis = {
    street1: address[0].residential.street1,
    street2: address[0].residential.street2,
    isPermanent: false,
  };

  if (req.body.isPermanent === "true") {
    if(!address[0].permanent.street1 || !address[0].permanent.street2){
return next(new AppError("Permanent address can not empty"));
    }
    perma = {
      street1: address[0].permanent.street1,
      street2: address[0].permanent.street2,
      isPermanent: true,
    };
  }
  let user = await UserModel.create(data);
  if (user) {
    userId = user.id;
    resis["UserId"] = userId;
  } else {
    return new next(new AppError("user Not created", 500));
  }

  if (req.body.isPermanent === "true") {
    perma["UserId"] = userId;
    doc = await AddressModel.bulkCreate([resis, perma]);
  } else {
    doc = await AddressModel.create(resis);
  }
  if (req?.files?.image && req?.files?.image[0]) {
    let imageData1 = [];
    req.files.image.forEach((el, i) => {
      imageData1.push({
        path: el.path.replace("public", ""),
        name: el.originalname,
        type: el.mimetype.split("/")[0],
        UserId: userId,
      });
    });
    file = await ImageModel.bulkCreate(imageData1);
  }
  if (req.files.pdf && req.files.pdf[0]) {
    let pdfData1 = [];
    req.files.pdf.forEach((el, i) => {
        pdfData1.push({
        path: el.path.replace("public", ""),
        name: el.originalname,
        type: el.mimetype.split("/")[0],
        UserId: userId,
      });
    });
    file = await Pdfs.bulkCreate(pdfData1);
  }

  res
    .status(200)
    .json({ message: "User created Successfully", doc, user, file });
});

exports.getAllUsersDetails = catchAsync(async (req, res, next) => {
  let doc;

  doc = await UserModel.findAndCountAll({
    attributes: ["id", "first_name", "last_name", "email", "dob"],
    include: [
      {
        model: Addresses,
        as: "Address",
      },
      {
        model: Images,
        as: "images",
      },
      {
        model: Pdfs,
        as: "pdf",
      },
    ],
  });
  if (!doc) {
    return next(new AppError("Result not found", 404));
  }
  res.status(200).send({ msg: "success", data: doc });
});
