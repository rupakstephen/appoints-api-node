var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BarberSchema = new Schema({
  barberId: { type: String, required: true },
  displayName: { type: String, required: true },
  created: { type: Date, default: Date.now },
  description: {type: String, default: "A barber that works for Flipper's Barbershop"},
  imageUrl: {type: String, default: 'https://static.vecteezy.com/system/resources/thumbnails/002/495/418/small_2x/striped-barber-pole-free-vector.jpg'}
});

BarberSchema.index({ barberId: 1}, { unique: true });


BarberSchema.statics.findByBarberId = function (barberId, callback) {
  this.findOne({ barberId: barberId}, callback);
};

module.exports = mongoose.model('User', UserSchema);