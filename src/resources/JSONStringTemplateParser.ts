/* 
A function to allow template strings in JSON files, by looking for a piece of string between "::" and taking that to be a key in an
object passed along to the function.
*/
export default function JSONStringTemplateParser(stringToParse: string, valueObj: object){
let resultString = '';
let decomposedString = stringToParse.split("::") //extracting the parts of the string that refer to variables

while (decomposedString.length > 0) {
    if (valueObj.hasOwnProperty(decomposedString[1])){
        resultString += decomposedString[0] + valueObj[decomposedString[1]] + decomposedString[2] 
                                              //Q: why this error? A string can be used to index an object right?
    } else {
        console.log("Error: the desired variable in the string is not contained in valueObj")
    }  
    
    decomposedString.splice(0,2)
} //adding the string part of the decomposed string and the variable that is in valueoObj into the result string. 
  //Continue until decomposed string is empty.
return resultString;
}