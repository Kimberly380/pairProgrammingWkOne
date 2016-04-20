
(function (module) {
  function Article (opts) {
    this.author = opts.author;
    this.authorUrl = opts.authorUrl;
    this.title = opts.title;
    this.category = opts.category;
    this.body = opts.body;
    this.publishedOn = opts.publishedOn;
  }

  Article.all = [];

  Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  Article.loadAll = function(rawData) {
    rawData.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    });

    Article.all = rawData.map(function(ele) {
      return new Article(ele);
    });
  };

  Article.fetchAll = function(next) {
    if (localStorage.rawData) {
      Article.loadAll(JSON.parse(localStorage.rawData));
      next();
      console.log(Article.numWordsAll());
      console.log(Article.allAuthors());

      console.log(Article.numWordsByAuthor());
    }
    else {
      $.getJSON('/data/hackerIpsum.json', function(rawData) {
        Article.loadAll(rawData);
        localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
        next();  
      });
    }
  };
    
  Article.numWordsAll = function() {
    return Article.all.map(function(article) {
      return article.body.split(' ').length; 
    })
    .reduce(function(a, b) {
      return a+b;/
    },0);
  };
 
  Article.allAuthors = function() {
    return Article.all.map(function(article){
      return article.author;        
    })
       .reduce(function(a,b){
         if(a.indexOf(b)<0) {
           a.push(b);
         }
         return a;
       },[]);
  };
       
    Article.numWordsByAuthor = function() {
       return Article.allAuthors().map(function(author) {
        return {
        name:author,
        numWords: Article.all.map(function(obj){
                if( obj.author === author){
                 return obj.body.split(' ').length; 
                } else {return 0;}
         }).reduce(function(a,b){
           return a+b;
         })
      };
     });
    };

module.Article=Article;
})(window);


