import React, {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter , faRefresh, faUser, faTrash, faPencil} from '@fortawesome/free-solid-svg-icons';
import { apiService } from "../services/apiService.js";

import './css/Datazone.css'
import './css/responsive/Datazone.css'
import TrialsInfo from './TrialsInfo.jsx';
import Flag from 'react-world-flags';

const Trials = ({scoutName}) => {

    const [players, setPlayers] = useState([]);   //State for storing all players
    const [searchValue, setSearchValue] = useState('');    
    const [isVisible, setIsVisible] = useState(false); // State to control visibility
    const [filteredData, setFilteredData] = useState([]); // State for storing the filtered results
    const [selectedPlayer, setSelectedPlayer] = useState();
    const [isTrialsInfoView, setisTrialsInfoView] = useState(false); // State to control visibility
    const TrialsInfoRef = useRef(null);
    

    const fetchPlayers = async () => {
        try {
          const data = await apiService.get("/players/trials");
          setPlayers(data);
          setFilteredData(data);
        } catch (e) {
          setErr("Failed to load players: " + e);
          console.log(err);
        }
      };
    
      useEffect(() => {
        //Fetch all players from the database once page loads
          fetchPlayers();
        }, []);

    // Function to handle search name change
    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
      };

      // Function to handle Enter key press
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          // Perform action when Enter is pressed
          handleSearch();
        }
      };

    // Function to apply fuzzy search by name
    const applyNameSearch = (term) => {
        const result = players.filter(person => {
          const firstName = person.First_name; 
          const lastName = person.Last_name; // Split full name into first and last name
          const lowerCaseTerm = term.toLowerCase(); // Make the search term lowercase for case-insensitive matching
    
          return (
            firstName.toLowerCase().includes(lowerCaseTerm) || // Check if first name matches
            lastName.toLowerCase().includes(lowerCaseTerm)     // Check if last name matches
          );
        });

        setFilteredData(result);
      };

      const handleSearchFilter = (value) => {
        // const value = e.target.value.toLowerCase();
        setSearchValue(value);
    
        const filteredResults = players.filter((person) =>
          Object.values(person).some((field) =>
            String(field).toLowerCase().includes(value)
          )
        );
    
        setFilteredData(filteredResults);
      };

      //handle Search name search
      const handleSearch = () => {
        // applyNameSearch(searchValue);
        handleSearchFilter(searchValue);
      };

      //handle refresh of dashboard
      const refreshFilter = () => {
        applyNameSearch('');
      };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString();  // This will format the date according to the user's locale
        };

    const positionMap = [
        {"full": "Goalkeeper", "short": "GK"},
        {"full": "Center Back", "short": "CB"},
        {"full": "Left Back", "short": "LB"},
        {"full": "Right Back", "short": "RB"},
        {"full": "Defender Midfielder", "short": "DM"},
        {"full": "Central Midfielder", "short": "CM"},
        {"full": "Central Attacking Midfielder", "short": "CAM"},
        {"full": "Left Winger", "short": "LW"},
        {"full": "Right Winger", "short": "RW"},
        {"full": "Center Foward", "short": "CF"},
      ];

      const positionMapping = (positionMap, data) => {
        const shortform = positionMap.find((position) => position.full === data);
        return shortform.short;
      }
   
   // Function to handle mouse enter
      const handleMouseEnter = (className) => {
        setHoveredClass(className);
      };

      // Function to handle mouse leave
      const handleMouseLeave = () => {
        setHoveredClass('');
      };
      
      // Function to toggle visibility when the button is clicked
      const toggleFilter = () => {
        setIsVisible((prev) => !prev);
      };

      const showTrialsInfo = () => {
        setisTrialsInfoView((prev) => !prev);
      };

      useEffect(() => {
              const handleClickOutside = (event) => {
                if (TrialsInfoRef.current && !TrialsInfoRef.current.contains(event.target)) {
                  setisTrialsInfoView(false);
                }
              };
          
              // Add event listener when component mounts
              document.addEventListener('mousedown', handleClickOutside);
          
              // Clean up the event listener when component unmounts
              return () => {
                document.removeEventListener('mousedown', handleClickOutside);
              };
            }, [])

      const calculateAge = (dobString) => {
        if (!dobString) return ''; // Handle empty input
    
        const dobDate = new Date(dobString); // Convert string to Date
        const today = new Date();
    
        let years = today.getFullYear() - dobDate.getFullYear();
        const monthDifference = today.getMonth() - dobDate.getMonth();
        const dayDifference = today.getDate() - dobDate.getDate();
    
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
          years--;
        }
    
        return years.toString(); // Return age as a string
      };

    return (
        <>
       {isTrialsInfoView && (<div className="evalution-pop" ref={TrialsInfoRef}><TrialsInfo player={selectedPlayer}/></div>)}
    
         {/* {isUpdateView && (<div className="evalution-pop" ref={updateRef}><UpdateForm player={selectedPlayer}/></div>)}  */}
    
        <div className="container">
    
          <div className="overhead">
            <div className="avatar_section">
              {/* <h3>Trials Section</h3> */}
              <div className="user-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <h4>Hello, {scoutName}</h4>
            </div>
    
            <div className="filter">
              <input
                  type="text"
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress} // Detect Enter key press
                  placeholder="Search database"
                />
                <div className="filterIcon" onClick={toggleFilter}>
                  <FontAwesomeIcon icon={faFilter}/>
                </div>
                <div className="filterIcon" onClick={refreshFilter}>
                  <FontAwesomeIcon icon={faRefresh}/>
                </div>
    
                {/* Filter section */}
                {isVisible && (
                  <div className="filter-section" ref={filterRef}>
                    <h3>Filter Options</h3>
                    <div className="filter-option">
                        <input type="number" onChange={(e) => setStartYear(e.target.value)} name="start" value={startYear}/>
                        <p> - </p>
                        <input type="number" onChange={(e)=> setEndYear(e.target.value)} name="end" value={endYear}/>
                    </div>
                    <button onClick={handleFilter}>Find results</button>
                    {yearFilterErr && <p className="error-message">{yearFilterErr}</p>}
                    
                  </div>
                )}
    
            </div>
          </div>
    
          <div className="table">
          <table className="player-table">
          <thead>
            <tr>
              <th>
              </th>
              <th onClick={() => sortTable("name")}>
                Name
              </th>
              <th>
                Nationality 
              </th>
              <th>
                DOB (Age)
              </th>
              <th>
                Position
              </th>
              <th >
                Preferred Foot
              </th>
              <th >
                Scouted By 
              </th>
              <th >
                Status 
              </th>
              <th >
                {/* Delete icon */}
              </th>
              <th >
                {/* Edit icon */}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((player, index) => (
              <tr 
                key={index} 
                onClick={() => {
                    showTrialsInfo();
                    setSelectedPlayer(player);
                  }
                }
              >
                <td className='player_Img'>
                  <img src={player.Image} className="player-img" />
                </td>
                <td className="name">
                  
                  {player.First_name + " " + player.Last_name}
                </td>
                <td className="nation">
                  {/* <span className={`flag-icon flag-icon-${countryCode}`}></span> */}
                  <div className="nationality">
                  <span className='nation-img'><Flag code={player.NationalityISO} style={{ width: '30px', height: '30px' }} /></span>
                  {player.Nationality}
                  </div>
                </td>
                <td>{`${formatDate(player.Date_of_Birth)} (${calculateAge(player.Date_of_Birth)})`}</td>
                
                <td>{positionMapping(positionMap, player.Position)}</td>
                <td>{player.Preferred_Foot}</td>
                <td>{player.Scouted_By}</td>
                <td className={`status`}
                  onMouseEnter={() => handleMouseEnter(`${player.Status.toLowerCase()}`)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className='tooltip'>
                    <div className={`${player.Status.toLowerCase()}`}></div>
                    <span className="tooltiptext">{`${player.Status}`}</span>
                  </div>
                  
                </td>
                <td className='trash-td'  onClick={(event) => deletePlayer(event, player._id)}>
                  <div className='trash-icon' title='delete'>
                    <FontAwesomeIcon icon={faTrash}/>
                  </div>
                </td>
                <td className='edit-td'  onClick={() => {showUpadte();}}>
                  <div className='edit-icon' title='edit'>
                    <FontAwesomeIcon icon={faPencil}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
        
      </div>
      </>
      )
}

export default Trials