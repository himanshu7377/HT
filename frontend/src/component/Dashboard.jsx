import React, { useState ,useEffect} from "react";


function Dashboard() {
  // State variable to track user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 
  let username = sessionStorage.getItem("userName");

  useEffect(() => {
    if(username=='admin'){
      setIsLoggedIn(true);
    }
    
   

    
  },[username,isLoggedIn])
  
  
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
