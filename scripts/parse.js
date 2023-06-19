async function parseCSV(path){
    let split_text = await fetch(path).then((file) => {
        return file.text();
    }).then((text) => {
        return text.split("\n");
    });
    return split_text;
}

async function parseCSVInput(e){
    var contents = e.target.result;
    return contents.split("\n");
}