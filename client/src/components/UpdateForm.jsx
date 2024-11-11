import React, { useState , useEffect } from "react";
import './css/UpdateForm.css'
import EvaluationForm from "./EvaluationForm";
import { apiService } from "../services/apiService";
import EvaluationForm2 from "./EvaluationForm2";

const AddForm = ({player}) => {

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
    foot: '', coachTel: '', region: '', 
    coachName: '', nationalityISO: '',
    nationality:'', status: '',
    image: '', // For storing the image file
  });


  const [playerId, setplayerId] = useState(); 
  const [countryCode, setCountryCode] = useState(''); 
  const [flagMessage, setFlagMessage] = useState(''); 
  const [isVisible, setIsVisible] = useState(false); 
  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(true);

    // Automatically close the dialog after 2 seconds
    setTimeout(() => {
      setShowDialog(false);
    }, 2000);
  }
  
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const newdate = date.toLocaleDateString();  // This will format the date according to the user's locale
    const [month, day, year] = newdate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };


  // Populate form data from props on component mount
  useEffect(() => {
    console.log(player.Date_of_Birth);
    if (player) {
      setPlayerData({
        firstname: player.First_name || '', 
        lastname: player.Last_name || '',
        dob: formatDate(player.Date_of_Birth) || '',
        gender: player.Gender ||'', 
        club: player.Club ||'', 
        position: player.Position || '', 
        scoutedBy: player.Scouted_By ||'',
        foot: player.Preferred_Foot || '', 
        coachTel: player.Number_of_coach || '', 
        coachName: player.Coach || '', 
        nationality: player.Nationality || '', 
        nationalityISO: player.NationalityISO || '', 
        region: player.Region_scouted_in || '',
        status: player.Status || '',
        image:  player.Image || '', // For storing the image file

      });
    }
  }, [player]);


  // Handle changes for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      playerData.gender.length === 0 || playerData.status.length === 0 || playerData.nationality.length === 0
      || playerData.foot.length === 0 || playerData.position.length === 0
    ) {
      setFlagMessage("Kindly enter all the details of the player");
      setIsVisible(true);
      console.log("empty forms");
    } else {
      const countrySearch = africanCountries.find((africanCountry) => africanCountry.name === playerData.nationality);
    
    if(countrySearch){
      setCountryCode(countrySearch.code);
    }
    else{
      setCountryCode("");
    }

    // const formData = new FormData();
    // formData.append('First_name', playerData.firstname);
    // formData.append('Last_name', playerData.lastname);
    // formData.append('Gender', playerData.gender);
    // formData.append('Date_of_Birth', playerData.dob);
    // formData.append('Position', playerData.position);
    // formData.append('Preferred_Foot', playerData.foot);
    // formData.append('Region_scouted_in', playerData.region);
    // formData.append('Club', playerData.club);
    // formData.append('Number_of_coach', playerData.coachTel);
    // formData.append('Name_of_coach', playerData.coachName);
    // // formData.append('Image', player.image);
    // formData.append('Nationality', playerData.nationality);
    // formData.append('NationalityISO', countrySearch.code);
    // formData.append('Status', playerData.status);
    // formData.append('Scouted_By', player.Scouted_By);

    const jsonData = {
      First_name: playerData.firstname,
      Last_name: playerData.lastname,
      Gender: playerData.gender,
      Date_of_Birth: playerData.dob,
      Position: playerData.position,
      Preferred_Foot: playerData.foot,
      Region_scouted_in: playerData.region,
      Club: playerData.club,
      Number_of_coach: playerData.coachTel,
      Name_of_coach: playerData.coachName,
      // Image: playerData.image,
      Nationality: playerData.nationality,
      NationalityISO: countrySearch.code,
      Status: playerData.status,
      Scouted_By: player.Scouted_By,
    };

      
      try {
        
        const response = await apiService.put(`/players/update/${player._id}/`, jsonData, {
          headers: {
            'Content-Type': "application/json",
          },
        });
        // console.log('Player saved successfully:', response._id);
        setplayerId(response._id);
        // setFlagMessage(`Player Update was successful`);
        // setIsVisible(true);
        handleDialog();
      } catch (error) {
        console.error('Error saving player:', error);
        console.log(playerData.image);
      }
    }

  };

  return(
    <div className="add-form-container">
      
    <div className="form-wrapperr">
      {showDialog && (
          <div className="dialog">
            <div className="dialogContent">
              <p>Player Update was successfully</p>
              <button onClick={() => setShowDialog(false)}>Close</button>
            </div>
          </div>
        )}

      {/* Form 1 */}
      <div className="form-step">
        <h2>{`Update Details of ${player.First_name}`}</h2>
        <div className="registration-form-wrapper">
          <form className="registration-form" onSubmit={handleSubmit}>
          <input type="text" name='firstname' value={playerData.firstname} onChange={handleInputChange} placeholder="Firstname of player" required/>
          <input type="text" name='lastname' value={playerData.lastname} onChange={handleInputChange} placeholder="Lastname of player" required/>
            <select name="gender" id="gender" value={playerData.gender} onChange={handleInputChange} defaultValue="Male">
              <option value="">-- Select gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="date" name='dob' value={playerData.dob} onChange={handleInputChange} placeholder="Date of birth" required/>

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
              <option value="Foward">Foward</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Defender">Defender</option>
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
            {/* <input type="file" id="image" name="image" onChange={handleFileChange}  accept="image/png , image/jpeg, image/jpg" required/> */}
            <div className="btnsub">
              <button type="submit" >Update Player</button>
            </div>
          </form>
          {isVisible && <p className="flagMsg">{flagMessage}</p>}
        </div>
        
      </div>
    </div>

  </div>
  )
}

export default AddForm