import React, {useState, useEffect} from 'react';
import './SignUp.css';
import logo from '../Images/logo.png';
import { useStateValue } from '../StateProvider';
import { useHistory } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';


function SignIn() {
    const [{ URL }, dispatch] = useStateValue();
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        alert("To try demo account: \n email : name@gmail.com \n password : abcdefgh")
    }, [])

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const signIn = () => {
        // console.log(email);
        // console.log(password);

        if (! validateEmail(email)){
            alert("Email Id is invalid");
            return;
        }

        if (email.length === 0 || password.length === 0){
            alert("Fields cannot be empty");
            return ;
        }

        //get access_token, refresh_token, store in local storage
        // get user_details and store in global state and redirect to home

        const params = {email, password}
        axios.post(URL + '/auth/signin', params)
        .then(res => {
            console.log(res);
            const accessToken = res.data.accessToken;
            const refreshToken = res.data.refreshToken;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user_id", email);

            dispatch({
                'type' : 'SET_USER',
                user_id : email
            });

            history.push("/");
            

        })
        .catch(err => {
            console.log(err.response);
            alert(err.response.data.message);
        })

    }

    return (
        <div className="main">
            <main className="form-signin text-center rounded bg-light">
  <form>
    <img className="mb-4 img-fluid rounded" src={logo} alt=""  />
    <h1 className="h3 mb-3 fw-normal">Sign In</h1>

    <div className="form-floating">
      <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" 
      value={email} onChange={e => setEmail(e.target.value)}/>
      <label for="floatingInput">Email address</label>
    </div>
    
    <div className="form-floating">
      <input type="password" className="form-control" id="floatingPassword" placeholder="Password" 
      value={password} onChange={e => setPassword(e.target.value)} />
      <label for="floatingPassword">Password</label>
    </div>

    </form>
    <p className="mt-2">Don't have an accout? <Link to="/signup">Sign Up</Link></p>
    <button className="w-100 btn btn-lg btn-info" onClick={signIn}>Sign In</button>
   
  
</main>
        </div>
    )
}

export default SignIn
