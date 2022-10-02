import React from 'react'
import { Box } from '@chakra-ui/layout'
import { Button, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ButtonGroup, FormLabel } from "@chakra-ui/react"
import { gql, useMutation } from '@apollo/client'

/**
 * Mutation-query to VM, deletes song from the database with the ID of the song the user is viewing
 */
export const DELETE_SONG = gql`
    mutation DeleteSong($songID: ID!){
        deleteSong(songID: $songID){
            _id
        }
    }
    `

/**
 * Exports ViewSong component to component DBList.tsx through Modal (pop-up box from Chakra)
 * Contains details about the song viewed, a button for deleting the song, and functionality for deleting a song
 * 
 * @param param Data about a song on the form {param: {title: "Example", duration: "2.2", ...(etc) }}
 * @returns A modal-view of the song-details (pop-up-box)
 */
function ViewSong(param: any) {
    const title = param.param.title

    /**
     * Submits songID to delete-mutation-query to delete song from database, refreshes window
     * @param paramVariables Data about ID of song the user wants to delete
     */
    const submit = (paramVariables: any) => {
        const clickedSongID = paramVariables.variables.songID
        deleteSong({ variables: { songID: clickedSongID } })
        refreshWindow()
    }

    function refreshWindow() {
        window.location.reload()
    }

    /**
     * Function to mutate database, takes in a mutation-query
     */
    const [deleteSong, { error, loading, data }] = useMutation(DELETE_SONG)
    if (loading) return <p>Submitting...</p>;
    if (error) return <p>Submission error :(( - {error.message}</p>;

    return (
        <>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>SONG VIEW:</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                        > <Box as="span">
                                Title: {title}
                            </Box>
                        </Box>
                        <Box>
                            <Box as="span">
                                Artist: {param.param.artist}
                            </Box>
                        </Box>
                        <Box>
                            <Box as="span">
                                Duration: {param.param.duration} min
                            </Box>
                        </Box>
                        <Box>
                            <Box as="span">
                                Album: {param.param.album}
                            </Box>
                        </Box>
                        <Box>
                            <Box as="span">
                                Year released: {param.param.year}
                            </Box>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mb="10px" mt="10px">
                        <Box w="100%" display="flex" justifyContent="space-between" alignItems="center">
                            <FormLabel htmlFor="deleteSong">Deleting will refresh the page:</FormLabel>
                            <Button data-cy="delete" name="deleteSong" onClick={() => {
                                submit({ variables: { songID: param.param._id } })
                            }}
                                as="span" key={param.param._id} bg="firebrick" color="white"
                            >Delete song
                            </Button>
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent >
        </>
    )
}

export default ViewSong;