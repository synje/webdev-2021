import mongoose from "mongoose";
const Schema = mongoose.Schema

/**
 * Scheme for artist, used in songSchema
 */
const ArtistScheme = new Schema({
    name1: {
        type: String,
        required: false
    },
    name2: {
        type: String
    }
})

/**
 * Scheme for song, exported
 */
const songSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: false
    },
    artist:{
        type: [ArtistScheme],
        required: false
    },
    album:{
        type: String,
        required: false
    },
    year_released:{
        type: Number,
        required: false
    }
});


export default mongoose.model('Song', songSchema);