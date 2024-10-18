import React from 'react';
import "./index.css"
import { useAuth } from "../../auth"

const ContestList = ({ products, lockStart, getProducts }) => {
  const { backendActor } = useAuth()

  const deleteProduct = async (productId) => {
    let response = await backendActor.deleteProduct(Number(productId));
    console.log("product deleted ", response);
    getProducts(); // Refresh the list
  };

  /*
  if (!contests) {
    return <div>Loading...</div>;
  }
  */

  return (
    <div className="ProductsList">
      <h2>Products</h2>
      {products && products.length > 0 ? (products.sort((a, b) => Number(a.id) - Number(b.id)).map(product => (
        <div key={Number(product.id)}>
          {product.name}
          {<button onClick={() => deleteProduct(product.id)}>Delete Product</button>}
        </div>
      ))
      ) : (<p>No products found.</p>)
      }
    </div>
  );
};

export default ContestList;
