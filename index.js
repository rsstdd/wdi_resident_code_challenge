'use strict';

(function() {
  var json;
  var reader;
  var progress = document.querySelector('.percent');

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
      var percentLoaded = Math.round((e.loaded / e.total) * 100);

      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
  }

  function handleFileSelect(e) {
    progress.style.width = '0%';
    progress.textContent = '0%';

    var files = e.target.files;

    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      reader.onerror = errorHandler;
      reader.onprogress = updateProgress;
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
          if (json.length === 0) {
            alert('Add content to JSON file');
          }
          console.log(json);
        } catch (err) {
          alert('ex when trying to parse json = ' + err);
        }
      }
    })(f);
      reader.readAsText(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
})();
