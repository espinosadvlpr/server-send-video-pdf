var pdf = require('html-pdf');

let html = '';

module.exports.createPdf = function createPdf(pixels){
    setHeader;
    setBody(pixels);
    savePdf();
}

function setHeader(){
    html = `
    <html>
    <head>
<style>
table#mitabla {border-collapse: collapse;
}

caption {
    font-family: monospace;
    font-size: 40px;
    font-weight: bold;
    text-align:center;
    color: #0a0405;
}

thead.cabecera tr td {
    font-family: monospace;
    font-size: 30px;
    font-weight: bold;
    text-align:center;
    color: #0a0405;
    padding: 15px;}

tfoot.pie tr td {
    font-size: 18px;
    font-weight: bold;
    font-family: Georgia;
    padding: 2px;}

tbody.cuerpo tr td {
    color: #111010;
    padding: 10px;
    text-align:center;}

td {border-style: solid;
    border-color: #1b1919;
 border-width: 1px;}
 
</style>

</head>  `;


}

function setBody(pixels){
    html = html + `
    
    <body>   
    <table id="mitabla">
    <caption>TOP 100 DE LOS PIXELES MAS USADOS</caption>
    <thead class="cabecera">
    <tr class="rojo">
    <td class="bajo"> COLOR </td>
    <td class="medio"> RGB </td>
    <td class="alto">  CANTIDAD </td>
    </tr>
    </thead>
    
    <tbody class="cuerpo">`;

        let table = '';
        for (var i = 0; i < pixels.length; i++) {
            table = table +` <tr>
      
            <td style="background-color: rgb(`+pixels[i].r+`,`+pixels[i].g+`,`+pixels[i].b+`)" ></td>
            <td> rgb(`+pixels[i].r+`,`+pixels[i].g+`,`+pixels[i].b+`)</td>
            <td>`+pixels[i].num+`</td>
    
            </tr>`  
        }
        table  = table + `</tbody></table></body></html>`;
        html = html + table;

}


function savePdf(){
    pdf.create(html).toFile('./informe.pdf', function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log("el archivo se guardo");
        }
    });    
}    