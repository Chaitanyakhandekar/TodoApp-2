import React,{useState,useEffect} from "react";import { Client, Account, ID } from "appwrite";
import {Link} from 'react-router-dom'
import { setUserData } from "../../store/userSlice/userSlice";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {client,account} from '../../appwrite/config'
import Swal from 'sweetalert2';

function Login(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const dispatch = useDispatch()
const userData = useSelector((state)=>state.userData)
const [loading,setLoading] = useState(false)
const navigate = useNavigate()

useEffect(()=>{
    console.log(userData)
},[userData])

useEffect(() => {
    const clearExistingSessions = async () => {
        try {
            // Check if a user is currently logged in
            await account.get(); // This will throw an error if no user is logged in
            await account.deleteSession('current');
            console.log("Session deleted.");
        } catch (error) {
            if (error.code === 401) {
                console.log("No active session to delete.");
            } else {
                console.warn("Error handling session:", error);
            }
        }
    };

    clearExistingSessions();
}, []);

function clearFields(){
    setEmail(null)
    setPassword(null)
}

async function handleLogin(){
    setLoading(true)
    try {
       
        const response = await account.createEmailPasswordSession(email,password)
        const session = await account.get()
        if(response && session){

            localStorage.setItem('userId',response.userId)
            localStorage.setItem('appwriteUserId',response.$id)
            localStorage.setItem('createdAt',response.$createdAt)
            localStorage.setItem('updatedAt',response.$updatedAt)
            
            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome back!`,
                icon: 'success',
                confirmButtonText: 'Continue',
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });

            dispatch(setUserData({
                userId : response.userId,
                appwriteUserId : response.appwriteUserId,
                createdAt : response.createdAt,
                updatedAt : response.updatedAt,
            }))

            setLoading(false)

            navigate('/home')
        }
    } catch (error) {
        Swal.fire({
            title: 'Login Failed!',
            text: error.message || 'Invalid email or password',
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }

    clearFields()
}


return(
    <div className="bg-[#0F172A] w-[100vw] h-[100vh] flex justify-center items-center font-urban">
        <div className="bg-[#1E293B] max-w-md w-full h-[60%] rounded-xl m-2 flex flex-col items-center justify-evenly  text-white">
            <div className="mb-2 mt-2">
                <h1 className="text-3xl font-bold text-center mb-3">ByteCode Todo App</h1>
                <h1 className="text-center text-gray-400">Organize Tasks effortless</h1>
            </div>
            <div className="w-[90%] h-[20%] text-white  ">
                <label>Email</label><br />
                <input type="text" placeholder="Email" className="bg-[#334155] w-full h-[60%] px-3 text-md mt-2  rounded-xl" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
            </div>
            <div className="w-[90%] h-[20%] text-white ">
                <label>Password</label><br />
                <input type="password" placeholder="Password"
                 className="bg-[#334155] w-full h-[60%] px-3 text-md mt-2  rounded-xl"
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                 />
            </div>
            <button className="bg-[#7C3AED] hover:bg-[#6D28D9] mt-2 text-white text-xl font-bold w-[90%] h-[10%] rounded-xl"
            onClick={handleLogin}
            disabled={loading}
            >{loading?"Logging...":"Login"}</button>
            <div className="text-center text-gray-400">
                <p>Don't have account ? <Link to="/signup" className="text-[#7C3AED]">Create account</Link></p>
                <p>Forgot password?</p>
            </div>
        </div>
    </div>
)

}

export default Login;