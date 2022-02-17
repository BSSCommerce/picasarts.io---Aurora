import Web3Context from "src/context/Web3Context";
import {useState, useCallback, useContext, useEffect} from "react";

export default function Index() {
    const { getUserCollections, totalCollections, getCollections } = useContext(Web3Context);
    const [userCollections, setUserCollections] = useState([]);
    const [allCollections, setAllCollections] = useState(undefined);
    const [fetchedCollections, setFetchedCollections] = useState(0);
    const [totalCollectionsN, setTotalCollections] = useState(0);
    useEffect(() => {
        const getAllCollections = async () => {
            const result = parseInt((await totalCollections()).toString());
            setTotalCollections(result);
            setAllCollections((await getCollections(0, Math.min(5, result)))[0]);
            setFetchedCollections(Math.min(2, result));

        }
        getAllCollections();
        getUserCollections().then(data => setUserCollections(data));

    }, [])


    const ListOfUserCollections = () => {
        return (<div className="grid grid-cols-3 gap-4">

            {userCollections.map((collection) => {
                return (<>collection</>);
            })}
        </div>);
    }
    return (
        <>
            Index Page
            <ListOfUserCollections />
        </>
    )
}