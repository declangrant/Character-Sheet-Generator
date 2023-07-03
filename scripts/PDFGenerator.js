window.addEventListener("load", createBasePDF);
var request = new XMLHttpRequest();

request.open("GET", "./cp2020/text_info.json", false);
request.send(null)
const text_info = JSON.parse(request.responseText);


var fonts = [];

async function loadFont(font, pdfDoc){
    const response = await fetch('./webassets/fonts/' + font.file);
    const buffer = await response.arrayBuffer();
    const fontFinal = await pdfDoc.embedFont(buffer);
    this.fonts[font.file] = fontFinal;
}

var tempPDF;
async function createBasePDF(){
    const frontURL = './cp2020/front.png';
    const backURL = './cp2020/back.png';
    tempPDF = await PDFLib.PDFDocument.create();
    await addPageFromImage(frontURL, tempPDF);
    await addPageFromImage(backURL, tempPDF);
}

async function createPdf() {
    console.log("creating pdf");
    fonts = [];
    var fontkit = window.fontkit;
    var pdflib = window.PDFLib;

    pdfDoc = await tempPDF.copy();
    console.log("copied pdf");
    pdfDoc.registerFontkit(fontkit);
    const header_font = loadFont(FONT.ARIALNB, pdfDoc)
    const skill_font = loadFont(FONT.ARIAL, pdfDoc);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    var curRow = 0;
    var curCollumn = 0;

    console.log("adding skill");
    const tabs = await returnTabs();
    Object.keys(tabs).forEach(tabKey => {
        tab = tabs[tabKey];

        if(!drawRow(firstPage, curRow, curCollumn, tab.tab_name, false, false)){ return false; };
        curRow += 1;
        if(curRow >= text_info.boxes[curCollumn].rows){
            curRow -= text_info.boxes[curCollumn].rows;
            curCollumn += 1;
        }
        tab.getSkills().forEach(skill => {
            if(skill.enabled){
                for(var i = 0; i < Math.max(skill.count, 1); i++){
                    if(!drawRow(firstPage, curRow, curCollumn, skill.skill_name, true, skill.has_entry)) { return false; };
                    curRow += 1;
                    if(curRow >= text_info.boxes[curCollumn].rows){
                        curRow -= text_info.boxes[curCollumn].rows;
                        curCollumn += 1;
                    }
                }
            }
        });
    });
    console.log("finished adding skill");
    const pdfBytes = await pdfDoc.save();
    console.log("saving");
    download(pdfBytes, 'character_sheet.pdf', 'application/pdf');
    console.log("downloading");
};

async function addPageFromImage(url, pdfDoc){
    console.log("adding image");
    const pngResponse = await fetch(url);
    const pngBuffer = await pngResponse.blob();
    const png = await pdfDoc.embedPng(new Uint8Array(await pngBuffer.arrayBuffer()));

    const page = pdfDoc.addPage([png.width, png.height]);

    const { width, height} = page.getSize();
    page.drawImage(png, {
        x: 0,
        y: 0,
        width: width,
        height: height
    });
    console.log("finished adding image");
}

function drawRow(page, row, collumn, text, is_skill, has_entry) {
    const { width, height} = page.getSize();
    var font = is_skill ? FONT.ARIAL : FONT.ARIALNB;
    const box = text_info.boxes[collumn];

    if(collumn >= text_info.boxes.length) { return false; };
    if(row >= box.rows) { return false; };

    const xPos = box.x;
    const yPos = height - (box.y + ((row + 1) * text_info.row_height));

    var textL = text;
    var textR = "";

    const fillString = "[       ]";

    var fontString = !is_skill ? "Bold " : "";
    fontString += font.size + "px Arial ";
    fontString += !is_skill ? "Narrow" : "";

    const fillWidth = getTextWidth(fontString, "[       ]");
    const stringWidth = getTextWidth(fontString, text) + fillWidth;
    const charWidth = getTextWidth(fontString, has_entry ? "_" : ".");
    const columnWidth = parseInt('override_width' in box ? box.override_width : text_info.column_width);

    if(is_skill){
        const charCount = Math.floor((columnWidth - stringWidth) / charWidth);
        for(var i = 0; i < charCount; i++){
            if(has_entry){
                textR += "_";
            }else{
                textL += ".";
            }
        }
        textR += fillString;
    }
    page.drawText(textL, {
        x: xPos,
        y: yPos,
        size: font.size,
        font: this.fonts[font],
        color: window.PDFLib.rgb(0.0, 0.0, 0.0),
    })

    xPosR = (box.x + columnWidth) - getTextWidth(fontString, textR);
    page.drawText(textR, {
        x: xPosR,
        y: yPos,
        size: font.size,
        font: this.fonts[is_skill ? FONT.ARIAL : FONT.ARIALNB],
        color: window.PDFLib.rgb(0.0, 0.0, 0.0),
    })
    return true;
}

const FONT = {
    ARIALNB: text_info.stat_font,
    ARIAL: text_info.skill_font
}

function getTextWidth(font, text) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  
  function getCssStyle(element, prop) {
      return window.getComputedStyle(element, null).getPropertyValue(prop);
  }