import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAdmins() {
  console.log('Checking admins in Firestore...');
  try {
    const querySnapshot = await getDocs(collection(db, 'admins'));
    console.log(`Found ${querySnapshot.size} admins.`);
    querySnapshot.forEach((doc) => {
      console.log(`- ID: ${doc.id}, Data:`, { ...doc.data(), password: '[HIDDEN]' });
    });
  } catch (error) {
    console.error('Error checking admins:', error);
  }
}

checkAdmins();
