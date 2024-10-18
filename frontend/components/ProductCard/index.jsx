import React, { useState, useEffect, useRef } from 'react';
import "./index.css";
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoadingContent({ isLoading, imgSrc }) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="LoadingContent">
      <img src="onlycats.png" alt="Loading..." />
      <p className="loading-text">Loading...</p>
    </div>
  );
}

function ProductCard({ product, profile, setCartItemsCount }) {
  const { backendActor, isAuthenticated } = useAuth();
  const [imgSrc, setImgSrc] = useState(null);
  const [profilePicBlob, setProfilePicBlob] = useState(null);
  const [content, setContent] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef < HTMLVideoElement > (null);
  const navigate = useNavigate();


  useEffect(() => { getContent(); }, []);
  useEffect(() => { getCartItemsCount(); }, [profile]);

  useEffect(() => {
    if (profilePicBlob) {
      //console.log("proposal profilePic",profilePic)
      //let image = new Uint8Array([...profilePicBlob]);
      let blob = new Blob(profilePicBlob, { type: 'image/png' });
      let reader = new FileReader();
      reader.onload = function (e) {
        setProfilePic(e.target.result);
      }
      reader.readAsDataURL(blob);
    } else {
      //  getContent()
    }
    if (content) {
      if ('Image' in content) {
        let image = new Uint8Array(content.Image);
        let blob = new Blob([image], { type: 'image/png' });
        let reader = new FileReader();
        reader.onload = function (e) {
          setImgSrc(e.target.result);
        }
        reader.readAsDataURL(blob);
      } else if ('Video' in content && videoUrl === null) {
        fetchVideoChunks(Number(product.id), Number(content.Video)).then((blobURL) => {
          //   setVideoUrl(blobURL);
        });
      }
    }
  }, [content, videoRef, profilePicBlob]); // only re-run when 'content' changes

  const renderContent = () => {
    // while fetching Image or Video
    if ('Image' in content && !imgSrc) {
      return <LoadingContent isLoading={true} imgSrc={"onlycats.png"} />;
    } else if ('Video' in content && !videoUrl) {
      return <LoadingContent isLoading={true} imgSrc={"onlycats.png"} />;
    } else if ('Image' in content) {
      return imgSrc ? <img id={`product-img${Number(product.id)}`} className="content" src={imgSrc} alt="Content" /> : null;
    } else if ('Video' in content) {
      return videoUrl ? <video id={`product-video${Number(product.id)}`} className="content" src={videoUrl} controls /> : null;
    }
  }

  // Function to fetch video chunks
  const fetchVideoChunks = async (productId, totalChunks) => {
    let newChunks = [];
    for (let i = 0; i < totalChunks + 1; i++) {
      const chunkData = await backendActor.getVideoChunk(productId, i);
      newChunks = [...newChunks, ...chunkData]

    }
    const videoData = new Uint8Array(newChunks);
    const blob = new Blob([videoData], { type: 'video/mp4' });
    const myFile = new File(
      [blob],
      "demo.mp4",
      { type: 'video/mp4' }
    );

    let reader = new FileReader();
    reader.onload = function (e) {
      setVideoUrl(e.target.result);
    }
    reader.readAsDataURL(myFile);
    //return blob;
  }

  const getCartItemsCount = async () => {
    if (profile && profile.name) {
      let response = await backendActor.getCartItemsNumber(profile.name);
      setCartItemsCount(response);
    }
  }

  const getContent = async () => {
    let caller = await backendActor.getContent(Number(product.id));
    setContent(caller);
  }

  const addToCart = async () => {
    if (profile && profile.name) {
      let response = await backendActor.addToCart(product.id, profile.name);
      if (response) {
        toast.success("Product added to cart");
        getCartItemsCount();
      }
    } else {
      toast.warning("Please connect your wallet!");
    }
  };

  return (
    <div className={`ProductPicture`}>
      <div className="image-container">
        <h6>{product.name} on ICP Asset Canister</h6>
        {content && renderContent()}
      </div>
      <div className="image-container">
      <h6>{product.name} on Walrus</h6>
      {product.contentWalrus && <img src={`https://aggregator.walrus-testnet.walrus.space/v1/${product.contentWalrus}`} alt="Walrus" />}
      </div>
      <div className="footer">
          <button className="addButton" onClick={addToCart}>Subscribe</button>
        </div>
    </div>
  );
}

export default ProductCard;
