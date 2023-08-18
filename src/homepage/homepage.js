import React, { useState ,useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './homepage.css'; 
import { auth,db } from '../config/firebase';
import {  collection, getDocs, query, where,doc,updateDoc } from 'firebase/firestore';

const Home = () => {
    const [emailInput, setEmailInput] = useState('');
    const [admin,setIsAdmin]=useState(false)
    const [shareableLink, setShareableLink] = useState('');
    const navigate=useNavigate()
    const user = auth.currentUser;
    let token = ''; 
console.log(user)

useEffect(() => {
    if (user) {
      user.getIdToken().then(newToken => {
        token = newToken;
  
        // Fetch admin data from Firestore (assuming 'admins' is your collection name)
        const adminsCollection = collection(db,'admin');
        const userEmail = user.email; // Assuming email is used as the identifier
  
        const queryAdmin = query(adminsCollection, where('email', '==', userEmail));
        console.log(userEmail)
        getDocs(queryAdmin)
          .then(querySnapshot => {
            if (!querySnapshot.empty) {
              const docSnapshot = querySnapshot.docs[0]; 
  
              // Update the document data with the new token
              const docRef = doc(db,'admin', docSnapshot.id);
              setIsAdmin(true)
              const loginPageUrl = `${window.location.origin}/users/login`;
              const generatedShareableLink = `${loginPageUrl}?token=${token}`;
              setShareableLink(generatedShareableLink);
              return updateDoc(docRef, { token: newToken }); // Returns a promise for chaining
            } else {
              setIsAdmin(false);
            }
          })
          
      }).catch(error => {
        console.error('Error getting authentication token:', error);
      });
    }
  }, [user]);
  
    const handleSendEmail = () => {
     
        const subject = encodeURIComponent('Check out this link');
        const body = encodeURIComponent(`Hey there! Join using the below link: ${shareableLink}`);
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailInput}&su=${subject}&body=${body}`;
        window.open(gmailComposeUrl, '_blank');
    
    }
    const handleSignOut = () => {
      auth.signOut().then(() => {
          localStorage.removeItem('token'); 
          navigate('/'); 
      }).catch(error => {
          console.error('Error signing out:', error);
      });
  };
 
    return (
      <div className="home-container">
      <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
      <h1 className="welcome-heading">Welcome</h1>

      {admin && (
          <>
          Share this link:
              <div className="share-container">
                  <div className="share-box">
                      <p className="share-link">
                          
                          <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                              {shareableLink}
                          </a>
                      </p>
                  </div>
              </div>
              <div className="email-input-container">
                  <input
                      type="email"
                      placeholder="Enter recipient's email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <button className="send-email-button" onClick={handleSendEmail}>
                      Share invite link
                  </button>
              </div>
          </>
      )}
  </div>
    );
};

export default Home;
