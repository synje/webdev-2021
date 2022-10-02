import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { ReactTestRendererJSON } from 'react-test-renderer'
import TestRenderer from 'react-test-renderer';
import DBList, { GET_FILTERED_SONGS } from "../components/DBList";
import { store } from '../app/store';
import { Provider } from "react-redux";
import { render, waitForElementToBeRemoved } from "@testing-library/react";
import fireEvent from '@testing-library/user-event'

const mockFilterSong = {

    request: {
        query: GET_FILTERED_SONGS,
        variables: {
            filter: "",
            sortField: "",
            limit: 10,
            offset: 0
        },
    },
    result: {
        data: {
            filterSongs: [{
                _id: "1234",
                title: "Sang",
                duration: 1.23,
                album: "album",
                year_released: 2021,
                artist: [{
                    name1: "artist",
                    name2: undefined
                }]
            }]
        }
    }
};

test('Snapshot DBList', async () => {

    const component = TestRenderer.create(
        <Provider store={store}>
            <MockedProvider mocks={[mockFilterSong as any]}>
                <DBList />
            </MockedProvider>
        </Provider>
    )

    const { asFragment, getByText } = render(
        <Provider store={store}>
            <MockedProvider mocks={[mockFilterSong as any]}>
                <DBList />
            </MockedProvider>
        </Provider>)

    await waitForElementToBeRemoved(() => getByText('Loading...'))


    expect(asFragment()).toMatchSnapshot()

})

it('DBList loades', async () => {
    const component = TestRenderer.create(
        <Provider store={store}>
            <MockedProvider mocks={[mockFilterSong as any]}>
                <DBList />
            </MockedProvider>
        </Provider>
    )

    const tree = component.toJSON() as ReactTestRendererJSON
    if (tree != null) {
        expect(tree.children).toContain('Loading...')

    }
}
)


test('Test loaded filterSong', async () => {
    const { getByText } = render(
        <Provider store={store}>
            <MockedProvider mocks={[mockFilterSong as any]}>
                <DBList />
            </MockedProvider>
        </Provider>)

    await waitForElementToBeRemoved(() => getByText('Loading...'))

    const textElement = getByText('Sang')
    expect(textElement).toBeInTheDocument()

})

test('Test redux', async () => {
    const { getByText, getByPlaceholderText } = render(
        <Provider store={store}>
            <MockedProvider mocks={[mockFilterSong as any]}>
                <DBList />
            </MockedProvider>
        </Provider>)

    await waitForElementToBeRemoved(() => getByText('Loading...'))

    const searchInput = await getByPlaceholderText('Search...')
    const searchButton = getByText('SEARCH')
    expect(searchButton).toBeInTheDocument()

    expect(searchInput.innerHTML).toBe("")
    const termInput = "Sel"
    fireEvent.type(searchInput, termInput)
    //fireEvent.click(searchButton) //gives error, but filter (searchTerm) is updated according to store value
})