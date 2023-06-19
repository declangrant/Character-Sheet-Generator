window.onload = init;

function init(){
    document.getElementById('file_upload_form').addEventListener('change', readSingleFile);
}

function readSingleFile(evt) {
    var f = evt.target.files[0]; 
    if (f) {
        var r = new FileReader();
        r.onload = function(e) {
            document.body.removeChild(document.getElementById("file_upload_form"));
                       
            parseCSV("./cp2020/skills.csv").then((lines) => {
                console.log(lines);
                var tabDiv = document.createElement("div");
                tabDiv.className = "tab_div";
                document.body.appendChild(tabDiv);
                for(var i = 1; i < lines.length; i++){
                    var splitLine = lines[i].split(",");
                    console.log(splitLine[0]);
                    var skillObject = new Skill(splitLine[0], splitLine[1].toUpperCase(), splitLine[2], splitLine[3], splitLine[4], splitLine[5]);

                    var stat_name = skillObject.stat.toUpperCase();
                    var stat_tab = document.getElementById(stat_name);

                    var table;
                    if(!stat_tab){
                        stat_tab = document.createElement("div");
                        stat_tab.id = stat_name;
                        stat_tab.className = "stat_content";
                        document.body.appendChild(stat_tab);

                        var tab_button = document.createElement("button");
                        tab_button.className = "tab_links";
                        tab_button.setAttribute("onclick", "openTab(event, \"" + stat_name + "\")");
                        tab_button.innerText = stat_name;
                        tabDiv.appendChild(tab_button);

                        table = document.createElement("table")
                        table.id = "table_" + stat_name;

                        stat_tab.appendChild(table);
                    }

                    table = document.getElementById("table_" + stat_name);

                    var table_row = document.createElement("tr");
                    table_row.id = skillObject.skill_name;
                    table_row.setAttribute("style", "inline-block");


                    var td = document.createElement("td");
                    var checkbox = document.createElement("input");
                    checkbox.id = skillObject.skill_name + "_checkbox"
                    checkbox.type = "checkbox";
                    checkbox.className = "should_enable";
                    checkbox.checked = skillObject.enabled.toLowerCase() === "true";
                    checkbox.addEventListener('change', (event) => {
                        skillObject.enabled = event.currentTarget.checked;
                    })

                    td.append(checkbox);
                    table_row.append(td);

                    createSpinBox(skillObject, table_row);

                    td = document.createElement("td");
                    var nameLabel = document.createElement("label");
                    nameLabel.innerText = "\u2002" + table_row.id;
                    nameLabel.htmlFor = checkbox.id;

                    td.appendChild(nameLabel);
                    table_row.append(td);

                    td = document.createElement("td");
                    var sourceLabel = document.createElement("label");
                    sourceLabel.innerText = "\u2003[" + skillObject.source.replace(/(\r\n|\n|\r)/gm, "") + "]";
                    sourceLabel.htmlFor = checkbox.id;

                    td.appendChild(sourceLabel);
                    table_row.append(td);

                    td = document.createElement("td");
                    td.style = "width: 20px";
                    table_row.append(td);
                    table.appendChild(table_row);

                    document.body.appendChild(stat_tab);
                }

                var pdfButton = document.createElement("button");
                pdfButton.textContent = "Generate PDF";
                pdfButton.addEventListener("click", (event) => {
                    createPdf();
                });
                document.body.appendChild(pdfButton)
                                
            });
        }
        r.readAsText(f);
    } else { 
        alert("Failed to load file");
    }
}

function openTab(evt, tabName) {
    var i, statcontent, tablinks;
  
    statcontent = document.getElementsByClassName("stat_content");
    for (i = 0; i < statcontent.length; i++) {
      statcontent[i].style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tab_links");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function createSpinBox(skillObject, table_row){
    if(skillObject.count > 0){
        td = document.createElement("td");
        var container = document.createElement("div");
        container.className = "container";

        var incrementButton = document.createElement("div");
        incrementButton.id = "increment_button";

        var upButton = document.createElement("input");
        upButton.type = "image";
        upButton.id = "up_button";
        upButton.src = "webassets/images/up_arrow.png";
        upButton.setAttribute("height", "20px")

        incrementButton.appendChild(upButton);
        container.appendChild(incrementButton);

        var totalCount = document.createElement("div");
        totalCount.id = "total_count";
        totalCount.innerText = skillObject.count;
        totalCount.setAttribute("style", "text-align: center;");

        container.appendChild(totalCount);

        var decrementButton = document.createElement("div");
        decrementButton.id = "decrement_button";

        var downButton = document.createElement("input");
        downButton.type = "image";
        downButton.id = "down_button";
        downButton.src = "webassets/images/down_arrow.png";
        downButton.setAttribute("height", "20px")
        decrementButton.appendChild(downButton);
        container.appendChild(decrementButton);
        td.append(container);
        table_row.append(td);

        upButton.addEventListener("click", increaseCounter.bind(null, totalCount, skillObject), false);
        downButton.addEventListener("click", decreaseCounter.bind(null, totalCount, skillObject), false);
    }else{
        td = document.createElement("td");
        table_row.append(td);
    }
}


function increaseCounter(counterElement, skill) {
    skill.addCount(1);
    updateCounter(counterElement, skill);
}

function decreaseCounter(counterElement, skill) {
    skill.removeCount(1);
    updateCounter(counterElement, skill);
}

function updateCounter(counterElement, skill){
    var count = skill.count;
    counterElement.innerText = count;
    updateSkillCount(skill);
}