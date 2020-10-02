const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// Define collection and schema
let Employee = new Schema({
   firstName: {
      type: String, required: true
   },
  lastName: {
    type: String, required: true
  },
   email: {
      type: String,unique: true, required: true
   },
   phoneNumber: {
     type: Number,
     validate: {
       validator: function(v) {
         return /^\d{10}$/.test(v);
       },
       message: '{VALUE} is not a valid 10 digit number!'
     }
   },
    password:{
       type: String,
        required: true
    },
    role:{
       type: String,
        required: true
    }
});
Employee.plugin(uniqueValidator);
module.exports = mongoose.model('Employee', Employee)
