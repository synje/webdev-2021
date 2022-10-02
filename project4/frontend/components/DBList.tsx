import React, { useState } from 'react'
import { useQuery, gql } from "@apollo/client"
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { updateSortTerm, updateSearchTerm, selectSearchTerm, selectSortTerm } from '../app/termsSlice'
import { View, Text, Platform, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { Button, List, Headline, Provider, useTheme, TextInput } from 'react-native-paper'
import ViewSong from './ViewSong'

/**
 * Query structure for query to backend
 * Used in useQuery call in DBList component
 */
export const GET_FILTERED_SONGS = gql`
query GetFilterSongs(
    $filter: String!
    $sortField: String
    $limit: Int
    $offset: Int
    ) {
        filterSongs(filter: $filter, sortField: $sortField, limit: $limit, offset: $offset){
            _id
            title
            duration
            album
            year_released
            artist{
                name1
                name2
            }
        }}
        `


/**
 * Exports DBList.tsx component to ToggleView.tsx
 * Component for Search, Sort, display DB as List, hosts detail-view of songs
 * @returns JSX elements for DBList
 */
const DBList = () => {
    const { colors } = useTheme();
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');

    /** Functionality for: VIEWSONG
     * State for opening and closing ViewSong-modal
     * Stores data about the song that was clicked on in state property (sends property to ViewSong component further down the file)
     */
    const [property, setProperty] = useState({ _id: "", title: "", duration: 0, album: "", year: 0, artist: [""] })
    function getView(_id: string, title: string, duration: number, album: string, year: number, artist: Array<any>) {
        let artistArray: any[] = []
        artist.map((name: any) => {
            artistArray.push(name.name1)
            if (artist[0].name2) {
                artistArray.push(", ", name.name2)
            }
        })
        setProperty({ _id: _id, title: title, duration: duration, album: album, year: year, artist: artistArray })
    }
    /** State and functionality for showing/hiding viewSong-modal */
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true)


    /** Functionality for: SEARCH/FILTER AND LISTVIEW */
    const dispatch = useAppDispatch();
    /**
     * Variables for searchTerm. SearchTerm is used for saving values in searchbar onChange, and fetching query at load, while prevSearchTerm is used for fetching more queries.
     * PrevSearchTerm uses redux state searchTerm
     */
    let searchTerm = ""
    let prevSearchTerm2 = useAppSelector(selectSearchTerm);
    /**
     * Variables for sortTerm. SorTterm is used for saving values from chosen sort, and fetching query at load, while prevSortTerm is used for fetching more queries.
     * PrevSearchTerm uses redux state searchTerm
     */
    let sortTerm = useAppSelector(selectSortTerm)
    let savedSortTerm2 = useAppSelector(selectSortTerm);

    /**
     * Fetching the data from the query. 
     * Takes in parameters for filter, with field to sort by, the limit of how many elements should be fetched and the offset of which elements are fetched
     * Loading is displayed at the start of the fething of data, and if there is an error in the fetch, error is displayed
     */
    const { error, loading, data, fetchMore } = useQuery(GET_FILTERED_SONGS, {
        variables: {
            filter: searchTerm,
            sortField: sortTerm,
            limit: 10,
            offset: 0
        }
    })
    if (loading) return (
        <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
                <Text>Loading...</Text>
            </View>
        </View>
    )
    if (error) return (
        <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
                <Text>An error occured while loading.</Text>
                <Text>You might not be connected to the NTNU network or your VPN is off.</Text>
                <Text>Error: {error.message}</Text>
            </View>
        </View>
    )


    /** GET ARTIST
     * @param artist1 of song as string
     * @param artist2 of song as any (can be undefined or null, because it's not required)
     * @returns 
     */
    function getArtistString(artist1: String, artist2: any) {
        if (typeof (artist2) === "string") {
            let artists: String = artist1 + ", " + artist2
            return artists
        }
        return artist1
    }


    /** SORTING
     * Function for fetching more data, with the previous searchTerm (the one saved),
     * a limit with is determined by the length of the current amout of displayed data and the current sortTerm
     * @returns data, from a new query with new variables
     */
    function fetchingMoreDataSort() {
        dispatch(updateSortTerm(sortTerm))
        let offSetDataLength = parseInt(data.filterSongs.length)
        return fetchMore({
            variables: { filter: prevSearchTerm2, limit: offSetDataLength, sortField: sortTerm },
            updateQuery: (prevResult, { fetchMoreResult }) => {
                return fetchMoreResult;
            }
        })
    }


    /**
     * Functionality for search, fetches correct items from db
     * @param query from input
     */
    const onChangeSearch = (query: any) => {
        setSearchQuery(query)

        dispatch(updateSearchTerm(searchQuery))
        fetchMore({
            variables: { filter: searchQuery, sortField: sortTerm },
            updateQuery: (prevResult, { fetchMoreResult }) => {
                return fetchMoreResult
            }
        })
    }

    /**
     * Function for closing viewSong detail view.
     * Refreshes displayed list to remove deleted song
     */
    function onClose() {
        setVisible(false)
        fetchingMoreDataSort()
    }

    return (
        <>
            <Provider theme={theme}>
                <View style={styles.body}>
                    <ScrollView style={styles.scroll}>
                        <View >
                            <Headline style={styles.headline}>THE SONG COLLECTION</Headline>
                        </View>

                        {/* SEARCHBAR */}
                        <TextInput
                            placeholder="Search all songs"
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                            accessibilityLabel={'Searchbar'}
                            style={styles.searchbar}
                            autoComplete="off"
                        />

                        {/* SORT BUTTONS */}
                        <View>
                            <Button mode="contained" style={styles.sortButtonStyle} onPress={() => { setSearchQuery("") }}>Clear input</Button>
                            <Button mode="contained" style={styles.sortButtonStyle} onPress={() => { sortTerm = 'title', fetchingMoreDataSort() }}>Sort by title (ASC)</Button>
                            <Button mode="contained" style={styles.sortButtonStyle} onPress={() => { sortTerm = "artist", fetchingMoreDataSort() }}>Sort by artist (ASC)</Button>
                            <Button mode="contained" style={styles.sortButtonStyle} onPress={() => { sortTerm = "", fetchingMoreDataSort() }}>Remove sort</Button>
                            <Button mode="contained" style={styles.sortButtonStyle} onPress={() => { onChangeSearch("") }}>Reset list</Button>
                        </View>

                        {/* LISTVIEW */}
                        <View style={styles.listBox}>
                            {data.filterSongs.map((song: { _id: string; title: string; duration: number; album: string; year_released: number, artist: Array<any> }) => {
                                return (
                                    <List.Item
                                        key={song._id}
                                        style={styles.listItemStyle}
                                        titleStyle={{ color: colors.text }}
                                        descriptionStyle={{ color: colors.text }}
                                        accessibilityLabel={'Song:' + song.title}
                                        title={song.title}
                                        titleEllipsizeMode="tail"
                                        description={
                                            song.artist.map((artist: { name1: String; name2: String | null }) => (
                                                <>
                                                    <View>
                                                        <Text>
                                                            {getArtistString(artist.name1, artist.name2)}
                                                        </Text>
                                                    </View>
                                                </>
                                            ))}
                                        descriptionNumberOfLines={3}
                                        descriptionEllipsizeMode="tail"
                                        data-cy="listItem"
                                        onPress={() => {
                                            showModal()
                                            getView(song._id, song.title, song.duration, song.album, song.year_released, song.artist)
                                        }}
                                    />
                                )
                            })}
                        </View>

                        {/* LOAD MORE-BUTTON */}
                        <View style={styles.buttonsBoxCenter}>
                            <Button data-cy="showMore" style={styles.buttons} mode='contained' onPress={() => {
                                let offSetDataLength = parseInt(data.filterSongs.length)
                                fetchMore({
                                    variables: { filter: prevSearchTerm2, offset: offSetDataLength, sortField: savedSortTerm2 },
                                    updateQuery: (prevResult, { fetchMoreResult }) => {
                                        fetchMoreResult.filterSongs = [
                                            ...prevResult.filterSongs,
                                            ...fetchMoreResult.filterSongs
                                        ];
                                        return fetchMoreResult;
                                    }
                                })
                            }}>Load more</Button>
                        </View>
                    </ScrollView>


                    {/* VIEWSONG */}
                    {visible &&
                        <>
                            <TouchableOpacity style={styles.modalBackground} onPress={() => { onClose() }}></TouchableOpacity>
                            <View style={styles.modalStyle} >
                                <ScrollView style={styles.modalScroll}>
                                    <Button mode='contained' onPress={() => { onClose() }}>Close</Button>
                                    <ViewSong param={property} />
                                </ScrollView>
                            </View>
                        </>
                    }
                </View>
            </Provider>
        </>
    )
}



