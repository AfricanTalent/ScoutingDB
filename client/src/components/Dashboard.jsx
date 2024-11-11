import React, {useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Datazone from './Datazone'
import Settings from './Settings'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCog , faHome} from '@fortawesome/free-solid-svg-icons';

import './css/Dashboard.css'
import './css/responsive/Dashboard.css'
import AddForm from './AddForm'

const Dashboard = () => {

  const location = useLocation();
  const loginId = location.state?.message;
  const scoutName = location.state?._scoutName; // Access the state passed via navigate
  const [loading, setLoading] = useState(false);
  

  const [selectedComponent, setSelectedComponent] = useState('A');

  // Function to handle switching of components
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  // Function to render the selected form component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'A':
        return <Datazone key="A" scoutName={scoutName}/>; // Provide unique key to force re-mount
      case 'B':
        return <AddForm key="B" scoutName={scoutName}/>;
      case 'C':
        return <Settings key="C" scoutId={loginId}/>;
      default:
        return <Datazone key="A" scoutName={scoutName}/>;
    }
  }
  const navigate = useNavigate();
  const handleLogout = () => {
    
    localStorage.removeItem("token");  // Remove JWT token
    navigate("/");  // Redirect back to login page
  };

  return (
    <div className="holder">

      {/* <Header/> */}

      <div className="dash holder">
        <div className='sidebar'>
          <div className="logo">
              <img src="/African Talent.png" alt="" />
              <h4>African Talent Academy</h4>
          </div>
          <ul>
              <li onClick={() => handleComponentChange(`A`)}>
                  <div className="dashIcon"><FontAwesomeIcon icon={faHome} /></div>
                  <span>Dashboard</span>
              </li>
              <li onClick={() => handleComponentChange(`B`)}>
                  <div className="dashIcon"><FontAwesomeIcon icon={faAdd} /></div>
                  <span>Add Player</span>
              </li>
              <li onClick={() => handleComponentChange(`C`)}>
                  <div className="dashIcon"><FontAwesomeIcon icon={faCog}/></div>
                  <span>Change Password</span>
              </li>
          </ul>
          <div className="signout">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        
        {/* Conditionally rendered component */}
        <div className="component-container">
          {renderComponent()}
        </div>

      </div>
    </div>
  )
}

export default Dashboard