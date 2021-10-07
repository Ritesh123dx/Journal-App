import React, {useEffect} from 'react';
import Journals from './Journals';
import './Main.css';
import NewJournalModal from './NewJournalModal';
import { useStateValue } from '../StateProvider';
import {useHistory} from 'react-router';
import axios from 'axios';


function Main() {
    
    const [{ URL, user_id }, dispatch] = useStateValue();
    const history = useHistory();

    const logOut = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user_id");

      history.push("/signin");
  }

    useEffect(async () => {
       const params = {user_id : user_id};
       console.log(user_id);
       
       const accessToken = localStorage.getItem("accessToken");
       const refreshToken = localStorage.getItem("refreshToken");

       if (accessToken === null || accessToken === undefined || refreshToken === null || refreshToken === undefined){
         logOut();
         return;
       }

       try{
        const res = await axios.get(URL + '/journals', {
            params : params,
            headers : {'Authorization' : 'Bearer ' + accessToken}
        },)

        console.log(res.data.journals);
            dispatch({
                type : 'SET_JOURNAL',
                journals : res.data.journals
            })

      }
      catch(err){
        console.log(err.response);
        const errMessage = err.response.data.message;
        const isLogout = err.response.data.logout;

        if (isLogout){
          logOut();
        }

        if (errMessage === 'Token Expired'){
          // alert("Token Expired");

            try{
              const tokenResponse = await axios.post(URL + '/auth/refresh', {user_id}, {headers : {'Authorization' : 'Bearer ' + refreshToken}});
              console.log(tokenResponse);
              const newAccessToken = tokenResponse.data.accessToken;
              localStorage.setItem("accessToken", newAccessToken);
              
              //dispatch to update new AccessToken
              const res = await axios.get(URL + '/journals', {
                params : params,
                headers : {'Authorization' : 'Bearer ' + newAccessToken}
            },)
                console.log(res);
                // console.log(res.data.journals);
                    dispatch({
                        type : 'SET_JOURNAL',
                        journals : res.data.journals
                    })
              
            }
            catch(err){
              console.log(err.response);
              const isLogout = err.response.data.logout;

              if (isLogout){
                logOut();
              }

             


            }
            
        }
        
      }

    }, [])

    return (
        <div className="container">
            <button className="btn btn-info shadow" data-bs-toggle="modal" data-bs-target="#new_journal">Create New Journal</button>

       
            <NewJournalModal />

            <Journals />

        </div>
    )
}

export default Main
