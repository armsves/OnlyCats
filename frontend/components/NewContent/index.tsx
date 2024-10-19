import React, { useEffect, useState } from "react";
import "./index.css";
import { useAuth } from '../../auth';

const NewContentForm = ({ setIsLoading, loading, setModal, setModalMsg, setFileLoader, categories, getContents }) => {
  const { backendActor, isAuthenticated, principal } = useAuth();

  const [proposalType, setProposalType] = useState("Image");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [period, setPeriod] = useState(null);
  const [description, setDescription] = useState("");
  //const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
  }, [loading])

  const MAX_CHUNK_SIZE_VIDEO = 1024 * 500; // 500kb
  const MAX_CHUNK_SIZE_IMG = 2048 * 2048
  const [file, setFile] = useState(null);
  let MAX_CHUNK_SIZE

  const uploadFileInChunks = async (file) => {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB in bytes

    //////////////

    let contentWalrus
    let contentSwarm
    let contentIexec

    const numEpochs = 2;
    const basePublisherUrl = "https://walrus-testnet-publisher.nodeinfra.com";
    const baseAggregatorUrl = "https://aggregator.walrus-testnet.walrus.space";

    setIsLoading(true)

    ////////////// Walrus

    const resp = await fetch(`${basePublisherUrl}/v1/store?epochs=${numEpochs}`, {
      method: "PUT",
      body: file,
    }).then((response) => {
      if (response.status === 200) {
        // Parse successful responses as JSON, and return it along with the
        // mime type from the the file input element.
        return response.json().then((info) => {
          console.log(info);
          //return { info: info, media_type: inputFile.type };
          if (info.alreadyCertified) {
            contentWalrus = info.alreadyCertified.blobId;
          } else { 
            contentWalrus = info.newlyCreated.blobObject.blobId;
          }
        });
      } else {
        throw new Error("Something went wrong when storing the blob!");
      }
    })
  
    ////////////// Swarm

    const respSwarm = await fetch("http://127.0.0.1:1633/bzz", {
      method: "POST",
      headers: {
        "Content-Type": "binary/octet-stream",
        "Swarm-Postage-Batch-Id": "d1bc4457046597d552faa10f4f349d89dbbc995d1c218dd4188a36d482a98385",
        "Swarm-Encrypt": "false",
      },
      body: file,
    });

    if (respSwarm.ok) {
      const info = await respSwarm.json();
      console.log("info.reference",info.reference);
      contentSwarm = info.reference;
    } else {
      //console.log("response", respSwarm);
      throw new Error("Something went wrong when storing the blob!");
    }

    //console.log("respSwarm", respSwarm);

    /////////////

    if (file.size < maxSizeInBytes) {
      // File is smaller than 10 MB
      //console.log("File is smaller than 10 MB");
    } else {
      // File is larger than or equal to 10 MB
      setModalMsg("the file needs to be smaller then 10 MBs");
      setModal(true);
      //console.log("File is larger than or equal to 10 MB");
      return
    }

    let position = 0;
    let proposalId;
    let chunkIndex = 0;
    //setIsLoading(true)
    if (proposalType === "Video") {
      MAX_CHUNK_SIZE = MAX_CHUNK_SIZE_VIDEO;
    } else if (proposalType == "Image") {
      MAX_CHUNK_SIZE = MAX_CHUNK_SIZE_IMG;
    }
    const roundedNumber = Math.ceil(file.size / MAX_CHUNK_SIZE);

    while (position < file.size) {
      setFileLoader({
        isOpen: true,
        currentIndex: chunkIndex,
        totalChunks: roundedNumber
      })
      const fileChunk = file.slice(position, position + MAX_CHUNK_SIZE);
      const arrayBuffer = await fileChunk.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      let content

      if (proposalType === "Video") {
        content = { "Video": 0 }
      } else if (proposalType === "Text") {
        content = { "Text": 0 }
      } else {
        content = { [proposalType]: [...uint8Array] };
      }
      // This is the first chunk, so create a new proposal
      if (position === 0) {
        const product = { category, name, period: Number(period), ownerPrincipal: principal,active: true, content, contentWalrus, contentSwarm, contentIexec: "" };
        //console.log('product', product)

        proposalId = await backendActor.addNewContent(product);
        //console.log("Content Picture", Number(proposalId.ok))
        if (proposalType === "Video") {
          //console.log("Uploading video", chunkIndex, [...uint8Array])
          await backendActor.addProposalVideoChunk(Number(proposalId.ok), [...uint8Array], chunkIndex);
          chunkIndex = chunkIndex + 1;
          //console.log("what that in incrementing?", chunkIndex)
        }
      } else {
        // This is not the first chunk, so add it to the existing proposal
        //console.log("what that heck?", proposalType)
        if (proposalType === "Video") {
          console.log("Uploading video", chunkIndex, [...uint8Array])
          await backendActor.addProposalVideoChunk(Number(proposalId.ok), [...uint8Array], chunkIndex);
          chunkIndex = chunkIndex + 1;
        }
      }
      if (proposalType !== "Video") {
        //console.log("adding proposal chunk",)
        await backendActor.addProposalChunk(Number(proposalId.ok), [...uint8Array]);
        chunkIndex = chunkIndex + 1;
      }
      //console.log("next position?", MAX_CHUNK_SIZE, chunkIndex);
      position += MAX_CHUNK_SIZE;

    };
    setFileLoader({
      isOpen: false,
      currentIndex: 0,
      totalChunks: 0
    })
    setIsLoading(false)
    getContents();
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const onSubmit = async () => {
    console.log("file", file);
    if (file) {
      uploadFileInChunks(file);
    }
  };
  /*
    useEffect(() => {
      getCategories()
    }, [backendActor])
  */

  const handleDropdownChange = (e) => {
    const selectedCategoryId = e.target.value;
    //console.log('Selected category ID:', selectedCategoryId);
    setCategory(selectedCategoryId);
  };

  return (
    <div className="NewContent" >
      <h2>Create new Content</h2>
      <label htmlFor="dropdownMenu">Category:
        <select id="dropdownMenu" defaultValue={""} onChange={handleDropdownChange} >
          <option value="" disabled>Select a category</option>
          {categories && categories.sort((a, b) => Number(a.id) - Number(b.id))
            .map(item => (<option key={Number(item.id)} value={Number(item.id)}>{item.id + ' ' + item.name}</option>))
          }
        </select>
      </label>
      <label>Name:{" "}
        <input type="text" name="name" placeholder="Enter product name" onChange={e => setName(e.target.value)} />
      </label>
      <label>Price:{" "}
        <input type="number" name="price" placeholder="Enter subscription price" onChange={e => setPrice(e.target.value)} />
      </label>
      <label>Time Period:{" "}
        <input type="number" name="period" placeholder="Enter time period" onChange={e => setPeriod(e.target.value)} />
      </label>

      <label className="file-input">
        Select a file:{" "}
        <input type="file" name="file" onChange={e => { onFileChange(e) }} />
        <span>{proposalType}</span>
      </label>
      <div><button onClick={() => onSubmit()}>Submit</button></div>
    </div>
  );
};

export default NewContentForm;
