'use strict';

(function() {
  let json;
  let reader;
  const progress = document.querySelector('.percent');
  const cancel = document.getElementById('cancel');

  cancel.addEventListener('click', abortRead);

  function abortRead() {
    reader.abort();
  }

  function errorHandler(e) {
    switch(e.target.error.code) {
      case e.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case e.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case e.target.error.ABORT_ERR:
        break;
      default:
        alert('An error occurred reading this file.');
    };
  }

  function updateProgress(e) {
    if (e.lengthComputable) {
      const percentLoaded = Math.round((e.loaded / e.total) * 100);

      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
  }

  function handleFile(e) {
    progress.style.width = '0%';
    progress.textContent = '0%';

    const files = e.target.files;

    for (let i = 0, f; f = files[i]; i++) {

      const reader = new FileReader();

      reader.onerror = errorHandler;
      reader.onprogress = progress;
      reader.onabort = function(e) {
        alert('File read cancelled');
      };

      reader.onloadstart = function(e) {
        document.getElementById('progress_bar').className = 'loading';
      };

      reader.onload = (function (theFile) {
        return function (e) {
          progress.style.width = '100%';
          progress.textContent = '100%';
          setTimeout("document.getElementById('progress_bar').className='';", 1000);
        try {
          json = JSON.parse(e.target.result);

          for (let i = 0; i < json.length; i++) {
            console.log(json[i]);
           for (let key in json[i]) {
             if (key === 'tag') {
               console.log('outer tag: ', json[i].tag);
             } else {
               console.log('inner tag: ', json[i].content.tag);
               console.log('content: ', json[i].content.content);
             }
             console.log('---------------');
           }
         }
        } catch (err) {
          alert('Err when trying to parse json = ' + err);
        }
      }
    })(f);
      reader.readAsText(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFile, false);
})();
