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

    for (let i = 0, file; file = files[i]; i++) {

      const reader = new FileReader();

      reader.onerror = errorHandler;
      reader.onprogress = progress;
      reader.onabort = function(e) {
        alert('File read cancelled');
      };

      reader.onloadstart = function(e) {
        document.getElementById('progress_bar').className = 'loading';
      };

      reader.onload = (function (upload) {
        return function (e) {
          progress.style.width = '100%';
          progress.textContent = '100%';
          setTimeout("document.getElementById('progress_bar').className='';", 1000);
        try {
          json = JSON.parse(e.target.result);
          const appendTo = document.getElementById('html');
          let html = '';

          const getElements = (json) => {

            json.forEach((item) => {
              if (typeof item.content.content === 'string') {
                html += `<${item.tag}>${item.content.content}</${item.tag}>`
              } else if (Array.isArray(item.content.content)){
                html += `<${item.tag}>`

                getElements(item.content.content);

                html += `</${item.tag}>`
              } else if (typeof item.content === 'object') {
                html += `<${item.content.tag}>${item.content.content}</${item.content.tag}>`;
                getElements(item.content);
                console.log(`<${item.content.tag}>${item.content.content}</${item.content.tag}>`);
              } else {
                html += `<${item.tag}>${item.content}</${item.tag}>`

              }
            })
            console.log(html);
            appendTo.innerHTML = html;
          }
          getElements(json);
        } catch (err) {
          alert('Err when trying to parse json = ' + err);
        }
      }
    })(file);
      reader.readAsText(file);
    }
  }

  document.getElementById('files').addEventListener('change', handleFile, false);
})();
