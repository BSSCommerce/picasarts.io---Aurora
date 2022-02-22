import {useCallback, useContext, useEffect, useState} from "react";
import {
    TextField,
    Button,
    Grid
} from "@mui/material";
import Web3Context, { Web3Provider } from "src/context/Web3Context";
import ImageUpload from "src/components/common/ImageUpload";
import { uploadToCrust } from "near-crust-ipfs";
const REQUIRED_ATTR_LIST = ["title", "description", "royalty"];
import { nftAddress } from "src/config/contractAddress";
const CreateNFT = () => {
    const [coverPhoto, setCoverPhoto] = useState('');
    const [nftFile, setNftFile] = useState('');
    const [cost, setCost] = useState();
    const [newAttributeName, setNewAttributeName] = useState("")
    const { mint, getUserCollections } = useContext(Web3Context);
    const [metaData, setMetaData] = useState({ title: "", description: "", royalty: "" });
    const handleInputChange = (field, value) => {
        console.log(metaData);
        console.log(field);
        console.log(value);
        const newMetaData = { ...metaData };
        switch (field) {
            case "royalty":
                value = value.replace(/[^0-9]+/g, "");
                if (parseInt(value) > 20) {
                    console.log('Alert!', "Royalty cannot exceed 20%", 'error', 1000);
                    value = "20"
                }

                break;
            default:

        }
        newMetaData[field] = value;
        setMetaData(newMetaData);

    }
    const handleNewAttribute = (value) => {
        if ([...Object.keys(metaData), "creator", "image", "file"].includes(value)) {
            console.log('Alert!', "Attribute Field Already Exists!", 'error', 2000)
            return false;
        }
        else {
            const newMetaData = { ...metaData };
            newMetaData[value] = ""
            setMetaData(newMetaData);
            setNewAttributeName("");
        }

    }
    const handleDeleteAttribute = (attribute) => {
        const newMetaData = { ...metaData };
        delete newMetaData[attribute];
        setMetaData(newMetaData);
    }
    useEffect(() => {
    }, [])
    const createNFTFromData = useCallback(async () => {
        try {
            const {cid, path} = await uploadToCrust( nftFile );
            console.log("CID PATH", cid, path);
            let meta = Buffer.from(`{"title": "${metaData.title}", "description": "${metaData.description}", "cid": "${cid}"}`, "utf-8").toString('hex')
            const txn = await mint(meta, metaData.royalty, nftAddress);
            if (txn) {
                console.log(txn);
            }
        } catch (e) {
            console.log(e);
        }


    }, [nftFile])
    return (
        <Grid container spacing={2}>
            {/*<NFTPreview {...metaData} />*/}

            <Grid item xs={8}>
                <h4>Create New Item</h4>
                <div className={"minting-form"}>
                    <h5><span style={{color: "red"}}>*</span> Required fields</h5>
                    <form onSubmit={e => e.preventDefault() && createNFTFromData()}>
                        <div>
                            <div>
                                {Object.keys(metaData).map((attribute) => {
                                    if (typeof metaData[attribute] === "string") {
                                        return (<div className={"form-control"}>
                                                <TextField
                                                    fullWidth
                                                    label={attribute}
                                                    value={metaData[attribute]}
                                                    onChange={(e) => handleInputChange(attribute, e.target.value)}/>
                                                {!REQUIRED_ATTR_LIST.includes(attribute) ?
                                                    <span onClick={() => handleDeleteAttribute(attribute)}
                                                          className="cursor-pointer w-8 h-8">Delete</span> : <></>}

                                            </div>


                                        );

                                    }
                                })}
                                <h3>Add Attributes(Optional)</h3>
                                <div className={"form-control"}>
                                    <TextField
                                        label="Attribute Name"
                                        variant={"outlined"}
                                        value={newAttributeName}
                                        onChange={(e) => setNewAttributeName(e.target.value)}
                                    />
                                    <Button variant={"contained"} onClick={() => handleNewAttribute(newAttributeName)}>
                                        + Add Attribute
                                    </Button>
                                </div>
                                {/*<div className={"form-control"}>*/}
                                {/*    <strong>*/}
                                {/*        <p>Cover Photo <span style={{color: "red"}}>*</span></p>*/}
                                {/*        <p>File types supported: JPG, PNG, GIF Max size: 2 MB</p>*/}
                                {/*    </strong>*/}
                                {/*    <ImageUpload setMedia={setCoverPhoto}/>*/}
                                {/*</div>*/}

                                <div className={"form-control"}>
                                    <strong>
                                        <p>NFT File <span style={{color: "red"}}>*</span></p>
                                        <p>File types supported: JPG, PNG, GIF Max size: 5 MB</p>
                                    </strong>
                                    <ImageUpload setMedia={setNftFile}/>
                                </div>

                            </div>
                            <div>
                                <Button variant={"contained"} onClick={createNFTFromData}>
                                    Create NFT
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

            </Grid>
        </Grid>
    );

}
export default CreateNFT
