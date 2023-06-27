import noteDB from '../js/note-db/note-db.js';
console.log('page script : Note DB', noteDB);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready
    .then(function (registration) {
      if (registration.sync) {
         console.log('Background Sync:', registration.sync);
        registration.sync.register('my-tag-name')
          .then(() => {
             console.log('Tag registered!!!');
          });

        // registration.sync.getTags()
        //   .then((tags) => {
        //      console.log('Tags:', tags);
        //     if (tags.includes('my-tag-name')) {
        //       // console.log('Tag already registered.');
        //     }
        //   });

      } else {
        console.log('Background Sync not Available.');
      }

      // const controller = registration.active;
      // controller.postMessage('Greetings from the Add page.');

      // const data = {
      //   name: 'John',
      //   age: 32,
      //   isStudent: true,
      //   action: 'include'
      // };
      // controller.postMessage(data);

    });

    navigator.serviceWorker.addEventListener('message', (message) => {
      console.log('[PS] Message Received:', message);

      const data = message.data;
      console.log('[PS] Received Data:', data);
      if (data.action === 'note-sync') {
        const warning = document.createElement('div');
        document.getElementById('list-output').append(warning);
        warning.innerHTML = `
        <p>
          Syncronized ${data.count} games!
        </p>
      `;
      }

    });

  // const controller = navigator.serviceWorker.controller;
  // console.log('SW Controller:', controller);

}
else {
  console.log('Service Worker is not supported by this browser.');
}
/**
 * Toolbar change event
 */
document.addEventListener('prechange', function(event) {
    document.querySelector('ons-toolbar .center')
      .innerHTML = event.tabItem.getAttribute('label');
      console.log('change');
  });
/**
 * Add note function
 */
// const noteDB = new NoteDB();
// console.log('Note DB Object', noteDB);
noteDB.open()
.then(() => {
  console.log('Open success');
  noteDB.getAll()
  .then(displayNotes);
})
.catch((error) => {
  //console.log('Open error:',error);
  ons.notification.alert(error);
})

// Load posts from the web
// window.addEventListener('load', () => {
//   if (navigator.onLine) {
//     noteDB.open()
//     .then(() => {
//       console.log('Open success');
//       noteDB.getAll()
//       .then(displayNotes);
//     })
//     .catch((error) => {
//       //console.log('Open error:',error);
//       ons.notification.alert(error);
//     })
//   }
//   else {
//    // renderOffline();
//   }
// });
function saveNote(){
  // get the user input
  const noteTitle = document.getElementById('note').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;

  const invalidMessages = [];
  if (!note){
    invalidMessages.push('Note field is required.');
  }
  if(!category){
    invalidMessages.push('Category field is required.');
  }
  if(!description){
    invalidMessages.push('Description field is required.');
  }
  if (invalidMessages.length > 0) {
    const description = invalidMessages.join('<br>');
    ons.notification.alert('Invalid data! <br>' + description);
    return;
  }
  // noteDB.add(note,category,description);
  // ons.notification.alert('Note added successfully!');
  // noteDB.getAll()
  // .then(displayNotes);
  // Opens the database.
//   noteDB.open()
//   .then(() => {
//     // document.getElementById('add-button').disabled = false;
//     console.log('Open success');
// });
    // Adds the game to the database.
    noteDB.add(noteTitle,category,description)
    .then((note) => {
      ons.notification.alert('Note added successfully!');
      noteDB.getAll()
      .then(displayNotes);
      // clears the user input
        document.getElementById('note').value = '';
        document.getElementById('category').value = '';
        document.getElementById('description').value = '';
    })
     .catch((error) => {
       displayFailureMessage('Failed to add game!', error);
     });
 
  //})
  //.catch((error) => {
   // ons.notification.alert(error);
    // Display the error message.
    // const ribbon = document.createElement('div');
    // ribbon.className = 'error-ribbon';
    // ribbon.innerText = error;
    // const header = document.getElementsByTagName('header')[0];
    // header.appendChild(ribbon);
  //});
}

function getAllNotes(){
  noteDB.getAll();
}

