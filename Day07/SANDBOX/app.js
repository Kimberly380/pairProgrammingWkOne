




//get data from file, store in local storage
$.getJSON('data.json').done(function (data) {
      
       
    $('section').append(data[0].title);
    localStorage.setItem('storedData',JSON.stringify(data) )
    
});

//extract data from local storage
var storageStuff=
JSON.parse(localStorage.getItem('storedData'));





//
//function runAll(){   if local storage, etc
//}