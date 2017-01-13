'use strict';

(function() {
  let json;
  let reader;
  const progress = document.querySelector('.percent');
  const cancel = document.getElementById('cancel');
  const result = {};


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

      // reader.onerror = errorHandler;
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
          flatten(json);

        } catch (err) {
          alert('Err when trying to parse json = ' + err);
        }
      }
    })(file);
      reader.readAsText(file);
    }
  }

  const flatten = (data) => {
    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
            recurse(cur[i], prop + "[" + i + "]");
            if (l == 0) result[prop] = [];
        } else {
            let isEmpty = true;
            for (let p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
        }
    }
    recurse(data, '');
    makeHtml();
};

const makeHtml = (json) => {
  let html = '';
  let tempArr = [];

  for (let keys in result) {
    html += keys.indexOf('tag') > 0  ? `${result[keys]}` : `${result[keys]}`
    tempArr.push(html);
    // console.log(html);
  }

  tempArr.map((item) => {
    z.innerHTML = 'test satu dua tiga<';
document.body.appendChild(z);
    console.log(item);
    const z = document.createElement('div');
    document.getElementById('html').appendChild(item);
  })
}

  document.getElementById('files').addEventListener('change', handleFile, false);
})();
