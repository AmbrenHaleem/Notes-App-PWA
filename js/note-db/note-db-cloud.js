import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

/**
 * NoteDB Interface using Firebase Firestore
 */
class NoteDB {
  constructor() {
    this.storeName = 'NoteList';
    this.isAvailable = false;
    this.db = null;
  }

  /**
   * Opens the database.
   */
  open() {
    return new Promise((resolve, reject) => {
      try {

        // Your web app's Firebase configuration
        // const firebaseConfig = {
        //   apiKey: "AIzaSyCNf4TL5HfQYnWBgwtmlRVakhxGhBgEfeg",
        //   authDomain: "games-app-5498c.firebaseapp.com",
        //   projectId: "games-app-5498c",
        //   storageBucket: "games-app-5498c.appspot.com",
        //   messagingSenderId: "17358048537",
        //   appId: "1:17358048537:web:f0fc4c7aa07d4b63aa4988"
        // };
        const firebaseConfig = {
          apiKey: "AIzaSyBud6suf_GCgdOVijn0NCNQWC8WIJixmPw",
          authDomain: "notes-app-c46b0.firebaseapp.com",
          projectId: "notes-app-c46b0",
          storageBucket: "notes-app-c46b0.appspot.com",
          messagingSenderId: "1029324701811",
          appId: "1:1029324701811:web:b53ed9d9f7cb272ca7ea06"
          };
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Initialize Cloud Firestore and get a reference to the service
        this.db = getFirestore(app);
        if (this.db) {
          this.isAvailable = true;
          resolve();
        }
        else {
          reject('The database is not available.');
        }
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Adds a new song to the database.
   */
  add(note, category, description) {

    // Creates the song object to be added.
    const noteObj = {
      note: note,
      category: category,
      description: description
    };

    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {
        // Connects to the Firebase collection.
        const dbCollection = collection(this.db, this.storeName);

        // Includes the new object to the collection.
        addDoc(dbCollection, noteObj)
          .then(() => {
            resolve(noteObj);
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
  * Retrieves a specific song.
  */
  get(id) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Get the document reference.
        const docRef = doc(this.db, this.storeName, id);

        // Retrives the document.
        getDoc(docRef)
          .then((docSnap) => {
            const data = docSnap.data();
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Retrieves all songs from the database.
   */
  getAll() {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Connects to the Firebase collection.
        const dbCollection = collection(this.db, this.storeName);

        // Gets the date form the collection.
        getDocs(dbCollection)
          .then((querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              result.push({
                ...data,
                id: doc.id
              });
            });

            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });

      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Retrieves the songs based on a given genre.
   */
  getByTitle(title) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Connects to the Firebase collection.
        const dbCollection = collection(this.db, this.storeName);

        // Creates a query for the collection.
        const dbQuery = query(dbCollection, where('title', '==', title));

        // Gets the date from the query.
        getDocs(dbQuery)
          .then((querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              result.push({
                ...data,
                id: doc.id
              });
            });

            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });

      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Updates an entry in the database.
   */
  update(updatedNote) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Get the document reference.
        const docRef = doc(this.db, this.storeName, updatedNote.id);

        // Updates the document.
        updateDoc(docRef, {
          likes: updatedNote.likes
        })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Removes an entry from the database.
   */
  delete(noteId) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Get the document reference.
        const docRef = doc(this.db, this.storeName, noteId);

        // Deletes the document.
        deleteDoc(docRef)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }
}

export default new NoteDB();
