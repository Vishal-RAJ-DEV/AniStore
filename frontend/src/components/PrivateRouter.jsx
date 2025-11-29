import { Outlet , Navigate } from "react-router";
import { useSelector } from "react-redux";

const PrivateRouter = () =>{
    const {userInfo } =  useSelector((state) => state.auth);
    return userInfo ? <Outlet/> : <Navigate to = "/login" replace/>; 
    //here what is happening is if userinfo is present then it will render the child component of the private route which is <Outlet/> should be done in the main.jsx
    //  otherwise it will navigate to login page
}
export default PrivateRouter;

