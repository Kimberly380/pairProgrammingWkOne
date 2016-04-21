$(runDemo(window)); // jQuery's "onDocReady"

function runDemo(my) {
  // DOM elements
  var $cmd   = $('#cmd');
  var $dbOut = $('#dbOut');
  var $rmLog = $('#rmLog');
  var $newButton = $('#newButton');
  var $loadingZone = $('#loadingZone');

  clearLog();

  my.articles = [];
  var articlesURL = 'articles.json';
  var fragmentName = '';

  // Render articles. Data must exist at this point!
  my.showArticles = function(A) {
    var articles = A;
    console.log('Async: Near top of showArticles(): articles='+articles);
    $.each(articles, function(i, a) {
      console.log('  a=' + a);
      var $row = $('<tr>');
      var $cell0 = $('<td>').text(a.author); $row.append($cell0);
      var $cell1 = $('<td>').text(a['title']); $row.append($cell1);
      var $cell2 = $('<td>').text(a['body']); $row.append($cell2);
      $dbOut.append($row);
    });
  };

  // Init SQL database. Wipe it clean; this is a demo and not Lab #8
  webDB.init();
  model.setupTable();

  // This is what the blog app would do on a localStorage cache miss
  // Get external data
  my.processJSON = function(data) {
    data.forEach(webDB.insertRecord);
    webDB.getAllArticles(my.showArticles);
    sandbox();
  };
  $.getJSON(articlesURL, my.processJSON);

  my.checksemi = function() {
    var cv = $cmd.val();
    // Run SQL cmd if at least one semicolon is in the text area
    if (cv.match(/.+;/)) { webDB.runSQLcmd(cv); }
  };

  $rmLog.on('click', clearLog);

/**** SANDBOX CODE *****/
  $newButton.on('click', runSQLcmd_numberOne);

  function runSQLcmd_numberOne() {
    webDB.execute([
      {sql: 'SELECT * FROM articles WHERE title LIKE "%the%"',
       data: []
      }
    ], function(result) { console.log(result); } );
  }

  function runSQLcmd_numberTwo() {
    webDB.execute([
      {sql: 'INSERT INTO articles (title, author, body) VALUES (?, ?, ?);',
       data: ['New Book', 'Ip Some', 'Crazy cool stuff!']
      }
    ], function(result) { console.log(result); } );
  }
/**** END SANDBOX CODE *****/




  // Check for semicolon on each textarea content change
  $cmd.on('input', my.checksemi);

  function sandbox() {
    console.log('sandbox');
    webDB.execute([
      {
        sql : 'DELETE FROM articles WHERE author LIKE ?',
        data : ['%Ursula%']
      }
    ], function (result) {
      console.log(result);
    });
  };

}
