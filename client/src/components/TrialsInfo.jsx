import React, {useState, useEffect} from 'react'
import './css/TrialsInfo.css'
import { apiService } from "../services/apiService.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd} from '@fortawesome/free-solid-svg-icons';
 

const TrialsInfo = ({player}) => {

    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState("");
    const [startDate, setStartDate] = useState(""); // Holds the selected date
    const [endDate, setEndDate] = useState(""); // Holds the selected date
    // const [isDisabled, setIsDisabled] = useState(false);
    // const [isEndDisabled, setIsEndDisabled] = useState(false);

    const formatDateOnly = (isoDate) => {
        const date = new Date(isoDate);
        const newdate = date.toLocaleDateString();  // This will format the date according to the user's locale
        const [month, day, year] = newdate.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const fetchComments = async () =>{
        try{
            const query = `/players/comments/${player._id}/`;
            var playerSearch = await apiService.get(query);
            setCommentList(playerSearch.Comments);
            
            if(playerSearch.TrialsStart){
                setStartDate(playerSearch.TrialsStart);
                // setIsDisabled(true);
            }
            if(playerSearch.TrialsEnd){
                setStartDate(playerSearch.TrialsStart);
                // setIsEndDisabled(true);
            }
            
            
        }catch (e){
            console.log("Error loading comments--> " + e);
        }
    }      

    useEffect(() => {
        fetchComments();
        }, []);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString();  // This will format the date according to the user's locale
    };

    // Handle changes for input fields
    const handleInputChange = (e) => {
        setComment(e.target.value);
    };

    const emptyCommentSection = () =>{
        setComment("");
    }

    const addComment = async (e) => {
        e.preventDefault();
        const nowDate = new Date();

        try {
            const data = {
                comment: comment,
                dateCreated: nowDate.toLocaleString()
            }
            const response = await apiService.put(`/players//trials/comment/${player._id}`, data, {
                headers: {
                  'Content-Type': "application/json",
                },
              });

            emptyCommentSection();
            fetchComments();

        } catch (error) {
            console.log("Could not upload Comments on Trials --> ", error);
        }
    }

    const handleDateChange = async(event) =>{
        const newDate = event.target.value;

        // Ask for confirmation
        const confirmSave = window.confirm(`Are you sure you want to start trials on ${newDate} ?`);

        if (confirmSave) {
            setStartDate (newDate);
            // setIsDisabled(true); // Disable the input field
            try {
                const data = {
                    TrialsStart: newDate
                }
                const response = await apiService.put(`/players/trials/startDate/${player._id}`, data, {
                    headers: {
                      'Content-Type': "application/json",
                    },
                  });
    
                
    
            } catch (error) {
                console.log("Could not upload Comments on Trials --> ", error);
            }
          }
    }
    const handleEndTrialsChange = async(event) =>{
        const newDate = event.target.value;
        var confirmSave;
        if(startDate > newDate || startDate == ""){
            window.alert("End Trials Date is Invalid, Check Start Date");
        }else{
            confirmSave = window.confirm(`Are you sure you want to end the trials on ${newDate}?`);
        }

        if (!confirmSave) {
            setEndDate(endDate);
            // setIsEndDisabled(false); // Disable the input field
            try {
                const data = {
                    TrialsStart: newDate
                }
                const response = await apiService.put(`/players/trials/endDate/${player._id}`, data, {
                    headers: {
                      'Content-Type': "application/json",
                    }, 
                  });
    
                
    
            } catch (error) {
                console.log("Could not upload Comments on Trials --> ", error);
            }
          }
    }

  return (
    <div className="trial_view_wrapper">
        <div className="trials_personal">
            <div className="trial_top">
                <div className="img">
                    <img src={player.Image} alt="" />
                </div>
                <h2>{player.First_name + player.Last_name}</h2>
            </div>
            <div className="personal_btm">
                <div className="personal_detail">
                    <span>Date of Birth: </span>
                    <p>{formatDate(player.Date_of_Birth)}</p>
                </div>
                <div className="personal_detail">
                    <span>Prefered Foot: </span>
                    <p>{player.Preferred_Foot}</p>
                </div>
                <div className="personal_detail">
                    <span>Position: </span>
                    <p>{player.Position}</p>
                </div>
                <div className="personal_detail">
                    <span>Nationality: </span>
                    <p>{player.Nationality}</p>
                </div>
                <div className="personal_detail">
                    <span>Club: </span>
                    <p>{player.Club}</p>
                </div>
            {/* <ExportStyledPDF player={player} evaluation={ratings}/>     */}
            </div>

            <div className='personal_btm'>
            <div className="personal_detail">
                    <span>Scouted by: </span>
                    <p>{player.Scouted_By}</p>
                </div>
                <div className="personal_detail">
                    <span>Region Scouted: </span>
                    <p>{player.Region_scouted_in}</p>
                </div>
                <div className="personal_detail">
                    <span>Coached by: </span>
                    <p>{player.Coach}</p>
                </div>
                <div className="personal_detail">
                    <span>Contact Coach: </span>
                    <p>{player.Number_of_coach}</p>
                </div>
                <div className="personal_detail">
                    <span>Date Added: </span>
                    <p>{formatDate(player.Date_Added)}</p>
                </div>
            </div>
        </div>

        <div className="trials_details">
            <div className="trial_question">
                <div className="trial_date">
                    <p>Trials Start Date</p>
                    <input type="date" value={startDate} onChange={handleDateChange} />
                </div>
                <div className="trial_date">
                    <p>Trials End Date</p>
                    <input type="date" value={endDate} onChange={handleEndTrialsChange}/>
                </div>
            </div>
        </div>

        <div className="comments">
                <h2 className="links-header">Comment Section</h2>
                <form className="video-link" onSubmit={addComment}>
                    <div className="link-input">
                        <textarea type="text" name='comment' value={comment} onChange={handleInputChange} placeholder="Comment On Trials" required/>
                    </div>
                    <button type="submit" className='addLink'>
                        Add Comment
                    </button>
                </form>

                <div className="com">
                    <div></div>
                    <ul className="comment-list">
                        {                            
                                commentList?.length > 0 ? Object.entries(commentList).map(([index,data])=>{
                                    return (
                                        <li className="comment-item">
                                            <p className="comment-text">{data.comment}</p>
                                            <p className="comment-timestamp">{data.dateCreated}</p>
                                        </li>
                                    )
                                }) : <p className='404Comments'>No comments yet</p>                       
                        }
                        
                    </ul>
                </div>
        </div>

        
    </div>
  )
}

export default TrialsInfo
