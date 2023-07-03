//Parse CSV files as string array
async function parseCSV(path){
    //Get file from path start a promise chain
    let split_text = await fetch(path).then((file) => {
        //Pass the file's text to next chain
        return file.text();
    }).then((text) => {
        //Split text into string array
        return text.split("\n");
    });

    //returns the final string array
    return split_text;
}

//Parse CSV files from http request as string array
function parseCSVInput(e){
    //Obtains the contents of the file and returns it as string array
    var contents = e.target.result;
    return contents.split("\n");
}