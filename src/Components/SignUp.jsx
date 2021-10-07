import React, {useState} from 'react';
import './SignUp.css';
import logo from '../Images/logo.png';
import { useStateValue } from '../StateProvider';
import { useHistory } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SignUp() {
    const [{ URL }, dispatch] = useStateValue();
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [user_name, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const signUp = () => {
        console.log(email, user_name, password, confirmPassword);
        
        if (! validateEmail(email)){
            alert("Plz enter valid Email ID");
            return;
        }

        else if (user_name.length < 1 || user_name.length > 20){
            alert("Plz enter valid userName of length between 1 - 20");
            return ;
        }

        else if (password.length < 8){
            alert("Password should be atleast 8 characters");
            return ;
        }

        else if (password !== confirmPassword){
            alert("Passwords do not match");
            return ;
        }

      // After success redirect to login page
      const date = new Date().toLocaleDateString('en-GB');
      const params = {user_name, email, password, date};
      console.log(params);
      axios.post(URL + '/auth/signup', params)
      .then(res => {
        console.log(res);
        console.log("Sign Up successful");
        history.push('/signin');
      }
      )
      .catch(err => {

        if (err.response.status === 400){
          alert(err.response.data.message);
        }
        
      });


    }

    return (
        <div className="main">
            <main className="form-signin text-center rounded bg-light">
  <form>
    <img className="mb-4 img-fluid rounded" src={logo} alt=""  />
    <h1 className="h3 mb-3 fw-normal">Sign Up</h1>
      
    <div className="form-floating">
      <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" 
      value={email} onChange={e => setEmail(e.target.value)}/>
      <label for="floatingInput">Email address</label>
    </div>
    <div className="form-floating">
      <input type="text" className="form-control" id="floatingInput" placeholder="Your Name"  
      value={user_name} onChange={e => setUsername(e.target.value)} />
      <label for="floatingInput">User Name</label>
    </div>
    <div className="form-floating">
      <input type="password" className="form-control" id="floatingPassword" placeholder="Password" 
      value={password} onChange={e => setPassword(e.target.value)} />
      <label for="floatingPassword">Password</label>
    </div>
    
    <div className="form-floating">
      <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <label for="floatingPassword">Confirm Password</label>
    </div>

    </form>
    <p className="mt-2">Already have an accout? <Link to="/signin">Sign In</Link></p>
    <button className="w-100 btn btn-lg btn-info mt-1" onClick={signUp}>Sign Up</button>
   
  
</main>
        </div>
    )
}

export default SignUp
