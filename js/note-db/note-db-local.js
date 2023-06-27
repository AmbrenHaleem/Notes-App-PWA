/**
 * NotesDB Interface using Indexed DB
 */
 class NoteDB {
    constructor(){
        console.log('Note DB API initiated');
        this.storeName = 'NoteList';
        this.isAvailable = false;
        this.db = null;
    }
    open(){
        console.log('local NoteDB open');
        return new Promise((resolve, reject) => {
            // Validates whether the indexedDB object is available
            if (!indexedDB){
                reject('your browser doesnot support indexedDB');
                return;
            }
            const request = indexedDB.open(this.storeName,2);
            console.log('local index db Request', request);

            // Handles the error when opening/creating the database.
            request.onerror = (event) => {
                reject(event.target.error.message);
                // console.log('Error:', event);
                // console.log('Message:', event.target.error.message);
            };

            // Handles the success when opening/creating the database.
            request.onsuccess = (event) => {
                console.log('Success:', event);
                this.db = event.target.result;
                if (this.db){
                    this.IsAvailable = true;
                    resolve();
                }
                else
                {
                    reject('The database is not available');
                }
               // console.log('Database:', db);
            };

            // Handles the database upgrade.
            request.onupgradeneeded = event => {
                console.log('onupgradeneeded:', event);
                const db = event.target.result;
               // const storeName = 'Notes List';
                const objectStore = db.createObjectStore(this.storeName, {
                    //autoIncrement: true
                    keyPath: 'id'
                });
                // console.log('Object Store:', objectStore);
                objectStore.createIndex("note","note",{ unique: true});
                 objectStore.createIndex("category","category",{ unique: false});
                 objectStore.createIndex("description","description",{ unique: false});
            };
        });
    }
    add(noteTitle, category, description) {

        // Assumes initialy that the action will fail.
        let isSuccess = false;
        let error = null;
    
        // Creates the game object to be added.
        const note = {
          id: Date.now(),
          note: noteTitle,
          category: category,
          description: description
        };
    
        return new Promise((resolve, reject) => {
          if (!this.isAvailable) {
            reject('The database is not available.');
            return;
          }
    
          // Creates the transaction and store objects.
          const transaction = this.db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
    
          // Handles the transaction success.
          transaction.oncomplete = () => {
            if (isSuccess) {
              resolve(note);
            }
            else {
              reject(error || 'Unknown error');
            }
          };
    
          // Handles the transaction error.
          transaction.onerror = (event) => {
            reject(event.target.error.message);
          };
    
          // Adds the note to the store.
          const storeRequest = store.add(note);
    
          // Handles the add success.
          storeRequest.onsuccess = () => {
            isSuccess = true;
          }
    
          // Handles the add error.
          storeRequest.onerror = (event) => {
            error = event.target.error.message;
          }
        });
      }
    
    // add(note, category, description){
    //     console.log('Note add');
    //     const transaction = this.db.transaction([this.storeName], "readwrite");
    //     console.log('Transaction', transaction);

    //     transaction.oncomplete = (event) => {
    //         console.log("[Transaction] All done:",event);
    //     };
    //     // store handlers
    //     const store = transaction.objectStore(this.storeName);
    //     const storeRequest = store.add({
    //         id: Date.now(),
    //         note : note,
    //         category : category,
    //         description : description
    //     });
    //     storeRequest.onsuccess = event => {
    //         console.log('[Store] Add Success:', event);
    //     }
    //     storeRequest.onerror = event => {
    //         console.log('[Store] Add Error:', event );
    //     }
    // }
    get(){
        console.log('Note get');
    }
//     getAll(){
//         console.log('Note get all');
//         return new Promise((resolve,reject) => {
//             // connects to the store.
//             const transaction = this.db.transaction([this.storeName],'readonly');

//             // Handles the transaction error
//             transaction.onerror = (event) => {
//                 reject(event.target.error.message);
//             };

//             // Gets all data from the store.
//             const store = transaction.objectStore(this.storeName);
//            // const index = store.index('note');
//             const request = store.getAll();

//             // Handles the get success.
//             request.onsuccess = (event) => {
//                 console.log('Get All Success:', event);
//             if(event.target.result){
//                 resolve(event.target.result);
//             }
//             else {
//                 reject('Id not found');
//             }
//         };
//             // handles the get failure
//         request.onerror = (event) => {
//             reject(event.target.error.message);
//         }
//     })
// }
getAll() {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      // Connects to the store.
      const transaction = this.db.transaction([this.storeName], 'readonly');

      // Handles the transaction error.
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };

      // Gets all data from the store.
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      // Handles the get success.
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      // Handles the get failure.
      request.onerror = (event) => {
        reject(event.target.error.message);
      }
    });
  }
delete(noteId) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      // Connects to the store.
      const transaction = this.db.transaction([this.storeName], 'readwrite');

      // Handles the transaction error.
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };

      // Gets all data from the store.
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(noteId);

      // Handles the get success.
      request.onsuccess = () => {
        resolve();
      };

      // Handles the get failure.
      request.onerror = (event) => {
        reject(event.target.error.message);
      }
    });
  }


    // delete(noteId){
    //     console.log('Note delete');
    //     return new Promise((resolve, reject) => {

    //         // connects to the store
    //         const transaction = this.db.transaction([this.storeName], "readwrite");
        
    //         // Handles the transaction error.
    //         // transaction.error = (event) => {
    //         //   reject(event.target.error.message);
    //         // };
        
    //         //delete data fro store
    //         const store = transaction.objectStore(this.storeName);
    //         const request = store.delete(noteId);
        
    //         // Handles the get success.
    //         request.onsuccess = () => {
    //           resolve();
    //         };
        
    //          // Handles the get failue.
    //          request.onerror = (event) => {
    //           reject(event.target.error.message);
    //         };
    //       });
    // }
}

export default new NoteDB();