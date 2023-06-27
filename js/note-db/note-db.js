import dbOnline from './note-db-cloud.js';
import dbOffline from './note-db-local.js';

class NoteDB {
  constructor() {
    this.dbOnline = dbOnline;
    this.dbOffline = dbOffline;

    this.swController = null;
    this.swRegistration = null;
    console.log(' Note DB online', dbOnline);
    console.log(' Note DB offline', dbOffline);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          if (registration.active && registration.sync) {
            this.swController = registration.active;
            this.swRegistration = registration;
          }
        });
    }
  }

  open() {
    dbOnline.open();
    return dbOffline.open();
  }

  add(note, category, description) {
    
    if (navigator.onLine) {
      return this.dbOnline.add(note, category, description);
    }

    this.swRegistration.sync.register('add-note');
    return this.dbOffline.add(note, category, description);
  }

  get(id) {
    if (navigator.onLine) {
      return this.dbOnline.get(id);
    }

    // This project assumes that the user must be connected
    // to the internet to get any data listed. Alternatively,
    // you could use IndexedDB  and keep the local and cloud
    // databases synchronized. It would generate a bigger code
    // which would apply the same principal demonstrated so far.
    return new Promise((resolve, reject) => {
      reject('You must be connected to the web to get the data.');
    });
  }

  getAll() {
    if (navigator.onLine) {
      return this.dbOnline.getAll();
    }

    // This project assumes that the user must be connected
    // to the internet to get any data listed. Alternatively,
    // you could use IndexedDB and keep the local and cloud
    // databases synchronized. It would generate a bigger code
    // which would apply the same principal demonstrated so far.
    return new Promise((resolve, reject) => {
      reject('You must be connected to the web to get the data.');
    });
  }

  // getByGenre(genre) {
  //   if (navigator.onLine) {
  //     return this.dbOnline.getByGenre(genre);
  //   }

  //   // This project assumes that the user must be connected
  //   // to the internet to get any data listed. Alternatively,
  //   // you could use IndexedDB and keep the local and cloud
  //   // databases synchronized. It would generate a bigger code
  //   // which would apply the same principal demonstrated so far.
  //   return new Promise((resolve, reject) => {
  //     reject('You must be connected to the web to get the data.');
  //   });
  // }

  // update(updatedGame) {
  //   if (navigator.onLine) {
  //     return this.dbOnline.update(updatedGame);
  //   }

  //   // This project assumes that the user must be connected
  //   // to the internet to update any data. Alternatively,
  //   // you could create a process similar to the one created
  //   // for the add functionality:
  //   // - Create a store that will have GameList-ToUpdate
  //   // - If no connection is found, add to this store the 
  //   //   game that needs to be updated.
  //   // - Create a background synchronization that will be
  //   //   triggered once the connection is restored.
  //   // - For this action, list all games in GameList-ToUpdate,
  //   //   execute the update in the firebase database, and
  //   //   remove the game from GameList-ToUpdate.
  //   return new Promise((resolve, reject) => {
  //     reject('You must be connected to the web to update the data.');
  //   });
  // }

  delete(noteId) {
    if (navigator.onLine) {
      return this.dbOnline.delete(noteId);
    }

    // This project assumes that the user must be connected
    // to the internet to delete any data. Alternatively,
    // you could create a process similar to the one created
    // for the add functionality:
    // - Create a store that will have GameList-ToDelete
    // - If no connection is found, add to this store the 
    //   game that needs to be deleted.
    // - Create a background synchronization that will be
    //   triggered once the connection is restored.
    // - For this action, list all games in GameList-ToDelete,
    //   execute the delete in the firebase database, and
    //   remove the game from GameList-ToDelete.
    return new Promise((resolve, reject) => {
      reject('You must be connected to the web to delete the data.');
    });
  }
}

export default new NoteDB();