
if ('serviceWorker' in navigator){
    //navigator.serviceWorker.register('../../service-worker.js', { scope : '/'})
    navigator.serviceWorker.register('../service-worker.js', {
      scope: '/',
      type: 'module'
    })
      .then(function(registration){
          console.log('Register Success : ' , registration)
      })
      .catch(function(error){
        console.log('Registration Failed : ', error)
      })
  }
  else{
      console.log('Service workers are not supported.')
  }

//   // Load posts from the web
// window.addEventListener('load', () => {
//   if (navigator.onLine) {
//     loadPosts();
//   }
//   else {
//     renderOffline();
//   }
// });
/**
 * Load posts from the web
 */
// function loadPosts() {
//   fetch('https://jsonplaceholder.typicode.com/posts')
//     .then(response => response.json())
//     .then(json => renderPost(json));
// }

/**
 * Render loaded posts
 */
function renderPost(posts) {
  // const output = document.getElementById('post-output');
  // output.innerHTML = '';

  // const topPosts = posts.slice(0, 10);
  // topPosts.forEach(post => {
  //   output.innerHTML += `
  //     <div class='post-item'>
  //       <h3>${post.title}</h3>
  //       <div class='text'>${post.body}</div>
  //     </div>
  //   `;
  // });
}/**
 * Display an message when offline
 */
function renderOffline() {
  // const output = document.getElementById('post-output');
  // output.innerHTML = `
  //   <div class='offline-message'>
  //     <h3>No internet connection</h3>
  //     <p>Please, check your connection and try again later.</p>
  //   </div>
  // `;
}


  /**
   * Validate the available storage
   */
if (navigator?.storage?.estimate){
  navigator.storage.estimate()
  .then((result) => {
    console.log('Result: ',result);
    // calculates the remaining quota
    const remaining = result.quota -  result.usage;

    // calculate percentage used
    const percentageUsed = (result.usage / result.quota) * 100;

    // Helper function to write value in Megabytes
    const writeMB = (value) => {
      return parseInt(value / 1000000).toLocaleString() + 'MB'
    }
    // Write the value to console
    console.log('Total : ' + writeMB(result.quota) + ', Percentage Used : ' + percentageUsed.toFixed(2) + '%, Remaining : ' + writeMB(remaining));
  });
}
else {
  ons.notification.alert('Storage not available.');
}



