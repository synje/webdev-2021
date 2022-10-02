import ViewSong, { DELETE_SONG } from "../components/ViewSong"
import { MockedProvider } from "@apollo/react-testing";
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer';


const mockDeleteSong = {
    request: {
        query: DELETE_SONG,
        variables: {
            _id: "1234",
            title: "RED-SUN (021)",
            duration: 3.09,
            album: "THE PARK IN THE NIGHT part three",
            year_released: 2019,
            aritst: {
                name1: 'GWSN',
            },
        },
    },
    error: new Error('Error in request'),
};

let property = { _id: "", title: "", duration: 0, album: "", year: 0, artist: [""] }
function getView(_id: string, title: string, duration: number, album: string, year: number, artist: Array<any>) {
    let artistArray: any[] = []
    artist.map((name: any) => {
        artistArray.push(name.name1)
        if (artist[0].name2) {
            artistArray.push(", ", name.name2)
        }
    })
    property = { _id: _id, title: title, duration: duration, album: album, year: year, artist: artistArray }
}
getView("698gjd7494hfjdk", "tittel", 0.12, "album", 2012, [{name1: "Artist1"}])


it('ViewSong loades', async () => {
    const component = await TestRenderer.create(
        <MockedProvider mocks={[mockDeleteSong as any]}>
            {getView("698gjd7494hfjdk", "tittel", 0.12, "album", 2012, [{name1: "Artist1"}])}
            <ViewSong property = {property}/>
        </MockedProvider>
    )

    const tree = component.toJSON() as ReactTestRendererJSON
    if(tree != null){
        expect(tree.children).toContain('Loading...')
    
    }
    }
)

test('Snapshot ViewSong', async () =>{
    const tree = TestRenderer.create(
    <MockedProvider mocks={[mockDeleteSong as any]}>
         {getView("698gjd7494hfjdk", "tittel", 0.12, "album", 2012, [{name1: "Artist1"}])}
        <ViewSong property={property} />
    </MockedProvider>)
    expect(tree).toMatchSnapshot()

})