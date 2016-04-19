
//create object constructor to capture data from data files
function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

//create an array "method" directly on the Article Object (question:  what's really the difference between this and a normal array, for example: 
// var articles = [] (global var) with a articles.push(this) inside the constructor function...?? Is it to preven the global var?)
Article.all = [];


//add prototype to publish the articles to index.html
Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

//new method created to determine sort order of Article objects (by date) and to populate the Article.all array
Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  rawData.forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
};

//Populate the data either from local storage (if avail) or from JSON feed (in this case a file).
Article.fetchAll = function() {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.getItem('storedData'))  //pass data from local storage to loadAll function
       );
    articleView.initIndexPage(); //run initIndexPage function which launches data-dependent event handlers;
  } else {
    $.getJSON('../data/ipsumArticles.json')  //if no data in storage, get data from file
     .done(function(data){     //only call these functions after the data has been retrieved
       Article.loadAll(data);
       localStorage.setItem('storedData',JSON.stringify(data) );  //store new data to local storage
       articleView.initIndexPage(data);  
     });
  }
};
