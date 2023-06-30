import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './styles.css';

const libraryContainer = document.getElementById('library-container');
const modal = document.getElementById('new-book-modal');
const modalButton = document.getElementById('modal-button');
const closeModalButton = document.getElementsByClassName('close')[0];
const newBookForm = document.getElementById('new-book-form');
const body = document.getElementById('body');

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

class Book {
  constructor(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
  }
}

class Library {
  constructor(element) {
    this.libraryContainer = element;
    this.myLibrary = [];
  }

  createLibrary() {
    // Removes all previous books and them back plus new book
    while (this.libraryContainer.firstChild) {
      this.libraryContainer.removeChild(this.libraryContainer.firstChild);
    }

    this.myLibrary.forEach((item, index) => {
      libraryContainer.innerHTML += String.raw`
        <div class='my-library-cards' id='${index}'>
          <div>
            <p>Title: ${item.title}</p> <br>
            <p>Author: ${item.author}</p> <br>
            <p>Number of pages: ${item.pages}</p> 
          </div>
          <button id='haveRead${index}'>${item.haveRead}</button>
          <button id='${index}'>Remove book</button>
        </div>`;
    });
  }

  styleHaveReadButton() {
    this.myLibrary.forEach((item, index) => {
      const haveReadButton = document.getElementById(`haveRead${index}`);
      if (item.haveRead === true) {
        haveReadButton.style.backgroundColor = '#4ade80';
        haveReadButton.innerText = 'Read';
      } else if (item.haveRead === false) {
        haveReadButton.style.backgroundColor = '#f87171';
        haveReadButton.innerText = 'Not read';
      }
    });
  }

  addNewBook() {
    const titleValue = document.getElementById('title').value;
    const authorValue = document.getElementById('author').value;
    const pagesValue = document.getElementById('pages').value;
    const haveReadValue = document.getElementById('have-read').checked;
    const newBook = new Book(
      titleValue,
      authorValue,
      pagesValue,
      haveReadValue
    );
    this.myLibrary.push(newBook);
  }

  resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('pages').value = '';
    document.getElementById('have-read').checked = false;
  }

  deleteBook(e) {
    // Deletes the selected book from the array and returns a new array
    const element = document.getElementById(e.target.id);
    const index = element.id;
    this.myLibrary.splice(index, 1);
    this.createLibrary();
    this.styleHaveReadButton();
  }

  updateReadStatus(e) {
    const haveReadButton = document.getElementById(e.target.id);
    const myLibraryArrayIndex = e.target.id.replace('haveRead', '');
    if (haveReadButton.textContent === 'Read') {
      haveReadButton.style.backgroundColor = '#f87171';
      haveReadButton.innerText = 'Not read';
      this.myLibrary[myLibraryArrayIndex].haveRead = false;
    } else if (haveReadButton.textContent === 'Not read') {
      haveReadButton.style.backgroundColor = '#4ade80';
      haveReadButton.innerText = 'Read';
      this.myLibrary[myLibraryArrayIndex].haveRead = true;
    }
  }
}
const libraryController = new Library(libraryContainer);

function handleForm(e) {
  e.preventDefault();
  libraryController.addNewBook();
  libraryController.createLibrary();
  libraryController.styleHaveReadButton();
  libraryController.resetForm();
  displayController.hideModal();
}
newBookForm.addEventListener('submit', handleForm);

libraryContainer.addEventListener('click', (e) => {
  // Checks if the target id only contains numbers and is therefore the delete button
  if (String(e.target.id).match(/^[0-9]+$/) != null) {
    libraryController.deleteBook(e);
    // Else the user has selected the read status button
  } else {
    libraryController.updateReadStatus(e);
  }
});

class Display {
  displayModal() {
    modal.style.display = 'flex';
    body.style.backgroundColor = 'rgba (0,0,0,0.4)';
  }

  hideModal() {
    modal.style.display = 'none';
  }
}
const displayController = new Display();

// Modal event listeners
modalButton.addEventListener('click', () => {
  displayController.displayModal();
});

closeModalButton.addEventListener('click', () => {
  displayController.hideModal();
});

// Hides the modal if the user clicks outside of the form
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    displayController.hideModal();
  }
});
