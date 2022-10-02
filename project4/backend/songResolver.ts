import Song from "./models/songs"

/**
 * Takes in a song element and structures the data appropriately 
 * @param song 
 * @returns data with correct structure
 */
const transformSong = (song: any) => {
    return {
        ...song._doc,
        artist: song._doc.artist
    }
}
/**
 * Exports all resolver functions
 */
export default {
    /**
     * Shows all songs in the database
     * @param args 
     * @returns all songs transformed
     */
    songs: async (args: any) => {
        const songs = await Song.find();
        try {
            return songs.map(song => {
                return transformSong(song)
            })
            
        } catch (error) {
            throw error
        }
    },
    /**
     * Resolver to add song to database. Takes in arguments for title, duration, album, year released and artist. 
     * Saves the new song to database
     * @param args 
     * @returns transformed newly added song
     */
    addSong: async (args: any) => {
        try { 
            const song = new Song({
                title: args.songInput.title,
                duration: +args.songInput.duration,
                album: args.songInput.album,
                year_released: +args.songInput.year_released,
                artist: {
                    name1: args.songInput.artist.name1, 
                    name2: args.songInput.artist.name2
                }
            })
            const result = await song.save();
            return transformSong(result);
            
        } catch (error) {
            throw error
        }
    },
    /**
     * Filters through all the songes based on certain filters:
     * filter: searches though all string values for matching regex to the input variable filter
     * sort: sorts by the chosen field value (ex: title or year released)
     * limit: the amount of elements to get
     * offset: where in the total result the limited amount of elemetns should start returning
     * @param args 
     * @returns all soongs based on filter result sorted in a limited amount and by offset in transformed fashion
     */
    filterSongs: async (args: any) => {
        const regex = new  RegExp(args.filter,'i')
        const fieldName: String = args.sortField.toLowerCase()
        const songs = await Song.find({$or: [
             {'title': {$regex: regex}},
             {'album': {$regex: regex}},
             {'artist.name1': {$regex: regex}},
             {'artist.name2': {$regex: regex}}
            ]
        }).sort(fieldName).limit(parseInt(args.limit)).skip(parseInt(args.offset))
        return songs.map(song => {
            return transformSong(song)
        })
       
    },
    /**
     * Deleting song from database, take in a songID and finds and deletes the song
     * @param args 
     * @returns transformed deleted song (return value is not used in frontend)
     */
    deleteSong: async (args: any) => {
        const song = await Song.findById(args.songID)
        try {
            await Song.deleteOne({_id: args.songID})
            return transformSong(song)
        } catch (error) {
            throw error
        }
    }
}