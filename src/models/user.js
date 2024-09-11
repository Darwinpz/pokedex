const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({

    nombre: { type: String, required: true },
    puntaje: { type: Number, default: 0 },
    rol: {type: String, required:true},
    fecha: { type: Date, default: Date.now }

});


module.exports = mongoose.model('User', UserSchema);