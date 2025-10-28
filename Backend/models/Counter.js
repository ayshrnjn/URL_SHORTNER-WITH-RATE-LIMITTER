const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

counterSchema.statics.getNextSequence = function(name) {
    return this.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
};

module.exports = mongoose.model('Counter', counterSchema);
