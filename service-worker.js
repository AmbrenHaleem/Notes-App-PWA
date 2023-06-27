import noteDB from "./js/note-db/note-db.js";

const cacheName = 'cacheAssets';
console.log('Note DB [SW]',noteDB);
/**
 * On install event 
 * Triggered when the service worker is installed
 */
self.addEventListener('install', function(event){
    //console.log('[Service Worker] Install!! :' , event);
    self.skipWaiting();
   // console.log(caches);
    event.waitUntil(
    caches.open(cacheName)
        .then(function(cache) {
            //console.log(cache);
        
            return cache.addAll([
                '/',
                '/index.html',
                '/images/logo.png',
                '/css/style.css',
                '/js/scripts.js',
                '/pages/scripts.js',
                //'/js/note-db/note-db-cloud.js',
                //'/js/note-db/note-db-local.js',
                //'/js/note-db/note-db.js',
                '/manifest.json',
                '/icons/favicon-196.png'
                // '/icons/android-chrome-512x512.png',
                // '/icons/favicon-32x32.png',
                // '/icons/favicon-16x16.png',
                // '/icons/android-chrome-192x192.png',
                //'https://jsonplaceholder.typicode.com/posts'
            ]);
        })
    );
});
    

/**
 * On Activate Event
 * Triggered when the service worker is activated
 */
self.addEventListener('activate', function(event){
    //console.log('[Service worker] Activate:',event);
    event.waitUntil(clients.claim());

    //Delete the old version of cache
    event.waitUntil(
        caches.keys()
        .then(function(cacheNames){
            return Promise.all(
                cacheNames
                .filter(item => item != cacheName)
                .map(item => caches.delete(item))
            )
        })
    );
});

/**
 * On Fetch Event
 * Triggered when the service worker retrieves an asset
 */
self.addEventListener('fetch',function(event){
    //Cache strategy: Stale While Revalidate
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open(cacheName)
            .then(function(cache){
                return cache.match(event.request)
                .then(function(cachedResponse){
                    const fetchedResponse = fetch(event.request)
                    .then(function(networkResponse){
                        cache.put(
                            event.request,
                            networkResponse.clone()
                        );
                        return networkResponse;
                    })
                    .catch(function(){
                        console.log("Sorry! the page is not available offline.")
                    })
                    return cachedResponse || fetchedResponse;
                });
            })
        );
    }
    //Cache strategy: Cache Only
    // event.respondWith(
    //     caches.open(cacheName)
    //     .then(function (cache){
    //         return cache.match(event.request)
    //         .then(function(response) {
    //             return response;
    //         })
    //     })
    // );

  //  Cache strategy: Network only
    // event.respondWith(
    //     fetch(event.request)
    //         .then(function(response) {
    //             return response;
    //         })
    //     )
    //});

    // //Cache strategy: Cache with network fallback
    // event.respondWith(
    //     caches.open(cacheName)
    //     .then(function (cache){
    //         return cache.match(event.request)
    //         .then(function(response) {
    //             return response || fetch(event.request);
    //         })
    //     })
    // );

    // //Cache strategy: Network with cache fallback
    // event.respondWith(
    //     fetch(event.request)
    //     .then(function(response){
    //         return response
    //     })
    //     .catch(function(){
    //         return caches.open(cacheName)
    //         .then(function(cache){
    //             return cache.match(event.request)
    //         })
    //     })
    // );
});
/**
 * On Message Posted
 */
self.addEventListener('message', (message) => {
    console.log('[SW] Message Received:', message);
  
    // console.log('Sender:', message.source.id);
    // const options = {
    //   includeUncontrolled: false,
    //   type: 'window'
    // };
    // clients.matchAll(options)
    //   .then((clientsMatch) => {
    //     clientsMatch.forEach((client) => {
    //       console.log('Client:', client.id);
    //       if (client.id === message.source.id) {
    //         client.postMessage('Thanks for the message!');
    //       }
    //     });
    //   });
  
    clients.get(message.source.id)
      .then((client) => {
        console.log('Client:', client);
        client.postMessage('Thanks for the message!!!');
      });
  });
  
  /**
 * On Background Synchronization
 */
self.addEventListener('sync', (event) => {
  switch (event.tag) {
    case 'my-tag-name':
      doWhat();
      break;

    case 'add-note':
      addNote();
      break;
  }
});

function doWhat() {
  console.log('Do what?????');
}
  
  function addNote() {
    noteDB.open()
      .then(() => {
        noteDB.dbOffline.getAll()
          .then((notes) => {
            console.log('Notes:', notes);
  
            // Process each game
            notes.forEach(note => {
              console.log('[SW] Note:',note);
  
              // Add the game to the online database
              noteDB.dbOnline.add(note.note, note.category, note.description)
                .then(() => {
                    noteDB.dbOffline.delete(note.id);
                });
            });
  
            // Sends a notification to the clients about the sync.
            // This is assuming the .add() and .delete() above
            // are successful, but a better code would use
            // Promise.all() to ensure the success.
            self.clients.matchAll().then((clients) => {
              console.log('Clients:', clients);
              clients.forEach((client) => {
                client.postMessage({
                  action: 'note-sync',
                  count: notes.length
                });
              });
            });
          });
      });
  }
  