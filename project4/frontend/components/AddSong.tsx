import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, StyleSheet, Platform, ScrollView, Dimensions } from "react-native";
import { Button, Headline, TextInput } from "react-native-paper";

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
 * Component for adding song to the database
 * @returns JSX elements for data input
 */
function AddSong() {

    const [addSong, { error, loading, data }] = useMutation(ADD_SONG)
    const { control, handleSubmit, formState: { errors }, reset } = useForm();

    const resetValues = {
        title: '',
        duration: '',
        album: '',
        year: '',
        artist1: '',
        artist2: ''
    }

    /**
     * Takes input data as string and replaces , with . to make the duration format correct on web
     * @param input 
     * @returns input with .
     */
    function makeStringToFloat(input: string) {
        return parseFloat(input.replace(',', '.'))
    }

    /**
     * Feedback to user that a song was added successfully
     * @param data 
     */
    function songAddedSuccessful(data: any) {
        alert(`Song "${data.title}" was added!`);
    }

    /**
     * Checks to see of artist2 input is empty to format the list element correctly. If artist is empty sets the value as undefined, otherwise artist2 is returned as it is
     * @param artist2 
     * @returns artist2 or undefined
     */
    function checkArtist2(artist2: string) {
        if (artist2 !== "") {
            return artist2
        }
        return undefined

    }

    /**
     * Submits the input data as a new song to the database
     * @param data 
     * @returns alert if an error occurs, or else it will smoothly reload the form
     */
    const onSubmit = (inputData: any) => {
        const inputDataVar = { variables: { title: inputData.title.toString(), duration: makeStringToFloat(inputData.duration), album: inputData.album.toString(), year_released: parseInt(inputData.year), artist: { name1: inputData.artist1, name2: checkArtist2(inputData.artist2) } } }
        addSong(inputDataVar)
        if (loading) return <Text style={{ marginTop: 10 }}>Submitting...</Text>;
        if (error) return <Text style={{ marginTop: 10 }}>Submission error: {error.message}</Text>;
        if (data !== undefined) {
            songAddedSuccessful(inputData)
        }
        else {
            alert('An error has occured. An error occured while loading. You might not be connected to the NTNU network or your VPN is off.');
        }
        reset(resetValues)
    }

    //Source/Inspiration: https://stackoverflow.com/questions/69370034/how-to-input-only-number-in-react-hook-form
    /**
     * Makes the inputfield for year only accept numbers 
     * @param value 
     * @returns string input as "numbers"
     */
    const allowOnlyNumber = (value: string) => {
        return value.replace(/[^0-9]/g, '')
    }


    return (
        <>
            <View style={styles.body}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.container}>
                        <View>
                            <Headline style={styles.headline}>ADD SONG</Headline>
                        </View>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    clearButtonMode="always"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    label="Song title *"
                                    style={styles.input}
                                    accessibilityLabel='Song title *'
                                    placeholder="Take Me To Church"
                                    placeholderTextColor={'#79b298'}
                                    autoComplete="off"
                                />
                            )}
                            name="title"
                            defaultValue=""
                        />
                        {errors.title && <Text>Field is required.</Text>}


                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                value: Number,
                                pattern: /^[0-9.,]*$/
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    keyboardType="numeric"
                                    label="Duration *"
                                    placeholder="4.01"
                                    placeholderTextColor={'#79b298'}
                                    style={styles.input}
                                    accessibilityLabel='Duration *'
                                    autoComplete="off"
                                />
                            )}
                            name="duration"
                            defaultValue=""
                        />
                        {errors.duration && errors.duration.type === 'required' && <Text>Field is required.</Text>}
                        {errors.duration && errors.duration.type === 'pattern' && <Text>Field must be numbers.</Text>}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    label="Album *"
                                    style={styles.input}
                                    autoComplete="off"
                                    accessibilityLabel='Album *'
                                    placeholder="Hozier"
                                    placeholderTextColor={'#79b298'}
                                />
                            )}
                            name="album"
                            defaultValue=""
                        />
                        {errors.album && <Text>Field is required.</Text>}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                maxLength: 4
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(allowOnlyNumber(text))}
                                    value={value}
                                    keyboardType="numeric"
                                    label="Year Released *"
                                    style={styles.input}
                                    autoComplete="off"
                                    accessibilityLabel='Year released *'
                                    placeholder="2014"
                                    placeholderTextColor={'#79b298'}
                                />
                            )}
                            name="year"
                            defaultValue=""
                        />
                        {errors.year && errors.year.type === 'required' && <Text>Field is required.</Text>}
                        {errors.year && errors.year.type === 'maxLength' && <Text>Field can not contain more than 4 numbers.</Text>}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    label="Artist 1 *"
                                    style={styles.input}
                                    autoComplete="off"
                                    accessibilityLabel='Artist 1 *'
                                    placeholder="Hozier"
                                    placeholderTextColor={'#79b298'}
                                />
                            )}
                            name="artist1"
                            defaultValue=""
                        />
                        {errors.artist1 && <Text>Field is required.</Text>}

                        <Controller
                            control={control}
                            rules={{
                                required: false,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label="Artist 2"
                                    style={styles.input}
                                    autoComplete="off"
                                    accessibilityLabel='Artist 2'
                                />
                            )}
                            name="artist2"
                            defaultValue=""
                        />

                        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>SUBMIT</Button>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
export default AddSong



const screenHeight = Platform.OS === "web" ? Dimensions.get('screen').height + 20 : Dimensions.get('screen').height
const windowHeight = Platform.OS === "web" ? Dimensions.get('window').height + 20 : Dimensions.get('window').height


const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: windowHeight - 150,
        marginTop: 0,
    },
    container: {
        width: '100%',
        maxHeight: '100%',
        alignItems: 'center',
    },
    input: {
        width: "70%",
        maxWidth: 900,
        marginTop: Platform.OS === "web" ? 20 : 10,
        shadowColor: '#0c1618',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#004643",
        backgroundColor: '#F0FAF1',
    },
    button: {
        width: 250,
        height: 50,
        justifyContent: 'center',
        marginTop: Platform.OS === "web" ? 20 : 10,
        marginBottom: Platform.OS === "web" ? 0 : screenHeight / 3 + 10,
    },
    headline: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 25,
        marginTop: 20,
    },
    scroll: {
        height: Platform.OS === "web" ? screenHeight / 1.5 : screenHeight - 150,
        marginTop: Platform.OS === "web" ? 0 : 0,
        width: '100%',
        paddingBottom: Platform.OS === "web" ? 20 : 50,
    },

});