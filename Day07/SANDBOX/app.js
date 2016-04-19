
//practice passing a function with a parameter to an iffe


(function(a,b){
   a(); 
console.log(a(6)+b)
    
})(defineA,6);

//############################


function defineA (z){
  return z*z;
};


