import axios from 'axios';
import React, {useState, useRef} from 'react';
import { useStateValue } from '../StateProvider';
import {useHistory} from 'react-router';


function NewJournalModal() {

    const [{URL, user_id}, dispatch] = useStateValue();
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    
    const modalRef = useRef();


    const logOut = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      history.push("/signin");
  }

    const createJournal = async () => {

      const trimmedTitle = title.trim();
      const trimmedDesc = description.trim();

      if (trimmedTitle.length === 0){
        alert("Title cannot be empty");
        return;
      }
      if (trimmedDesc.length === 0){
        alert("Description cannot be empty");
        return;
      }
      
      const d = new Date();
      const journal_id = d.getTime();

      const dateString = formatDate(d);
      console.log("DateString --> ", dateString);

      const accessToken = localStorage.getItem("accessToken");

      const refreshToken = localStorage.getItem("refreshToken");

      const params = {
        user_id : user_id,
        journal_id : journal_id,
        title : trimmedTitle,
        description : trimmedDesc,
        date : dateString
      }

      try{
        const res = await axios.post(URL +'/journals/add', params, {headers : {'Authorization' : 'Bearer ' + accessToken}})

        console.log(res);
        dispatch({
                type : "ADD_JOURNAL",
                date : dateString,
                journal_id : journal_id,
                title : trimmedTitle,
                description : trimmedDesc
              });

        modalRef.current.click();
        setTitle("");
        setDesc("");

      }
      catch(err){
        console.log(err.response);
        const errMessage = err.response.data.message;
        const isLogout = err.response.data.logout;

        if (isLogout){
          // alert("Perform LogOut");
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
              const res = await axios.post(URL +'/journals/add', params, {headers : {'Authorization' : 'Bearer ' + newAccessToken}})

              console.log(res);
              dispatch({
                      type : "ADD_JOURNAL",
                      date : dateString,
                      journal_id : journal_id,
                      title : trimmedTitle,
                      description : trimmedDesc
                    });

              modalRef.current.click();
              setTitle("");
              setDesc("");
              
            }
            catch(err){
              console.log(err.response);
              const isLogout = err.response.data.logout;

              if (isLogout){
                // alert("Performing Logout after refresh not done");
                logOut();
              }


            }
            
        }
        
      }

        
    }

    function formatDate(d){
      const monthDict = {0 : 'Jan', 1 : 'Feb', 2 :'March', 3 : 'April', 4 : 'May', 5 : 'June', 6 : 'July', 7 : 'Aug', 8 : 'Sept', 9 : 'Oct', 10 : 'Nov', 11 : 'Dec'}

      const localeDateString = d.toLocaleDateString('en-GB');
      
      const day = localeDateString.split("/")[0];
      const year = d.getFullYear();
      const month = monthDict[d.getMonth()];
      
      return day + " " + month + " " + year;


    }

    return (
        
<div className="modal fade" id="new_journal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title text-center" id="exampleModalLabel">New Journal</h4>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">

            <div className="form-group row mt-4">
                <label className="col-sm-3 col-form-label">Title :</label>
                <div className="col-sm-8">
                    <input type="text" className="form-control shadow"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      />
                </div>
            </div>

            <div className="form-group row mt-4">
                <label className="col-sm-3 col-form-label">Description :</label>
                <div className="col-sm-8">
                <textarea className="form-control"  rows="3"
                  value={description}
                  onChange={e => setDesc(e.target.value)}
                ></textarea>
                </div>
            </div>


      </div>
      <div className="modal-footer">
        <button ref={modalRef} type="button" className="btn btn-secondary d-none" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-info w-50 ms-auto me-auto" disabled={false} onClick={createJournal}>Create Journal</button>
      </div>
    </div>
  </div>
</div>
    )
}

export default NewJournalModal;
