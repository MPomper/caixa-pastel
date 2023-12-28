const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
mongoose.pluralize(null);

const UsuarioDB = mongoose.connection.useDb('Usuarios');

const User = new mongoose.Schema({
    login: String,
    nome:  String,
    senha: String,
    email: String,
    admin: Boolean
});

User.pre("save", function (next) {
    const user = this
  
    if (this.isModified("senha") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.senha, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.senha = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })

  
  User.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.senha, function(error, isMatch) {
      if (error) {
        return callback(error)
      } else {
        callback(null, isMatch)
      }
    })
  }
     
module.exports = UsuarioDB.model('User', User)