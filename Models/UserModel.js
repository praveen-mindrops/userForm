module.exports=(sequelize,DataTypes)=>{
    const User=sequelize.define("User",{
        first_name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        last_name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique: {
              arg: true,
              msg: 'This email is already registered'
          },
            validate: {
              isEmail: {
                msg: "Please enter a valid email address",
              }
            }
            
        },
          dob: {
            type: DataTypes.DATE,
            allowNull:false,
            
          },
       
      
    })
    return User;
}