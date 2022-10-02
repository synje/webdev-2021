import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { useState } from 'react';
import renderer from 'react-test-renderer'
import SearchBar from "../components/SearchBar";

test('Snapshot SearchBar', () => {
    const tree = renderer.create(<SearchBar />)
    
    expect(tree).toMatchSnapshot()

})

test('Test input from searchbar', () =>{
    let searchInputField = ""
    const { getByPlaceholderText }= render(
            <SearchBar 
            placeholder="Search..." 
            searchInput={(e: any) => searchInputField = e.target.value}
            />
    )

    // const inputField = component.root.findByType('input')
    const inputField = getByPlaceholderText('Search...')
    expect(searchInputField).toBe('')
    fireEvent.change(inputField,{target: {value: "Avril"}})
    expect(searchInputField).toBe('Avril')


})

test('Test button specified action works', () => {
    let clickWorks = false;
    const component = renderer.create(
            <SearchBar 
            handleClick={(e: any)=> {
                clickWorks = true
            }}
            />
    )
    expect(clickWorks).toBe(false)
    const button = component.root.findByType('button')
    button.props.onClick()
    expect(clickWorks).toBe(true)
})