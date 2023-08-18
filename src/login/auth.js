import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { showToast } from '../toast'; 

export const handleSubmit = async (values, register,navigate) => {
  
  const isAdminPromise = new Promise((resolve) => { //Check if admin is present
    const adminsCollection = collection(db, 'admin');

    getDocs(adminsCollection)
      .then((querySnapshot) => {
        const isAdmin = !querySnapshot.empty;
        resolve(isAdmin);
      })
      .catch((error) => {
        console.error('Error fetching admin data:', error);
        resolve(false);
      });
  });

  const hasAdmin = await isAdminPromise;

  console.log(hasAdmin);

  if (!register) { //Login
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/home');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        showToastMessage('Incorrect password');
        return;
      }
      if (error.code === 'auth/user-not-found') {
        showToastMessage('User not found');
        return;
      }
    }
  } else {
    if (!hasAdmin) { //Admin signup
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password);

        addDoc(collection(db, 'admin'), {//Add admin details to firestore
          email: values.email,
          password: values.password,
          isAdmin: true,
        })
          .then(() => {
            console.log('Registered successfully');
          })
          .catch((error) => {
            console.log(error.message);
          });
        navigate('/home');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          showToastMessage('Email already in use');
        } else {
          console.error('Error creating user', error);
        }
      }
    } else {//If admin exists, verify with the token
      const urlSearchParams = new URLSearchParams(window.location.search);
      const token = urlSearchParams.get('token');

      if (token) {
        const adminsCollection = collection(db, 'admin');

        getDocs(adminsCollection)
          .then(async(querySnapshot) => {
            if (!querySnapshot.empty) {
              const docSnapshot = querySnapshot.docs[0];

              const adminToken = docSnapshot.data().token; //Get admin token
                console.log(token);
                console.log(adminToken)
              if (adminToken && token === adminToken) {//Valid token
                await createUserWithEmailAndPassword(auth, values.email, values.password);
                navigate('/home')
              } else {
                showToastMessage('Unauthorized access');
              }
            } 
          })
         
          .catch((error) => {
            console.error('Error creating user:', error);
          });
      } else {
        showToastMessage('Unauthorized access');
      }
    }
  }
};


export const showToastMessage = (message) => {
  showToast('ERROR', message);
};
