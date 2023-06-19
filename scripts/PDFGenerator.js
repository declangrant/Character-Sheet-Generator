var request = new XMLHttpRequest();

request.open("GET", "./cp2020/text_info.json", false);
request.send(null)
const positionData = JSON.parse(request.responseText);

async function createPdf() {
    var fontkit = window.fontkit;
    var pdflib = window.PDFLib;
    const url = './cp2020/character_sheet_blank.pdf';
	const existingPdfBytes = await fetch(url).then((res) =>
		res.arrayBuffer(),
	);
    const pdfDoc = await pdflib.PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);

    const response = await fetch('./webassets/fonts/arialnb.ttf');
    const buffer = await response.arrayBuffer();
    console.log(buffer);
    const customFont = await pdfDoc.embedFont(buffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    var curRow = 1;
    var curCollumn = 0;
    
    firstPage.drawText('This text was added with JavaScript!', {
        x: positionData.boxes[0].x,
        y: height - (positionData.boxes[0].y + curRow * positionData.row_height),
        size: 110,
        font: customFont,
        color: pdflib.rgb(0.0, 0.0, 0.0),
    })
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "character_sheet.pdf");
};