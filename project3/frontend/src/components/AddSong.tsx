import { useState } from 'react'
import Form from './AddSongInput'
import { useMutation, gql } from "@apollo/client";
import { InputAddon } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/react';


/**
 * Mutation-query to VM, adds a new song to the database with the users input
 */
export const ADD_SONG = gql`
mutation AddSong($title:String! $album:String $duration:Float $year_released:Int $artist:ArtistInput ) {
    addSong(songInput:{title:$title album:$album duration:$duration year_released:$year_released artist:$artist }){
        title
    }
}
`

/**
 * Exports AddSong component (everything on the page over the red line) to App.tsx
 */
const AddSong = () => {

    /**
     * States for temporarily storing form-input (onChange)
     */
    let [inputTitle, setInputTitle] = useState("")
    let [inputDuration, setDuration] = useState("")
    let [inputAlbum, setAlbum] = useState("")
    let [inputYear, setYear] = useState("")
    let [inputArtist1, setArtist1] = useState("")
    let [inputArtist2, setArtist2] = useState()

    let FloatDuration = 0
    let IntYear = 0

    /**
     * Mutation to database on submit AddSong-form
     */
    const [addSong, { error, loading, data }] = useMutation(ADD_SONG)
    if (loading) return <p>Submitting...</p>;
    if (error) return <p>Submission error :(( - {error.message}</p>;

    const submit = (variables: any) => {
        addSong(variables)
    }


    return (
        <>
            <Box w="100%" mt="3%" display="flex" alignItems="center" flexDirection="column">
                <Heading display="flex" justifyContent="flex-start" w="90%">Add a song to the collection:</Heading>
                <Box display="flex" justifyContent="center" w="100%" mt="3%" mb="3%" borderBottom="3px solid darkred">
                    {/**
                     * Form is a component from the file AddSongInput.tsx.
                     * Form is the input-fields and the button to add song.
                     * 
                     * Stores values from input-fields onChange, submits values to mutation-query
                     */}
                    <Form
                        titleInput={(e: any) => inputTitle = (e.target.value)}
                        durationInput={(e: any) => inputDuration = (e.target.value)}
                        albumInput={(e: any) => inputAlbum = (e.target.value)}
                        yearInput={(e: any) => inputYear = (e.target.value)}
                        artistInput1={(e: any) => inputArtist1 = e.target.value}
                        artistInput2={(e: any) => inputArtist2 = e.target.value}

                        handleClick={(e: any) => {
                            FloatDuration = parseFloat(inputDuration)
                            IntYear = parseInt(inputYear)
                            submit({ variables: { title: inputTitle, duration: FloatDuration, album: inputAlbum, year_released: IntYear, artist: { name1: inputArtist1, name2: inputArtist2 } } })
                        }}
                    />
                </Box>
            </Box>
        </>
    )
}

export default AddSong;