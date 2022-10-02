import React from 'react'
import { Box, Button, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react"
import { Controller, useForm } from 'react-hook-form'

/**
 * Exports input-form to component AddSong.tsx
 * Input-fields and button to submit
 */
export default class AddSong extends React.Component {
    props: any

    labelStyle = {
        fontSize: "120%"
    }

    render() {
        return (
            <>
                <Box w="90%" mb="25px">
                    <FormControl mb="20px" isRequired>
                        <FormLabel htmlFor="songtitleInput" style={this.labelStyle}>Song title:</FormLabel>
                        <Input type="text"
                            data-cy="title"
                            placeholder="Title"
                            className="addSongInput"
                            name="songtitle"
                            onChange={this.props.titleInput}
                        />
                    </FormControl>
                    <FormControl mb="20px" isRequired>
                        <FormLabel htmlFor="durationInput" style={this.labelStyle}>Duration:</FormLabel>
                        <Input type="number"
                            data-cy="duration"
                            placeholder="2.45"
                            className="addSongInput"
                            name="durationInput"
                            onChange={this.props.durationInput}
                        />
                        <FormHelperText color="darkslategrey">Song length in minutes comma seconds</FormHelperText>
                    </FormControl>
                    <FormControl mb="20px" isRequired>
                        <FormLabel htmlFor="albumInput" style={this.labelStyle}>Album:</FormLabel>
                        <Input type="text"
                            data-cy="album"
                            placeholder="Album"
                            className="addSongInput"
                            name="albumInput"
                            onChange={this.props.albumInput}
                        />
                    </FormControl>
                    <FormControl mb="20px" isRequired>
                        <FormLabel htmlFor="yearInput" style={this.labelStyle}>Year released:</FormLabel>
                        <Input type="number"
                            data-cy="year"
                            placeholder="1999"
                            className="addSongInput"
                            name="yearInput"
                            onChange={this.props.yearInput}
                        />
                    </FormControl>
                    <FormControl mb="20px" isRequired>
                        <FormLabel htmlFor="artist1Input" style={this.labelStyle}>Artist 1:</FormLabel>
                        <Input type="String"
                            data-cy="artist1"
                            placeholder="Name Johnson"
                            className="addSongInput"
                            name="artist1Input"
                            onChange={this.props.artistInput1}
                        />
                    </FormControl>
                    <FormControl mb="25px">
                        <FormLabel htmlFor="artist2Input" style={this.labelStyle}>Artist 2:</FormLabel>
                        <Input type="String"
                            data-cy="artist2"
                            placeholder="John Nameson"
                            className="addSongInput"
                            name="artist2Input"
                            onChange={this.props.artistInput2}
                        />
                    </FormControl>
                    <Box display="flex" justifyContent="center">
                        <Button type="submit"
                            id = "AddSongButton"
                            color="darkslategrey"
                            className="submitbtn"
                            bg="floralwhite"
                            border="0.2px solid dimgray"
                            onClick={this.props.handleClick}
                        >ADD SONG</Button>
                    </Box>
                </Box>
            </>
        )
    }
}