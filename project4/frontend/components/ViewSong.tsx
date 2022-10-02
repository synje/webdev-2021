import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button, Title } from 'react-native-paper'
import { View, StyleSheet, Text, Platform, Dimensions } from 'react-native'

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
 * Exports ViewSong-component to component DBList.tsx
 * Contains details about the song viewed, a button for deleting the song, and functionality for deleting a song
 * 
 * @param param Data about a song on the form {param: {title: "Example", duration: "2.2", ...(etc) }}
 * @returns A modal-view of the song-details (pop-up-view)
 */
function ViewSong(param: any) {

    /** State of disabled on delete-button */
    const [disabledState, setDisabledState] = useState(Boolean);

    /**
     * Submits songID to delete-mutation-query to delete song from database, calls successfulDelete(title)
     * @param paramVariables Data about song the user wants to delete
     */
    const submit = (paramVariables: any) => {
        const clickedSongID = paramVariables.variables.songID
        deleteSong({ variables: { songID: clickedSongID } })
        successfulDelete(paramVariables.variables.title)
    }

    /**
     * Shows an alert on successful delete, disables delete-button
     * @param title 
     */
    function successfulDelete(title: any) {
        alert(`Song "${title}" was successfully deleted!`)
        setDisabledState(true)
    }


    /**
     * Function to mutate database, takes in a mutation-query
     */
    const [deleteSong, { error, loading, data }] = useMutation(DELETE_SONG)
    if (loading) return <Text style={{ marginTop: 10 }}>Submitting...</Text>;
    if (error) return <Text style={{ marginTop: 10 }}>Submission error: {error.message}</Text>


    return (
        <>
            <View>
                <View style={styles.headerBox}>
                    <View style={styles.modalText}>
                        <Text>
                            Title:<Title style={styles.headerText}>{param.param.title}</Title>
                        </Text>
                    </View>
                </View>
                <View style={styles.headerBox}>
                    <View style={styles.modalText}>
                        <Text>
                            Artist:<Title style={styles.headerText}>{param.param.artist}</Title>
                        </Text>
                    </View>
                </View>
                <View style={styles.headerBox}>
                    <View style={styles.modalText}>
                        <Text>
                            Duration:<Title style={styles.headerText}>{param.param.duration} min</Title>
                        </Text>
                    </View>
                </View>
                <View style={styles.headerBox}>
                    <View style={styles.modalText}>
                        <Text>
                            Album:<Title style={styles.headerText}>{param.param.album}</Title>
                        </Text>
                    </View>
                </View>
                <View style={styles.headerBox}>
                    <View style={styles.modalText}>
                        <Text>
                            Year released:<Title style={styles.headerText}>{param.param.year}</Title>
                        </Text>
                    </View>
                </View>
                <View style={styles.headerBoxButton}>
                    <View style={styles.modalText}>
                        <View>
                            <Title style={styles.headerText}>Delete is permanent:</Title>
                            <Button data-cy="delete" style={[styles.deleteButtonStyle, disabledState && styles.disabledButton]} labelStyle={styles.deleteButtonText}
                                onPress={() => {
                                    submit({ variables: { songID: param.param._id, title: param.param.title } })
                                }}
                                key={param.param._id}
                                disabled={disabledState}
                            >Delete song</Button>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

export default ViewSong;

const screenHeight = Dimensions.get('screen').height
const styles = StyleSheet.create({
    modalText: {
        marginBottom: 5,
        width: "100%",
    },
    headerBox: {
        display: "flex",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#A9A9A9",
        marginTop: 15,
    },
    headerBoxButton: {
        display: "flex",
        alignItems: "center",
        marginTop: 15,
    },
    headerText: {
        color: "black",
        marginLeft: 5,
        fontSize: 20,
    },
    deleteButtonStyle: {
        backgroundColor: "#8B0000",
        width: "100%",
        height: 35,
        marginTop: 8,
        marginBottom: 15,
    },
    deleteButtonText: {
        color: "white",
        fontSize: 12,
    },
    disabledButton: {
        backgroundColor: "#808080",
    },
    total: {
        position: 'absolute'
    },
})