//Request a file from the local server and parse it to an object
var request = new XMLHttpRequest();

request.open("GET", "./cp2020/text_info.json", false);
request.send(null)
const text_info = JSON.parse(request.responseText);

//Keeps reference of fonts used for the PDF
var fonts = [];

async function loadFont(font, pdfDoc){
    //Replaces promise chain
    //Obtains the font file and creates pdfDoc font from it
    const response = await fetch('./webassets/fonts/' + font.file);
    const buffer = await response.arrayBuffer();
    const fontFinal = await pdfDoc.embedFont(buffer);
    this.fonts[font.file] = fontFinal;
}

//Local storage of empty pdf
var tempPDF;

//Creates a new PDF document from two images
async function createBasePDF(){
    const frontURL = './cp2020/front.png';
    const backURL = './cp2020/back.png';

    //Creates blank PDF
    tempPDF = await PDFLib.PDFDocument.create();

    //Add two pages "simultaneously"
    await Promise.all([addPageFromImage(frontURL, tempPDF, 0), addPageFromImage(backURL, tempPDF, 1)]);
}

//Generates final PDF document
async function createPdf() {
    //if empty pdf is not created, create it
    if(tempPDF == null){
        await createBasePDF();
    }

    //Loads the fontkit
    var fontkit = window.fontkit;

    pdfDoc = await tempPDF.copy();
    
    //Add fonts to the document
    pdfDoc.registerFontkit(fontkit);
    await Promise.all([loadFont(FONT.ARIALNB, pdfDoc), loadFont(FONT.ARIAL, pdfDoc)]);

    //Reference to first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    //Tracker for current row and column of the skills
    var curRow = 0;
    var curCollumn = 0;

    //Gets list of tabs
    const tabs = await returnTabs();
    //Loops through each tab
    Object.keys(tabs).forEach(tabKey => {
        tab = tabs[tabKey];

        //If could not draw the tab header, stop the function
        if(!drawRow(firstPage, curRow, curCollumn, tab.tab_name, false, false)){ return false; };
        curRow += 1;
        
        //Checks if the column is full, otherwise go to next column
        if(curRow >= text_info.boxes[curCollumn].rows){
            curRow -= text_info.boxes[curCollumn].rows;
            curCollumn += 1;
        }
        //Loops through each skill
        tab.getSkills().forEach(skill => {
            if(skill.enabled){
                //Repeat for however many of a skill there is
                for(var i = 0; i < Math.max(skill.count, 1); i++){
                    //If could not draw the skill, stop the function
                    if(!drawRow(firstPage, curRow, curCollumn, skill.skill_name, true, skill.has_entry)) { return false; };
                    //Checks if the column is full, otherwise go to next column
                    //Required as first check is only for headers
                    curRow += 1;
                    if(curRow >= text_info.boxes[curCollumn].rows){
                        curRow -= text_info.boxes[curCollumn].rows;
                        curCollumn += 1;
                    }
                }
            }
        });
    });
    
    //Converts pdf object to bytes
    const pdfBytes = await pdfDoc.save();
    
    //Download the bytes as a pdf file
    download(pdfBytes, 'character_sheet.pdf', 'application/pdf');
    
};

//Uses image url to create a new page
async function addPageFromImage(url, pdfDoc, id){
    //Obtains the image and embeds it to the pdf document
    const pngResponse = fetch(url);
    const pngBuffer = await pngResponse.blob();
    
    const png = await pdfDoc.embedPng(new Uint8Array(await pngBuffer.arrayBuffer()));
    
    //Create a new page the size of the image
    
    const page = pdfDoc.insertPage(id, [png.width, png.height]);

    //Obtains size of the page
    const { width, height} = page.getSize();
    //Draws the image to fit the page
    page.drawImage(png, {
        x: 0,
        y: 0,
        width: width,
        height: height
    });
    
}

//Draws a row of text
function drawRow(page, row, collumn, text, is_skill, has_entry) {
    //Gets the size of the page
    const { width, height} = page.getSize();
    //Choose apropriate font
    var font = is_skill ? FONT.ARIAL : FONT.ARIALNB;
    //Gets the bounds of the skill collumn from JSON object
    const box = text_info.boxes[collumn];

    //Check if row is within the bounds
    if(collumn >= text_info.boxes.length) { return false; };
    if(row >= box.rows) { return false; };

    //Gets position of the row
    const xPos = box.x;
    const yPos = height - (box.y + ((row + 1) * text_info.row_height));

    //Strings for left and right aligned text
    var textL = text;
    var textR = "";

    const fillString = "[       ]";

    //sets the font according to the type of row
    var fontString = !is_skill ? "Bold " : "";
    fontString += font.size + "px Arial ";
    fontString += !is_skill ? "Narrow" : "";

    //Gets pixel width of the text
    const fillWidth = getTextWidth(fontString, "[       ]");
    const stringWidth = getTextWidth(fontString, text) + fillWidth;
    const charWidth = getTextWidth(fontString, has_entry ? "_" : ".");
    const columnWidth = parseInt('override_width' in box ? box.override_width : text_info.column_width);

    //If is a skill, fill empty space with dots or underscores
    if(is_skill){
        const charCount = Math.floor((columnWidth - stringWidth) / charWidth);
        for(var i = 0; i < charCount; i++){
            //If is entry right align the underscores, otherwise left align the dots
            if(has_entry){
                textR += "_";
            }else{
                textL += ".";
            }
        }
        //Right aligns the filler string
        textR += fillString;
    }
    //Draws the left aligned text
    page.drawText(textL, {
        x: xPos,
        y: yPos,
        size: font.size,
        font: this.fonts[font],
        color: window.PDFLib.rgb(0.0, 0.0, 0.0),
    })

    //Finds the position of the right aligned text and draws it
    xPosR = (box.x + columnWidth) - getTextWidth(fontString, textR);
    page.drawText(textR, {
        x: xPosR,
        y: yPos,
        size: font.size,
        font: this.fonts[is_skill ? FONT.ARIAL : FONT.ARIALNB],
        color: window.PDFLib.rgb(0.0, 0.0, 0.0),
    })

    //Returns true if the row was drawn successfully
    return true;
}

//ENUM for different types of fonts
const FONT = {
    ARIALNB: text_info.stat_font,
    ARIAL: text_info.skill_font
}

//Gets the pixel width of a string
function getTextWidth(font, text) {
    //Creates or uses an empty canvas with the given font
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    //Gets the width of the text from the canvas
    const metrics = context.measureText(text);
    return metrics.width;
}