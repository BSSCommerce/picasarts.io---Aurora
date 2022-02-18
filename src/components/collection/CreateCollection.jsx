import { useContext, useEffect, useState } from "react";
import {
    TextField,
    Button, Grid
} from "@mui/material";
import Web3Context, { Web3Provider } from "src/context/Web3Context";
import CollectionCard from "./CollectionCard";
import ImageUpload from "src/components/common/ImageUpload";
import { uploadToCrust } from "near-crust-ipfs";
import {nftAddress} from "../../config/contractAddress";
const CreateCollection = () => {
    const [cost, setCost] = useState()

    const { getCollectionCreationPrice, createCollection } = useContext(Web3Context);
    const [collectionBanner, setCollectionBanner] = useState();
    const [metaData, setMetaData] = useState({ name: "", symbol: "", title: "", description: "", image: "", file: "" });
    const handleInputChange = (field, value) => {
        const newMetaData = { ...metaData };
        newMetaData[field] = value;
        setMetaData(newMetaData);

    }
    useEffect(() => {
        const getF = async () => {
            setCost((await getCollectionCreationPrice()).toNumber());
        }
        getF();
    }, [])
    const createCollectionFromData = async () => {
        // showAlert('Alert!', "Uploading File to IPFS.....", 'primary', 1000);
        //
        // const added = await pinFileToIPFS(metaData.file);
        // showAlert('Alert!', "File Uploaded, uploading metadata....", 'primary', 1000);
        //
        // console.log(added);
        // const { IpfsHash } = added.data;
        // const newJson = {
        //     title: metaData.title,
        //     subtitle: metaData.subtitle,
        //     description: metaData.description,
        //     image: IpfsHash,
        // }
        // const finalHash = await pinJSONToIPFS({ ...metaData, image: IpfsHash });
        // showAlert('Alert!', "Meta Data Uploaded! Please complete the transaction", 'primary', 3000);
        //
        // const txn = await createCollection(metaData.name, metaData.symbol, finalHash.data.IpfsHash, cost.toString());
        // if (txn) {
        //     console.log(txn);
        //     history.push("/myCollections")
        //
        // }
        // else {
        //     showAlert('Alert!', "Failure, reverting changed", 'danger', 3000);
        //
        //     unPin(IpfsHash);
        //     unPin(finalHash.data.IpfsHash);
        // }

        // const reader = new window.FileReader();
        // reader.readAsArrayBuffer(metaData.file);
        // reader.onloadend = async () => {
        //     console.log()
        //     const result = await uploadFile(reader.result);
        //     console.log(result);
        // }


        try {
            const {cid, path} = await uploadToCrust( collectionBanner );
            let meta = Buffer.from(`{tile: "${metaData.title}", subtitle: "${metaData.subtitle}", description: "${metaData.description}", cid: "${cid}"}`, "utf-8").toString('hex')
            const txn = await createCollection(metaData.name, metaData.symbol, meta, cost.toString());
            if (txn) {
                console.log(txn);
            }
        } catch (e) {
            console.log(e);
        }

    }
    return (
        <Grid container spacing={2}>
            {/*<CollectionCard metaData={metaData} />*/}

            <Grid item xs={8}>
                <h4>Create New Collection</h4>
                <div className={"minting-form"}>
                    <h5><span style={{color: "red"}}>*</span> Required fields</h5>
                    <form onSubmit={e => e.preventDefault() && createCollectionFromData()}>
                        <div>
                            <div>
                                <div className={"form-control"}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={metaData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                    />
                                </div>
                                <div className={"form-control"}>
                                    <TextField
                                        fullWidth
                                        label="Symbol"
                                        value={metaData.symbol}
                                        onChange={(e) => handleInputChange("symbol", e.target.value)}
                                    />
                                </div>
                                <div className={"form-control"}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={metaData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                    />
                                </div>
                                <div className={"form-control"}>
                                    <TextField
                                        fullWidth
                                        label="Subtitle"
                                        value={metaData.subtitle}
                                        onChange={(e) => handleInputChange("subtitle", e.target.value)}
                                    />
                                </div>
                                <div className={"form-control"}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={metaData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                    />
                                </div>
                                <div className={"form-control"}>
                                    <strong>
                                        <p>Collection Banner <span style={{color: "red"}}>*</span></p>
                                        <p>File types supported: JPG, PNG, GIF Max size: 5 MB</p>
                                    </strong>
                                    <ImageUpload setMedia={setCollectionBanner}/>
                                </div>
                            </div>
                            <div>
                                <Button variant={"contained"} onClick={createCollectionFromData}>
                                    Save({cost})
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

            </Grid>
        </Grid>
    );
}
export default CreateCollection