document.addEventListener('click', function(event) {
  if (event.target.id === 'btnSave')
  {
    saveNote();
  }
  if (event.target.id === 'btnDelete')
  {   //console.log('Delete event:',event);
      const noteId = document.getElementById('btnDelete').getAttribute('class');
      //console.log('Note Id', noteId.split(" ")[0]);
      deleteNote(noteId.split(" ")[0]);
  }
  if (event.target.id === 'btnFullScreen')
  {
    handleFullscreenAPI();
  }
  if (event.target.id === 'btnNetworkInfo')
  {
    handleNetworkInformation();
  }
});
/**
 * Display all notes.
 */
function displayNotes(notes) {
  document.getElementById('list-output').innerHTML = '';
  if (notes.length > 0) {
    var notesList = '';
    notes.forEach((note) => {
      notesList += `<ons-list-item modifier="longdivider" expandable class="taskContainer">
      Tap to expand  
      <div class="expandable-content">
          ${note.note} </br>
          ${note.description}
          <div class="ons-listbuttonDiv">
            <ons-button id="btnDelete" class = ${note.id} >Delete</ons-button>
          </div>
        </div>
        <div class="right"> 
          ${note.category}
        </div>
        
      </ons-list-item>`
    });
    document.getElementById('list-output').innerHTML = notesList;
   
  }
  else{
    displayNotFound();
  }
}

/**
 * Displays a 'not found' message.
 */
function displayNotFound(){
  document.getElementById('list-output').innerHTML = `
  <div class='Note-not-found'>
  No note was found in the database.
  </div>
  `;
}
/**
 * Displays a 'failure' message.
 */
function displayFailureMessage(message){
  document.getElementById('list-output').innerHTML = `
  <div class='Note-not-found'>
  ${message}
  </div>
  `;
}
/**
 * Append the nodes
 */
function appendNote(notesList){
  const elemItem = document.getElementById('list-output');
  elemItem.append(notesList);
}
/**
 * Delete the note
 */
function deleteNote(noteId){
  console.log('delete',noteId);
  noteDB.delete(noteId)
  .then(() => {
    // elemNote.remove();
    requestUserPermission();
    console.log('Deleted');
     noteDB.getAll()
    .then(displayNotes);
  })
  .catch((error) => {
    displayFailureMessage( error);
  });
}

function requestUserPermission(){
  console.log("User permission requested.");
   Notification.requestPermission()
   .then((permission) => {
    console.log("permission : ",permission);
    if(permission == 'granted'){
        notificationAllowed();
    }
    else{
        notificationNotAllowed();
    }
   });
}
//onchange="statusChange()"


document.addEventListener('change', function(event) {
  if (event.target.id === 'deleteSwitch'){
    statusChange();
  }
});
/**
 * Set switch status
 */

function statusChange(){
  console.log("status change");
  const switchControl = document.getElementById('deleteSwitch');
 
  const btnDelete = document.querySelectorAll("[id^='btnDelete']")//document.getElementsByClassName('btnDelete');
  console.log(btnDelete);
  btnDelete.forEach((btn) => {
    if(switchControl.checked){
      btn.setAttribute('disabled',switchControl.checked);
    }
    else{
      btn.removeAttribute('disabled');
    }
  })
}


if ('Notification' in window && 'serviceWorker' in navigator){
  console.log('Permission', Notification.permission)
  switch (Notification.permission){
      case 'denied' : 
          notificationNotAllowed();
          break;
      case 'granted' : 
          notificationAllowed();
          break;
      case 'default' : 
          notificationNotAllowed();
          break;
  }
}
else{
notificationNotAllowed();
}

function notificationNotAllowed(){
  //send notification button displayed and form hidden
  console.log('Notification not allowed!');
}

function notificationAllowed(){
  //If granted, the form must be displayed. The button “Send
  //Notifications” must be hidden.
  console.log('Notification allowed!');
  displayNotification();
}

function displayNotification(){
  console.log('Notification', Notification);
  console.log('Notification', Notification.maxActions);
  const options = {
      body : "Note doesn't exist anymore." ,
      icon : '/images/logo.png',
      // image: '/images/thank-you.jpg',
      actions: [
          {
              action : 'confirm',
              title: 'Agree',
              // icon: '/images/okay.png',
          },{
              action: 'cancel',
              title: 'Disagree',
              // icon: '/images/cancel.png',
          }
      ],
      data: {
          name: 'ac'
      }
  };

  //new Notification('Successfully subscribed!', options);
  navigator.serviceWorker.ready.then(registration => {
      console.log('Registration',registration);
      registration.showNotification("Note deleted successfully.", options);
  });
}
// function notificationDefault(){
//   console.log('Notification default!');
// }

