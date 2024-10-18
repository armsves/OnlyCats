import React, { useEffect, useState } from "react";
import "./index.css";
import { useAuth } from '../../auth';
import { getEnabledCategories } from "trace_events";

const NewCategory = ({ setIsLoading, loading, setModal, setModalMsg, setFileLoader, getAllUnactiveContests, profile, getCategories }) => {
  const { backendActor, isAuthenticated } = useAuth();
  const [name, setName] = useState(null);

  const onSubmit = async () => {
    //if (date && name && winners) {
    if (name) {
      let category = {
        name: name,
        //winners: winners,
        //end: new Date(date).getTime()
      }
      console.log('profile', profile);
      let responses = await backendActor.createCategory(category)
      //getAllUnactiveContests()
      getCategories();
      console.log("Category has been created", responses)
    } else {
      setModal(true)
      setModalMsg("Category name is needed")
    }
  };

  return (
    <div className="NewCategory" >
      <h2>Create New Category</h2>
      <label>Name:{" "}
        <input type="text" name="name" placeholder="Enter category name" onChange={e => setName(e.target.value)} />
      </label>
      <div><button onClick={() => onSubmit()}>Submit</button></div>
    </div>
  );
};

export default NewCategory;
