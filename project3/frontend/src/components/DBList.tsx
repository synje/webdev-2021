import { useState } from 'react'
import SearchBar from './SearchBar'
import { List, ListItem } from '@chakra-ui/layout'
import { useQuery, gql } from "@apollo/client";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateSortTerm, updateSearchTerm, selectSearchTerm, selectSortTerm } from '../app/termsSlice';
import { Text, useDisclosure, Button, Modal, Box, Heading } from "@chakra-ui/react"
import ViewSong from './ViewSong';

/**
 * Query structure for querey to backend
 * Used in useQuyery call in DBList component
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
 * Exports DBList component (everything on the page under the red line) to App.tsx
 */
const DBList = () => {

    /** Functionality for: VIEWSONG
     * State for opening and closing ViewSong-window (Modal from Chakra)
     * Stores data from list and database to property (sends property to ViewSong component further down the file)
     */
    const { isOpen, onOpen, onClose } = useDisclosure()
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
    function onOpenFunc() { return onOpen() }
    function onCloseFunc() { return onClose() }


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

    let count = 0 // Counter for displaying number of elements currently loaded on page
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
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;


    // GET TITLE
    /**
     * Slices the title if its too long and adds ...
     * @param title of song as string
     * @returns title as string
     */
    function getTitleString(title: string) {
        if (title.length > 10) {
            title = title.slice(0, 10)
            return title + "..."
        }
        return title
    }
    // GET ARTIST
    /**
     * Slices the artist-names if its too long and adds ...
     * @param artist1 of song as string
     * @param artist2 of song as any (can be undefined or null, because it's not required)
     * @returns 
     */
    function getArtistString(artist1: String, artist2: any) {
        if (artist1.length > 10) {
            artist1 = artist1.slice(0, 10) + "..."
        }
        if (typeof (artist2) === "string") {
            if (artist2.length > 5) {
                artist2 = artist2.slice(0, 5) + "..."
            }
            let artists: String = artist1 + ", " + artist2
            return artists
        }
        return artist1
    }
    // ADDS SECOND ARTIST TO LISTVIEW IF PRESENT
    /**
     * Returns artist2 as string if there is input from the user in this field
     * @param artist2 of song as any (can be undefined or null, because it's not required)
     * @returns artist2 as string
     */
    function getDuo(artist2: any) {
        if (typeof (artist2) === "string") {
            return artist2
        }
    }


    // S T Y L I N G :
    /**
     * Styling-variables to different Chakra(HTML)-elements on the page
     */
    // STYLING FOR TEXT IN LISTVIEW
    const textStyle = {
        color: "white",
        fontSize: "17px",
        fontweight: "bold"
    }
    // STYLING FOR LISTITEMS IN LISTVIEW
    const listItemStyle = {
        backgroundColor: "darkred"
    }
    // STYLING FOR BUTTONS ON LISTVIEW
    const viewButtonStyle = {
        backgroundColor: "#a23333",
        color: "white",
        border: "0.2px solid white"
    }
    // STYLING FOR BUTTONS ON SHOW MORE/LESS
    const buttonStyle = {
        backgroundColor: "floralwhite",
        border: "0.2px solid dimgray"
    }
    // STYLING FOR BUTTONS ON SORT
    const sortButtonStyle = {
        backgroundColor: "floralwhite",
        border: "0.2px solid darkred",
        borderRadius: "0",
        marginRight: "2px",
        marginBottom: "2px"
    }



    // SORTING
    /**
     * Function for fetching more data, with the previou searchTerm (the one saved),
     * a limit with is determined by the lenght of the current amout of displeyed data and the current sortTerm
     * @returns data, from a new query with new variables
     */
    function fetchingMoreDataSort(){
        dispatch(updateSortTerm(sortTerm))
        let offSetDataLength = parseInt(data.filterSongs.length)
        return fetchMore({
            variables: { filter: prevSearchTerm2, limit: offSetDataLength, sortField: sortTerm },
            updateQuery: (prevResult, { fetchMoreResult }) => {
                return fetchMoreResult;
    
            }
        })
    }

    return (
        <>
            {/* HEADER */}
            <Box w="100%" mt="3%" mb="3%" display="flex" alignItems="center" flexDirection="column">
                <Heading display="flex" justifyContent="flex-start" w="90%">Search the collection:</Heading>
            </Box>

            {/* FOR VIEWSONG */}
            <Modal data-cy= "songBox" onClose={onCloseFunc} isOpen={isOpen} isCentered>
                <ViewSong param={property} />
            </Modal>

            {/* SEARCHBAR */}
            <Box w="100%">
                <Box display="flex" justifyContent="center" w="100%"><Box as ="span" w="90%" fontSize="110%">Search for songs, albums or artists</Box></Box>
                <SearchBar
                    searchInput={(e: any) => searchTerm = e.target.value}
                    placeholder="Search..."
                    handleClick={(e: any) => {
                        e.preventDefault()
                        dispatch(updateSearchTerm(searchTerm))
                        fetchMore({
                            variables: { filter: searchTerm, sortField: sortTerm },
                            updateQuery: (prevResult, { fetchMoreResult }) => {
                                return fetchMoreResult;
                            }
                        })
                    }}
                />
                <Box className="sortingNav" mb="3%" mt="3%" display="flex" justifyContent="center">
                    <Box w="90%">
                        <Button w="240px" data-cy="sortbyTitle" style={sortButtonStyle} onClick={() => { sortTerm = 'title', fetchingMoreDataSort() }}>Sort by title (ASC)</Button>
                        <Button w="240px" style={sortButtonStyle} onClick={() => { sortTerm = "duration", fetchingMoreDataSort() }}>Sort by duration (ASC)</Button>
                        <Button w="240px" style={sortButtonStyle} onClick={() => { sortTerm = "album", fetchingMoreDataSort() }}>Sort by album (ASC)</Button>
                        <Button w="240px" style={sortButtonStyle} onClick={() => { sortTerm = "year_released", fetchingMoreDataSort() }}>Sort by year released (ASC)</Button>
                        <Button w="240px" style={sortButtonStyle} onClick={() => { sortTerm = "artist", fetchingMoreDataSort() }}>Sort by artist (ASC)</Button>
                        <Button w="240px" data-cy="removeSort" style={sortButtonStyle} onClick={() => { sortTerm = "", fetchingMoreDataSort() }}>Remove sort</Button>
                    </Box>
                </Box>
            </Box>

            {/* LISTVIEW */}
            <Box display="flex" justifyContent="center" w="100%">
                <List spacing={2} w="90%">
                    {data.filterSongs.map((song: { _id: string; title: string; duration: number; album: string; year_released: number, artist: Array<any> }) => (
                        <>
                            <ListItem  data-cy= "listItem" key={count + 1} style={listItemStyle} className="listItems" display="flex" justifyContent="space-around" alignItems="center" bg="tomato" w="100%" p={4} color="white" borderRadius={3}>
                                {" "}
                                <Text mr="15px" style={textStyle} id="songCount" className="listText">{count += 1}</Text>
                                <Text mr="13px" style={textStyle} data-cy="songTitle" id="songTitle" className="listText">{getTitleString(song.title)}</Text>
                                {song.artist.map((artist: { name1: String; name2: String | null }) => (
                                    <>
                                        <Text mr="13px" style={textStyle} className="listText" id="songArtist">
                                            {getArtistString(artist.name1, getDuo(song.artist[0].name2))}
                                        </Text>
                                    </>
                                ))}

                                {/* FOR VIEW SONG */}
                                <Button style={viewButtonStyle} onClick={() => {
                                    onOpenFunc()
                                    getView(song._id, song.title, song.duration, song.album, song.year_released, song.artist)
                                }
                                } data-cy= "songView" color="darkslategrey">VIEW SONG</Button>
                            </ListItem>
                        </>
                    ))}
                </List>
            </Box>

            {/* SHOW MORE/LESS BUTTONS */}
            <Box display="flex" justifyContent="center" mt="3%" mb="3%" w="100%">
                <Button data-cy="showMore" mr="10px" style={buttonStyle} onClick={() => {
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
                }} >Show more</Button>
                <Button data-cy= "showLess" style={buttonStyle} onClick={() => {
                    fetchMore({
                        variables: { filter: prevSearchTerm2, offset: 0, limit: 10, sortField: savedSortTerm2 },
                        updateQuery: (prevResult, { fetchMoreResult }) => {
                            return fetchMoreResult;

                        }
                    })
                }} >Show less</Button>
            </Box>
        </>
    )
}

export default DBList;