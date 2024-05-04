import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  // State variable to track user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  let username = sessionStorage.getItem("userName");

  useEffect(() => {
    
    if(isLoggedIn==false){
      navigate("/login");
    }
    if(username!==null){
      setIsLoggedIn(true);
    }

    
  },[username])
  
  
  return (
    <div className="text-center" style={{ marginTop: "10%" }}>
      {isLoggedIn ? (
        <div className="" style={{ fontWeight: "900", fontSize: "70px" }}>
          Welcome to admin panel
        </div>
      ) : (
        <div>
          <div className="" style={{ fontWeight: "900", fontSize: "30px" }}>
            Please Login
          </div>
          
        </div>
      )}
    </div>
  );
}

export default Dashboard;
