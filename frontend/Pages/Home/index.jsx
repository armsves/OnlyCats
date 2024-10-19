import React, { useEffect, useState } from "react"
import { useAuth } from "../../auth";
import ContentCard from "../../components/ContentCard"
import Footer from '../../components/Footer';
import "./index.css";

function Home({ isLoading, profile, setCartItemsCount }) {
  const { backendActor } = useAuth();
  const [products, setProducts] = useState(null);

  useEffect(() => { getProducts() }, [backendActor])

  const getProducts = async () => {
    if (backendActor) {
      let response = await backendActor.getAllActiveProducts();
      setProducts(response)
      console.log("AllActiveProducts", response)
    }
  }

  return (
    <>
      <div className="bigTitle">
        <h1>Welcome to OnlyCats</h1>
        <h4>Your 100% on-chain Cat Content Sharing Platform</h4>
      </div>
      <div className="categories">
        <div className="products">
          {products && products.length > 0 ? (
            products.map(product => (
              <ContentCard key={Number(product.id)} product={product} profile={profile} setCartItemsCount={setCartItemsCount} />
            ))
          ) : (
            <p>No cat content found.</p>
          )}
        </div>
      </div>
      <div className="bigTitle">
        <h1>And coming soon...</h1>
        <div className="imageContainer">
          <img className="content" src="onlyhens.png" alt="OnlyHens" />
          <img className="content" src="onlycows.png" alt="OnlyCows" />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
