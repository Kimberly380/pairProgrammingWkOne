(function(module) {
  function Article (opts) {
    // article object.
    Object.keys(opts).forEach(function(e, index, keys) {
      this[e] = opts[e];
    },this);
  }

  Article.all = [];

  Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  Article.createTable = function(callback) {
    console.log('something');
    webDB.execute(
      'DROP TABLE articles;'
    );
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS articles (title VARCHAR(255) NOT NULL, category VARCHAR (255) NOT NULL, author VARCHAR(255) NOT NULL, authorUrl VARCHAR(255) NOT NULL, publishedOn DATETIME NOT NULL, body TEXT NOT NULL);'
    ,
      function(result) {
        console.log('Successfully set up the articles table.', result);
        if (callback) callback();
        console.log(Article.all);
      }
    );
  };

  Article.truncateTable = function(callback) {
    webDB.execute(
      'DELETE FROM articles WHERE 1=1;',
      callback
    );
  };


  Article.prototype.insertRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO articles (title, category, author, authorUrl, publishedOn, body) VALUES(?, ?, ?, ?, ?, ?)',
          'data': [this.title, this.category, this.author, this.authorUrl, this.publishedOn, this.body],
        }
      ],
      callback
    );
  };


  Article.prototype.deleteRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql' : 'DELETE FROM articles WHERE title LIKE "%Transmitting%";'
        }
      ],
      callback
    );
  };

  Article.prototype.updateRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql' : 'UPDATE articles SET author = "Virginia Slims" WHERE author = "Virginia Sawayn";'
        }
      ],
      callback
    );
  };

  Article.loadAll = function(rows) {
    Article.all = rows.map(function(ele) {
      return new Article(ele);
    });
  };

  Article.fetchAll = function(next) {
    webDB.execute('SELECT * FROM articles;', function(rows) { // DONE: fill these quotes to 'select' our table.
      if (rows.length) {
        Article.loadAll(rows);
        next();
      } else {
        $.getJSON('/data/hackerIpsum.json', function(rawData) {
          rawData.forEach(function(item) {
            var article = new Article(item);
            article.insertRecord();

          });
          webDB.execute('SELECT * FROM articles;', function(rows) { 
            Article.loadAll(rows);
            next();
          });
        });
      }
    });
  };

  Article.allAuthors = function() {
    return Article.all.map(function(article) {
      return article.author;
    })
    .reduce(function(names, name) {
      if (names.indexOf(name) === -1) {
        names.push(name);
      }
      return names;
    }, []);
  };

  Article.numWordsAll = function() {
    return Article.all.map(function(article) {
      return article.body.match(/\b\w+/g).length;
    })
    .reduce(function(a, b) {
      return a + b;
    });
  };

  Article.numWordsByAuthor = function() {
    return Article.allAuthors().map(function(author) {
      return {
        name: author,
        numWords: Article.all.filter(function(a) {
          return a.author === author;
        })
        .map(function(a) {
          return a.body.match(/\b\w+/g).length;
        })
        .reduce(function(a, b) {
          return a + b;
        })
      };
    });
  };

  Article.stats = function() {
    return {
      numArticles: Article.all.length,
      numWords: Article.numwords(),
      Authors: Article.allAuthors(),
    };
  };

  module.Article = Article;
})(window);
