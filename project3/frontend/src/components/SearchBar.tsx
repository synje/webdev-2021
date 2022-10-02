import React from 'react'
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react"


/**
 * Exports SearchBar component to component DBList.tsx
 * Searchbar input-field and search-button
 */
export default class SearchBar extends React.Component {
    props: any


    render() {
        return (
            <>
                <Box display="flex" justifyContent="center">
                    <Box className="searchBar" display="flex" justifyContent="center" w="100%">
                        <FormControl display="flex" justifyContent="center" w="90%">
                            <FormLabel htmlFor="searchInput" display="none">Search</FormLabel>
                            <Input type="text"
                                data-cy="searchBar"
                                className="searchBar"
                                name="searchInput"
                                placeholder={this.props.placeholder}
                                onChange={this.props.searchInput}
                            />
                            <Button type="submit"
                                data-cy="searchButton"
                                color="darkslategray"
                                className="submitbtn"
                                bg="floralwhite"
                                border="0.2px solid dimgray"
                                onClick={this.props.handleClick}
                            >SEARCH</Button>
                        </FormControl>
                    </Box>
                </Box>
            </>
        )
    }
}