import React, {useState, useEffect} from 'react'
import './css/EvaluationView.css'
import viteLogo from '/vite.svg';
import { apiService } from "../services/apiService.js";
import ExportStyledPDF from './ExportStyledPDF.jsx';


const EvaluationView = ({player}) => {

    const [ratings, setRatings] = useState([{}]);
    const [isRate, setIsRate] = useState(false);
    const [err, setErr] = useState();

    useEffect(() => {
        //Fetch all players from the database
          const fetchEvaluation = async () => {
            try {
              const query = `/evaluation/${player._id}/`;
              const data = await apiService.get(query);
              setRatings(data);
              setIsRate(true);
            } catch (e) {
              setErr("Failed to load evaluation: " + e);
              console.log(err);
            }
          };
          
          fetchEvaluation();
        }, []);
    
        const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            return date.toLocaleDateString();  // This will format the date according to the user's locale
        };

        const renderEvaluation = () => {
            return Object.entries(ratings).map(([key, value]) => {
                if(!(key.toUpperCase() === "PLAYER_ID" || key.toUpperCase() === "_ID" || key.toUpperCase() === "NOTE")){
                    if (key.toUpperCase() !== "AVERAGE") {
                        return (
                            <div key={key} className="metric">
                                <span>{key.toUpperCase()}</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${value * 20}%` }}></div>
                                </div>
                                <span>{value}</span>     
                            </div>
                        ); 
                    }
                }
            });
        }

        const averageView = () => {
            return Object.entries(ratings).map(([key, value]) => {
                if((key.toUpperCase() === "AVERAGE")){
                    return (
                        <div key={key} className="metric">
                            <span>{key.toUpperCase()}</span>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${value * 20}%` }}></div>
                            </div>
                            <span>{value}</span>     
                        </div>
                    ); 
                }
            });

            
        }

        const notesView = () => {
            return Object.entries(ratings).map(([key, value]) => {
                if(key.toUpperCase() === 'NOTE'){
                    return(
                            <div key={key} className="noteView">
                                <span>SUMMARY</span>
                                <p>{value}</p>
                            </div>
                        );
                }
            });

            
        }

  return (
    <div className="view_wrapper">
        <div className="view_personal">
            <div className="personal_top">
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
                    <span>Conatct Coach: </span>
                    <p>{player.Number_of_coach}</p>
                </div>
                <div className="personal_detail">
                    <span>Date Added: </span>
                    <p>{formatDate(player.Date_Added)}</p>
                </div>
            <ExportStyledPDF player={player} evaluation={ratings}/>    
            </div>
        </div>

        <div className="view_evaluation">
            <div className="player-evaluation">
            <h3>Evaluation Metrics</h3>
            <div  className="evaluation-metrics">
                {isRate && renderEvaluation()} 
                {averageView()}
                {notesView()}
            </div>
            </div>
        </div>
    </div>
  )
}

export default EvaluationView
