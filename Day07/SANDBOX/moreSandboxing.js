//practice .map

arr = [1,2,3,4];


arr2 = arr.map(function(num){
    return num * 2;
   
})

console.log(arr2);

//********
// now reduce:

var reduceArr2 = arr2.reduce(function(a,b,c){
      return a+b+c;  //c is length of array?
});

console.log(reduceArr2);

var reduceArr2 = arr2.reduce(function(a,b){
   return a.concat(b); 
    
});

console.log(reduceArr2);  //did not work??

