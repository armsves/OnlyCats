import React, { useState, useEffect } from "react"
import NewCategory from "../../components/NewCategory"
import NewProduct from "../../components/NewProduct"
import ProductsList from "../../components/ProductsList";
import OrdersList from "../../components/OrdersList";
import CategoriesList from "../../components/CategoriesList";
import { useAuth } from '../../auth';
import "./index.css";
import Footer from '../../components/Footer';

function User({ setFileLoader, profile, setIsLoading, isLoading, caller, reLoad, categories, getCategories }) {
  const { backendActor, isAuthenticated } = useAuth();
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);

  const getProducts = async () => {
    setIsLoading(true);
    if (backendActor) {
      let response = await backendActor.getAllActiveProducts();
      //console.log("AllActiveProducts", response)
      await setProducts(response)
    }
    setIsLoading(false);
  }

  const getOrders = async () => {
    //console.log('backendActor',backendActor)
    setIsLoading(true);
    if (backendActor) {
      let response = await backendActor.getAllOrders();
      //console.log("Orders", response)
      await setOrders(response)
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getProducts();
    getOrders();
  }, [
    //isAuthenticated, 
    backendActor])

  /*
  if(!profile.admin){
    return null;
  }*/

  return (
    <>
      <div className="addCards">
        {!isLoading && (<NewCategory caller={caller} profile={profile} setIsLoading={setIsLoading} loading={isLoading} setFileLoader={setFileLoader} getCategories={getCategories} />)}
        {!isLoading && (<NewProduct caller={caller} profile={profile} setIsLoading={setIsLoading} loading={isLoading} setFileLoader={setFileLoader} categories={categories} getProducts={getProducts} />)}
        {!isLoading && (<CategoriesList categories={categories} getCategories={getCategories} />)}
        {!isLoading && (<ProductsList products={products} getProducts={getProducts} />)}
        {!isLoading && (<OrdersList orders={orders} getOrders={getOrders} profile={profile} />)}
      </div>
      <Footer />
    </>
  )
}

export default User
