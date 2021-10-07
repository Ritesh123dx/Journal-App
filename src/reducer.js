
import journals from './data/dummydata';


export const initialState = {
    
    URL : 'http://127.0.0.1:4000',
    user_id : localStorage.getItem("user_id"),
    journals : [],
    selected_journal : {},
    
  };
  
  

  const reducer = (state, action) => {
    console.log("Inside reducer -->", action);
    
    switch (action.type) {

        case "SET_USER" : {
          return {
            ...state,
            user_id : action.user_id
          }
        }

        case "SET_JOURNAL":{
          return{
            ...state,
            journals : action.journals
          }
        }

        case "SELECT_JOURNAL":{
            const selected_journal = state.journals.find(ele => ele.journal_id === action.journal_id);
            
            selected_journal.entries.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);

          return {
            ...state,
            selected_journal : selected_journal
         
          };
        }


        case "DELETE_JOURNAL": {
          const updated_journals = state.journals.filter(ele => ele.journal_id !== action.journal_id);
          
        return {
          ...state,
          journals : updated_journals
        
        };
        
      }

      case "ADD_JOURNAL": {
        console.log(action)
        const updated_journals = [...state.journals];
        updated_journals.push({
          journal_id : action.journal_id,
          date : action.date,
          title : action.title,
          description : action.description,
          entries : []
        });

        

        return {
          ...state,
          journals : updated_journals
        };


      }

      
      
      case "DELETE_Entry": {
        //Get the id of the journal and remove the entry from there, also update the selected journal entry
        let index = -1;
        
        for (let i = 0; i < state.journals.length; i++){
            let element = state.journals[i];
            if (element === state.selected_journal){
              index = i;
              break;
            }
            
        }

        let updated_entries = state.journals[index].entries.filter(ele => ele.entry_id !== action.entry_id);
        let updated_journals = [...state.journals];
        updated_journals[index].entries = updated_entries;

        
        return {
          ...state,
          journals : updated_journals,
          selected_journal : updated_journals[index]
        
        };

      }


      case "ADD_ENTRY": {
        // Get id of the journal and add it to the entries
        let index = -1;
        
        for (let i = 0; i < state.journals.length; i++){
            let element = state.journals[i];
            if (element === state.selected_journal){
              index = i;
              break;
            }
            
        }

        
        const updated_journals = [...state.journals];
        const updated_entries = updated_journals[index].entries;

        updated_entries.push({
          entry_id : action.entry_id,
          date : action.date,
          title : action.title,
          description : action.description,
          timestamp : action.timestamp
        });

        updated_entries.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);

        updated_journals[index].entries = updated_entries;

        console.log("UPDATED ENTRIES --> ", updated_entries);

        return{
          ...state,
          journals : updated_journals,
          selected_journal : updated_journals[index]
        }


      }


      case "EDIT_ENTRY":{
        // Get id of the journal and edit it to the entries
        let index = -1;
        
        for (let i = 0; i < state.journals.length; i++){
            let element = state.journals[i];
            if (element === state.selected_journal){
              index = i;
              break;
            }    
        }

        const updated_journals = [...state.journals];
        const updated_entries = updated_journals[index].entries;

        for(let i = 0; i < updated_entries.length; i++){
          let id = updated_entries[i].entry_id
          if (id === action.entry_id){
            updated_entries[i].description = action.description;
            break;
          }
        }
        

        updated_journals[index].entries = updated_entries;

        return {
          ...state,
          journals : updated_journals,
          selected_journal : updated_journals[index]
        }

      }


        
        default:
            return state;

    };

}
  
export default reducer;