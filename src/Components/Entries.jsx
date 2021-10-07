import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from 'react-router';
import { useStateValue } from '../StateProvider';
import {BiDownvote, BiTrash, BiEdit, BiCheck, BiXCircle} from 'react-icons/bi';

function Entries() {

    const [{ selected_journal }, dispatch] = useStateValue();
    const history = useHistory();

    useEffect(() => {
      if (Object.keys(selected_journal).length === 0){
          history.push('/');
      }
    }, [])
  

  
    return (
        <div className="container">
            <button className="btn btn-info shadow mb-3" data-bs-toggle="modal" data-bs-target="#new_entry">Create New Entry</button>

            <EntryModal />

            <h3 className="my-4"><span className="badge bg-success shadow-lg">Journal Name : {selected_journal.title} </span></h3>
            
            <EntryTab />

        </div>
    )
}


function EntryTab(){

    const [{URL, user_id, selected_journal }, dispatch] = useStateValue();

    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");


    

    const saveEdit = () => {
      let editTextLines = editText.trim().split(".");
      let formatEditText = editTextLines.join(".</br>");
      console.log("t---->", formatEditText);

      const params = {
        user_id : user_id,
        journal_id : selected_journal.journal_id,
        entry_id : editId,
        description : editText.trim()
      }

      axios.patch(URL + '/journals/entries/update', params)
      .then(res => {
        console.log(res);
        dispatch({
          'type' : 'EDIT_ENTRY',
            entry_id : editId,
            description : editText.trim()
        });
        setEdit(false);
        setEditId(null);
        setEditText("");
      })
      .catch(err => console.log(err));
      

    }

    const cancelEdit = () => {

      setEdit(false);
      setEditId(null);
      setEditText("");

    }
    
    
    const deleteEntry = (entry_id) => {

      const params = {
        user_id : user_id,
        journal_id : selected_journal.journal_id,
        entry_id : entry_id
      };

      axios.delete(URL + '/journals/entries/delete', { data : params})
      .then(res => {
        console.log(res);
        dispatch({
          'type' : 'DELETE_Entry',
          entry_id : entry_id
        });
  
      })
      .catch(err => console.log(err));

      
    };

    return (
        <div>
            {selected_journal.entries && selected_journal.entries.map(ele => 
                <div key={ele.entry_id}>
                    <div className="d-flex flex-column flex-md-row shadow p-2 rounded mt-2 border-left">
                        <div className="p-md-2 bd-highlight">{ele.date}</div>
                        <div className="p-md-2 bd-highlight flex-grow-1">{ele.title}</div>
                        <div className="p-md-2 bd-highlight ">
                            <button className="btn btn-sm btn-outline-info shadow me-2" data-bs-toggle="collapse" data-bs-target={"#collapseTwo"+ele.entry_id}><BiDownvote /> </button>
              
                            <button className="btn btn-sm btn-outline-danger shadow" onClick={() => deleteEntry(ele.entry_id)}><BiTrash /></button>

                            
                        </div>
                        
                        
                    </div>

                    <div id={"collapseTwo"+ele.entry_id} className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">

                            {edit === true && editId === ele.entry_id ?
                            <>
                              <textarea className="form-control mb-3"  rows="10"
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                              ></textarea>

                              <button className="btn btn-sm btn-success me-3 px-3" onClick={saveEdit}> <BiCheck /></button>
                              <button className="btn btn-sm btn-danger px-3" onClick={cancelEdit}> <BiXCircle /></button>

                            </> 
                            
                            : 
                            
                            <div className="text-start">
                            <p style={{whiteSpace : 'pre-line'}}>{ele.description}</p>
                              <button className="btn btn-info btn-sm w-25 shadow" onClick={() => {setEdit(true); setEditId(ele.entry_id); setEditText(ele.description)}}>Edit <BiEdit /></button>
                              
                            </div>
                            }
                           

                           
                        </div>
                    </div>




                </div>
                
                )}
        </div>
    )
}


function EntryModal(){
    

    const [{URL, user_id, selected_journal}, dispatch] = useStateValue();
    
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");

    const modalRef = useRef();

    const createEntry = () => {

        if (date.length === 0 || title.trim().length === 0 || description.trim().length === 0){
          alert("Fields cannot be empty");
          return;
        }

        const entry_id = new Date().getTime();
        const timestamp = new Date(date).getTime();
        const trimmedTitle = title.trim();
        const trimmedDesc = description.trim();  

        const formattedDate = formatDate(date); //date is of the form 2021-09-17



        const params = {
          user_id : user_id,
          journal_id : selected_journal.journal_id,
          entry_id : entry_id,
          timestamp : timestamp,
          date : formattedDate,
          title : trimmedTitle,
          description : trimmedDesc,

        };

        axios.post(URL + '/journals/entries/add', params)
        .then(res => {
          console.log(res);
          dispatch({
            type : 'ADD_ENTRY',
            date : formattedDate,
            title : trimmedTitle,
            description : trimmedDesc,
            entry_id : entry_id,
            timestamp : timestamp
          });
        })
        .catch(err => console.log(err));

        

        setDate("");
        setTitle("");
        setDesc("");

        modalRef.current.click();
    }


    const formatDate = date => {
        const monthDict = {0 : 'Jan', 1 : 'Feb', 2 :'March', 3 : 'April', 4 : 'May', 5 : 'June', 6 : 'July', 7 : 'Aug', 8 : 'Sept', 9 : 'Oct', 10 : 'Nov', 11 : 'Dec'}

        const temp = date.split("-");
        const year = temp[0];
        let month = parseInt(temp[1]) - 1;   
        const day = temp[2];

        month = monthDict[month];

        return day + " " + month + " " + year;

    }

    return (
        
        <div className="modal fade" id="new_entry" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-center" id="exampleModalLabel">New Entry</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">

              <div className="form-group row mt-4">
                        <label className="col-sm-3 col-form-label">Date :</label>
                        <div className="col-sm-8">
                            <input type="date" className="form-control shadow"
                              value={date}
                              onChange={e => setDate(e.target.value)}
                              />
                        </div>
                    </div>

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
                        <label className="col-sm-3 col-form-label">Your Thoughts :</label>
                        <div className="col-sm-8">
                        <textarea className="form-control"  rows="10"
                          value={description}
                          onChange={e => setDesc(e.target.value)}
                        ></textarea>
                        </div>
                    </div>
        
        
              </div>
              <div className="modal-footer">
                <button ref={modalRef} type="button" className="btn btn-secondary d-none" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-info w-50 me-auto ms-auto" disabled={false} onClick={createEntry}>Create Entry</button>
              </div>
            </div>
          </div>
        </div>
            )
}

export default Entries;
