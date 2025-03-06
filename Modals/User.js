// const mongoose = require('mongoose');
// const {Schema} = mongoose;

// const UserSchema = new Schema({
//     name : {
//         type : String,
//         required : true
//     },
//     location:{
//         type : String,
//         required : true
//     },
//     email :{
//         type : String,
//         required : true,
//     },
//     password :{
//         type : String,
//         required : true
//     },
//     date :{
//         type : Date,
//         default : Date.now
//     }
// })

// module.exports = mongoose.model('User', UserSchema);



const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
});

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: AddressSchema, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
