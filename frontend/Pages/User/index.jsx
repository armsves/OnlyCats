import React, { useEffect, useState } from "react"
import ProfileEdit from "../../components/ProfileEdit";
import { useNavigate } from "react-router-dom"

function User({ setFileLoader, profile, setIsLoading, isLoading, caller, reLoad, }) {

  return (
    <div className="addCards">
      {!isLoading && (<ProfileEdit reLoad={reLoad} profile={profile} setIsLoading={setIsLoading} />)}
    </div>
  )
}

export default User
