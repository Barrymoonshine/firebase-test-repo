import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './styles.css';

const firebaseConfig = {
  apiKey: 'AIzaSyDUnLD_GjN5TAhm_rFz0Y29KzB-Xwu2aRo',
  authDomain: 'fir-test-6874f.firebaseapp.com',
  projectId: 'fir-test-6874f',
  storageBucket: 'fir-test-6874f.appspot.com',
  messagingSenderId: '320740183058',
  appId: '1:320740183058:web:3ff2225fa18ad5b00e9ccb',
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const collectionReference = collection(db, 'books');

// get collection data
getDocs(collectionReference)
  .then((snapshot) => {
    const books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
  })
  .catch((err) => {
    console.log(err);
  });
