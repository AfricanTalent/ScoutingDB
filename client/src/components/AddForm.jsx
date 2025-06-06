import React, { useState } from "react";
import './css/AddForm.css'
import './css/responsive/AddForm.css'
import './css/responsive/EvaluationForm.css'
import EvaluationForm from "./EvaluationForm";
import LoadingScreen from "./Loading.jsx";  
import { apiService } from "../services/apiService";

import EvaluationForm2 from "./EvaluationForm2";

const AddForm = ({scoutName}) => {

  const africanCountries = [
    { "name": "Algeria", "code": "DZ" },
    { "name": "Angola", "code": "AO" },
    { "name": "Benin", "code": "BJ" },
    { "name": "Botswana", "code": "BW" },
    { "name": "Burkina Faso", "code": "BF" },
    { "name": "Burundi", "code": "BI" },
    { "name": "Cabo Verde", "code": "CV" },
    { "name": "Cameroon", "code": "CM" },
    { "name": "Central African Republic", "code": "CF" },
    { "name": "Chad", "code": "TD" },
    { "name": "Comoros", "code": "KM" },
    { "name": "Congo (Congo-Brazzaville)", "code": "CG" },
    { "name": "Democratic Republic of the Congo", "code": "CD" },
    { "name": "Djibouti", "code": "DJ" },
    { "name": "Egypt", "code": "EG" },
    { "name": "Equatorial Guinea", "code": "GQ" },
    { "name": "Eritrea", "code": "ER" },
    { "name": "Eswatini (fmr. Swaziland)", "code": "SZ" },
    { "name": "Ethiopia", "code": "ET" },
    { "name": "Gabon", "code": "GA" },
    { "name": "Gambia", "code": "GM" },
    { "name": "Ghana", "code": "GH" },
    { "name": "Guinea", "code": "GN" },
    { "name": "Guinea-Bissau", "code": "GW" },
    { "name": "Ivory Coast", "code": "CI" },
    { "name": "Kenya", "code": "KE" },
    { "name": "Lesotho", "code": "LS" },
    { "name": "Liberia", "code": "LR" },
    { "name": "Libya", "code": "LY" },
    { "name": "Madagascar", "code": "MG" },
    { "name": "Malawi", "code": "MW" },
    { "name": "Mali", "code": "ML" },
    { "name": "Mauritania", "code": "MR" },
    { "name": "Mauritius", "code": "MU" },
    { "name": "Morocco", "code": "MA" },
    { "name": "Mozambique", "code": "MZ" },
    { "name": "Namibia", "code": "NA" },
    { "name": "Niger", "code": "NE" },
    { "name": "Nigeria", "code": "NG" },
    { "name": "Rwanda", "code": "RW" },
    { "name": "Sao Tome and Principe", "code": "ST" },
    { "name": "Senegal", "code": "SN" },
    { "name": "Seychelles", "code": "SC" },
    { "name": "Sierra Leone", "code": "SL" },
    { "name": "Somalia", "code": "SO" },
    { "name": "South Africa", "code": "ZA" },
    { "name": "South Sudan", "code": "SS" },
    { "name": "Sudan", "code": "SD" },
    { "name": "Tanzania", "code": "TZ" },
    { "name": "Togo", "code": "TG" },
    { "name": "Tunisia", "code": "TN" },
    { "name": "Uganda", "code": "UG" },
    { "name": "Zambia", "code": "ZM" },
    { "name": "Zimbabwe", "code": "ZW" }
  ];

  //Bug with the select fields
  const [playerData, setPlayerData] = useState({
    firstname: '', lastname: '',
    dob: '',
    gender: '', club: '', 
    position: '', scoutedBy: '',
    foot: '', coachTel: '', region: '',  coachName: '',
    image: null, // For storing the image file
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [playerId, setplayerId] = useState(); 
  const [countryCode, setCountryCode] = useState(''); 
  const [imgName, setImgName] = useState(''); 
  const [flagMessage, setFlagMessage] = useState(''); 
  const [isVisible, setIsVisible] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [showDialog, setShowDialog] = useState(false); 

  // Handle changes for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setPlayerData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
    setImgName( e.target.files[0].name);
  };

  const handleDialog = () => {
    setShowDialog(true);

    // Automatically close the dialog after 2 seconds
    setTimeout(() => {
      setShowDialog(false);
    }, 50000);
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      playerData?.gender.length === 0 || playerData?.status == undefined || playerData.nationality?.length === 0
      || playerData?.foot.length === 0 || playerData.position?.length == 0
    ) {
      setIsVisible(true);
      setLoading(false);
      handleDialog();
    } else {
      const countrySearch = africanCountries.find((africanCountry) => africanCountry.name === playerData.nationality);
    
    if(countrySearch){
      setCountryCode(countrySearch.code);
    }
    else{
      setCountryCode("");
    }

    const formData = new FormData();
    formData.append('First_name', playerData.firstname);
    formData.append('Last_name', playerData.lastname);
    formData.append('Gender', playerData.gender);
    formData.append('Date_of_Birth', playerData.dob);
    formData.append('Position', playerData.position);
    formData.append('Preferred_Foot', playerData.foot);
    formData.append('Region_scouted_in', playerData.region);
    formData.append('Club', playerData.club);
    formData.append('Number_of_coach', playerData.coachTel);
    formData.append('Coach', playerData.coachName);
    formData.append('Image', playerData.image);
    formData.append('Nationality', playerData.nationality);
    formData.append('NationalityISO', countrySearch.code);
    formData.append('Status', playerData.status);
    formData.append('Scouted_By', playerData.scoutedBy);
    formData.append('Date_Added', getTodayDate());  

      try {
        
        const response = await apiService.post('/players/add/', formData, {
          headers: {
            'Content-Type': "multipart/form-data",
          },
        });
        setplayerId(response._id);
        setFlagMessage(`Begin evaluation of ${playerData.firstname} ${playerData.lastname} ====>>>>`);
        setIsVisible(true);
        handleNext();
      } catch (error) {
        console.error('Error saving player:', error);
      }finally{
        setLoading(false);
      }
    }

  };

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 1) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prevStep => prevStep - 1);
    }
  };

  return(
    <div className="add-form-container">

    {showDialog && (
            <div className="addDialog">
              <div className="dialogContent">
                <h3>Some Fields must be filled</h3>
                <p>[Nationality, Status, Gender, Preferred Foot, Position]</p>
                <button onClick={() => setShowDialog(false)}>Close</button>
              </div>
            </div>
          )}
      
    <div className="form-wrapper" style={{ transform: `translateX(-${step * 50}%)`}}>
      {/* Form 1 */}
      <div className="form-step">
      {loading && <LoadingScreen/>}
        <h2>Player Entry Form</h2>
        <div className="registration-form-wrapper">
          <form className="registration-form" onSubmit={handleSubmit}>
          <input type="text" name='firstname' value={playerData.firstname} onChange={handleInputChange} placeholder="Firstname of player" required/>
          <input type="text" name='lastname' value={playerData.lastname} onChange={handleInputChange} placeholder="Lastname of player" required/>
            <select name="gender" id="gender" value={playerData.gender} onChange={handleInputChange} defaultValue="Male">
              <option value="">-- Select gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="date" name='dob' value={playerData.dob} onChange={handleInputChange} placeholder="Date of birth" required title="Date of Birth"/>

            <select  name="nationality" id="nationality" value={playerData.nationality} onChange={handleInputChange}>
            <option value="">--Select Nationality --</option>
            {africanCountries.map((country, index) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>

            <select name="position" id="position" value={playerData.position} onChange={handleInputChange}>
              <option value="">-- Select position --</option>
              <option value="Center Foward">Center Foward</option>
              <option value="Right Winger">Right Winger</option>
              <option value="Left Winger">Left Winger</option>
              <option value="Central Attacking Midfielder">Central Attacking Midfielder</option>
              <option value="Central Midfielder">Central Midfielder</option>
              <option value="Defender Midfielder">Defender Midfielder</option>
              <option value="Right Back">Right Back</option>
              <option value="Left Back">Left Back</option>
              <option value="Center Back">Center Back</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>
            <select name="foot" id="foot" value={playerData.foot} onChange={handleInputChange} >
              <option value="">-- Select Preferred Foot --</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
            <input type="text" name='region' value={playerData.region} onChange={handleInputChange} placeholder="Region Scouted" required/>
            <input type="text" name='club' value={playerData.club} onChange={handleInputChange} placeholder="Club name" required/>
            <input type="text" name='coachName' value={playerData.coachName} onChange={handleInputChange} placeholder="Coach name" required/>
            <input type="tel" name='coachTel' value= {playerData.coachTel} onChange={handleInputChange} placeholder="Coach Tel:" required/>
            <select name="status" id="status" value={playerData.status} onChange={handleInputChange}>
              <option value="">-- Select Status --</option>
              <option value="Signed" defaultValue>Signed</option>
              <option value="Follow">Follow</option>
              <option value="Trials">Trials</option>
              <option value="Leave">Leave</option>
            </select>
            <input type="text" name='scoutedBy' value={playerData.scoutedBy} onChange={handleInputChange} placeholder="Name of Scout" required/>
            <input type="file" id="image" name="image" onChange={handleFileChange}  accept="image/png , image/jpeg, image/jpg" required/>
            <div className="btnsub">
              <button type="submit" >Add Player</button>
            </div>
          </form>
        </div>
        
      </div>

      {/* Form 2 */}
      <div className="form-step">
        <h2>Evaluate Player</h2>
        <EvaluationForm newPlayerId={playerId}/> 
      </div>
    </div>

    {/* <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={step === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={step === 1}>
          Next
        </button>
      </div> */}
  </div>
  )
}

export default AddForm
