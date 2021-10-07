import React from 'react';
import './Journals.css';

import { useStateValue } from '../StateProvider';
import { useHistory } from 'react-router';
import axios from 'axios';
import {BiDownvote, BiRightArrow, BiTrash} from 'react-icons/bi';

function Journals() {

    

    return (
        <div className="mt-5">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-10 offset-md-1">
                    
                    <JorunalTab />
                    
                </div>
            </div>
        </div>
    )
}


function JorunalTab() {
    
    const [{ URL, user_id, journals }, dispatch] = useStateValue();
    const history = useHistory();

    const selectJournal = (journal_id) => {
        dispatch({
            'type' : 'SELECT_JOURNAL',
            journal_id : journal_id
        });
        
        history.push('/entries');

    };

    const deleteJournal = (journal_id) => {

        const params = {
            user_id : user_id,
            journal_id : journal_id
        };

        axios.delete(URL + '/journals/delete', { data: params })
        .then(res => {
            console.log(res);
            dispatch({
                'type' : 'DELETE_JOURNAL',
                journal_id : journal_id
            });

        })
        .catch(err => console.log(err));

        
    }

    return (
        <div>
            {journals.map(ele => 
                <div key={ele.journal_id}>
                    <div className="d-flex flex-column flex-md-row shadow p-2 rounded mt-2 border-left">
                        
                        <div className="p-md-2 bd-highlight">{ele.date}</div>
                        <div className="p-md-2 bd-highlight flex-grow-1">{ele.title}</div>
                        <div className="p-md-2 bd-highlight">
                            <button className="btn btn-sm btn-outline-info shadow me-2" data-bs-toggle="collapse" data-bs-target={"#collapseTwo"+ele.journal_id}><BiDownvote /> </button>
                            <button className="btn btn-sm btn-outline-info shadow me-2" onClick={() => selectJournal(ele.journal_id)}><span className="d-none d-md-inline">Entries</span> <BiRightArrow /> </button>
                            <button className="btn btn-sm btn-outline-danger shadow" onClick={() => deleteJournal(ele.journal_id)}><BiTrash /></button>

                            
                        </div>
                        
                        
                    </div>

                    <div id={"collapseTwo"+ele.journal_id} className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <p>{ele.description}</p>
                        </div>
                    </div>
                </div>
                
                )}
        </div>
    )
}

export default Journals
