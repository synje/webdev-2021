import { useMutation } from "@apollo/client";
import { MockedProvider } from "@apollo/react-testing";
import { fireEvent, getByLabelText, getByText, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import AddSong, { ADD_SONG } from "../components/AddSong";
export { ADD_SONG } from '../components/AddSong';

import { ApolloClient, InMemoryCache, ApolloProvider, } from "@apollo/client";
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer';
import renderer from 'react-test-renderer'
import { Button } from "@chakra-ui/button";
import { GraphQLError } from "graphql/error";


const mockAddSong = {
    request: {
        query: ADD_SONG,
        variables: {
            title: "RED-SUN (021)",
            duration: 3.09,
            album: "THE PARK IN THE NIGHT part three",
            year_released: 2019,
            aritst: {
                name1: 'GWSN',
            },
        },
    },
    result: {
        data: {
            filterSongs: {
                _id: "1234",
                title: "Sang",
                duration: 1.23,
                album: "album",
                year_released: 2021,
                artist: {
                    name1: "artist",
                    name2: undefined
                }
            }
        }
    }
};



test('Snapshot addSong', () => {
    const tree = renderer.create(<MockedProvider mocks={[mockAddSong as any]}>
        <AddSong />
    </MockedProvider>)
    expect(tree).toMatchSnapshot()

})
it('Test render doesnt result in error', async () => {
    const { getByText } = render(
        <MockedProvider mocks={[mockAddSong as any]}>
            <AddSong />
        </MockedProvider>
    );

    expect(getByText(/Song title/i)).toBeInTheDocument();

    //https://www.apollographql.com/docs/react/v2/development-testing/testing/

});
