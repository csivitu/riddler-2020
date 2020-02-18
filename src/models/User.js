const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    ip: {
        type: String,
        required: true,
    },
    mainTracksProgress: {
        type: [String],
        required: true,
        default: ['A0', 'B0', 'C0'],
    },
    bonusTrack: {
        type: [String],
    },
    score: {
        type: Number,
        required: true,
        default: 0,
    },
    currentRiddle: {
        type: String,
    },
});

module.exports = mongoose.model('User', userSchema);