/**
 * The Fullscreen API adds methods to present a specific Element
 * (and its descendants) in fullscreen mode, and to exit fullscreen
 * mode once it is no longer needed.
 * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 */
function handleFullscreenAPI() {
  console.log('Document:', document);
  if ('fullscreenElement' in document && 'exitFullscreen' in document && document.fullscreenEnabled) {

    // Create the helper elements
    // const button = document.createElement('button');
    // button.innerText = 'Toggle Fullscreen';
    // output.appendChild(button);

    // const message = document.createElement('div');
    // message.innerText = 'Click on the button above';
    // output.appendChild(message);

    // Adds an action to the toggle button
    //button.addEventListener('click', () => {
      if (!document.fullscreenElement) {

        /**
         * Asks the user agent to place the specified element
         * (and, by extension, its descendants) into fullscreen
         * mode, removing all of the browser's UI elements
         * as well as all other applications from the screen.
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
         */
        document.documentElement.requestFullscreen()
          .then(() => {
            //message.innerText = 'You are on fullscreen mode now.'
          });
      }
      else {

        /**
         * Requests that the user agent switch from
         * fullscreen mode back to windowed mode.
         * https://developer.mozilla.org/en-US/docs/Web/API/Document/exitFullscreen
         */
        document.exitFullscreen()
          .then(() => {
            // message.innerText = 'You left the fullscreen mode.'
          });
      }
    //});
  }
  else {
    console.log('Fullscreen not available or enabled on this device.');
    // output.innerText = 'Fullscreen not available or enabled on this device.';
  }
}


/**
 * The Navigator.connection property returns an object containing information 
 * about the system's connection.
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
 */
function handleNetworkInformation() {
  console.log('navigator:', navigator);
  if ('connection' in navigator) {
    console.log('Connection:', navigator.connection);

    // Helper function to write the network information
    function writeNetworkInfo() {
      const { type, effectiveType, downlink, downlinkMax } = navigator.connection;

      const networkType = type || 'unknown';
      const networkEffectiveType = effectiveType || 'unknown';
      const networkDownlink = downlink || 'unknown';
      const networkDownlinkMax = downlinkMax || 'unknown';

      const messages = `<div>Current network type: <strong>${networkType}</strong></div>
      <div>Cellular connection type: <strong>${networkEffectiveType}</strong></div>
      <div>Estimated bandwidth: <strong>${networkDownlink}</strong> Mbps</div>
      <div>Maximum downlink: <strong>${networkDownlinkMax}</strong> Mbps</div>`

      ons.notification.alert(messages);
      // output.innerHTML = `
      //   <div>Current network type: <strong>${networkType}</strong></div>
      //   <div>Cellular connection type: <strong>${networkEffectiveType}</strong></div>
      //   <div>Estimated bandwidth: <strong>${networkDownlink}</strong> Mbps</div>
      //   <div>Maximum downlink: <strong>${networkDownlinkMax}</strong> Mbps</div>
      // `;
    }
    writeNetworkInfo(); // Write the initial state

    // The event that's fired when connection information changes.
    navigator.connection.addEventListener('change', () => {
      console.log('Connection changed:', navigator.connection);
      writeNetworkInfo();
    });
  }
  else {
    //output.innerText = 'Network information not available on this device.';
    console.log('Network information not available on this device.');
  }
}


/**
 * Triggered when the connection is lost
 */
window.addEventListener("offline", function () {
  // renderOffline();
    // Opens the database.
  noteDB.open()
  .then(() => {
    // document.getElementById('add-button').disabled = false;
    console.log('Open success');
});
});

/**
 * Triggered when the connection is restored
 */
window.addEventListener("online", function () {
 // loadPosts();
   // Opens the database.
  noteDB.open()
  .then(() => {
    // document.getElementById('add-button').disabled = false;
    console.log('Open success');
});
});