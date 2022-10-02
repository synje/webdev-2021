import { buildSchema, graphql } from 'graphql';

export default 
buildSchema(`
    
type Song{
    _id: ID!
    title: String!
    duration: Float
    artist: [Artist]
    album: String
    year_released: Int
}

type Artist{
    name1: String
    name2: String
}

input ArtistInput{
    name1: String
    name2: String
}

input SongInput{
    title: String!
    duration: Float
    artist: ArtistInput
    album: String
    year_released: Int
}

type RootQuery{
    songs(limit: Int, offset: Int): [Song!]
    filterSongs(filter: String, sortField: String, limit: Int, offset: Int): [Song!]
}

type RootMutation{
    addSong(songInput: SongInput): Song
    deleteSong(songID: ID!): Song!
}

schema{
    query: RootQuery
    mutation: RootMutation
}

`)