export default DBList;

// S T Y L I N G :

const screenHeight = Platform.OS === "web" ? Dimensions.get('screen').height + 20 : Dimensions.get('screen').height
const windowHeight = Platform.OS === "web" ? Dimensions.get('window').height + 20 : Dimensions.get('window').height

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: windowHeight - 150,
        justifyContent: 'center',
    },

    // ON LOAD AND ERROR
    infoContainer: {
        display: "flex",
        alignItems: "center",
        marginTop: 50,
    },
    infoBox: {
        backgroundColor: "#F0FAF1",
        borderBottomColor: "#a9a9a9",
        borderBottomWidth: 1,
        padding: 5,
    },

    // HEADER
    headline: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: Platform.OS === "web" ? 25 : 15,
        marginTop: Platform.OS === "web" ? 20 : 10,
        alignSelf: 'center',
    },

    //SEARCHBAR
    searchbar: {
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom: 15,
        backgroundColor: "#F0FAF1",
        shadowColor: '#0c1618',
    },

    // SCROLL
    scroll: {
        height: screenHeight / 3,
        width: '100%',
    },

    // BUTTONS (Load more)
    buttons: {
        width: "50%",
        maxWidth: 500,
        display: "flex",
        marginBottom: 20,
        height: 40,
        justifyContent: 'center',
    },
    buttonsBoxCenter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
    },

    // SORT-BUTTONS
    sortButtonStyle: {
        marginLeft: "5%",
        marginRight: "5%",
        height: 45,
        marginBottom: 5,
        fontSize: 12,
        justifyContent: 'center'
    },

    // LIST
    listBox: {
        paddingVertical: 10
    },
    listItemStyle: {
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom: 15,
        backgroundColor: "#F0FAF1",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#004643",
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        paddingLeft: 30,
        shadowColor: '#0c1618',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        width: "90%",
    },

    // MODAL
    modalStyle: {
        backgroundColor: "#ecf9ed",
        borderColor: "black",
        borderWidth: 2,
        padding: 20,
        borderRadius: 4,
        width: "80%",
        marginLeft: Platform.OS === "web" ? "15%" : "10%",
        marginRight: Platform.OS === "web" ? "15%" : "10%",
        maxHeight: Platform.OS === "web" ? screenHeight / 1.5 : screenHeight - 180,
        maxWidth: Platform.OS === "web" ? "70%" : "80%",
        marginTop: 0,
        position: 'absolute',
        display: "flex",
        alignItems: 'center',
        zIndex: 4,
    },
    modalBackground: {
        backgroundColor: "#c1ebc5",
        opacity: .7,
        height: Platform.OS === "web" ? screenHeight - 299 : screenHeight - 150,
        marginTop: Platform.OS === "web" ? 0 : 0,
        top: 0,
        zIndex: 3,
    },
    modalScroll: {
        width: "100%",
    },
})