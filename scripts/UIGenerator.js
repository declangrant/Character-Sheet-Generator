window.addEventListener("load", setupUI);

const tabs = Object();

async function setupUI(){
    await returnTabs().then((tabs) => {
        var tabDiv = document.createElement("div");
        tabDiv.className = "tab_div";
        document.body.appendChild(tabDiv);

        var firstTab = true;
        Object.keys(tabs).forEach(async tabString => {
            var tab = tabs[tabString];

            let skills = await tab.getSkills();
            skills.forEach(skillObject => {
                var stat_name = skillObject.stat.toUpperCase();
                var stat_tab = document.getElementById(stat_name);

                var grid;
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

                    if(firstTab){
                        tab_button.click();
                        firstTab = false;
                    }

                    grid = document.createElement("div")
                    grid.id = "grid_" + stat_name;
                    grid.className = "tabGrid";

                    stat_tab.appendChild(grid);
                }

                grid = document.getElementById("grid_" + stat_name);

                var skill_name = skillObject.skill_name == "" ? "<blank>" : skillObject.skill_name
                var skillDiv = document.createElement("div");
                skillDiv.id = skill_name;
                skillDiv.className = "skillDiv";

                var skillId = skill_name + skillObject.source
                var checkbox = document.createElement("input");
                checkbox.id = skillId + "_checkbox"
                checkbox.type = "checkbox";
                checkbox.className = "should_enable";
                checkbox.checked = skillObject.enabled;
                checkbox.addEventListener('change', (event) => {
                    skillObject.enabled = event.currentTarget.checked;

                    var count = Math.max(skillObject.count, 1);

                    if(event.currentTarget.checked){
                        totalSkills += count;
                    } else {
                        totalSkills -= count;
                    }

                    tabStorage[skillObject.stat] = skillObject;

                    updateTotalCounter();
                })

                skillDiv.append(checkbox);

                if(skillObject.count > 0){
                    var spinBox = document.createElement("input");
                    spinBox.type = "number";
                    spinBox.min = "1";
                    spinBox.max = "99";
                    spinBox.step = "1";
                    spinBox.value = skillObject.count;
                    
                    spinBox.setAttribute("style", "width: 30px");
                    spinBox.addEventListener("change", (event) => {
                        skillObject.updateCount(parseInt(event.target.value));
                        updateTotalCounter();
                    });
                    skillDiv.appendChild(spinBox);
                }

                var nameLabel = document.createElement("label");
                nameLabel.innerText = "\u2002" + skillDiv.id;
                nameLabel.htmlFor = checkbox.id;

                skillDiv.append(nameLabel);

                var sourceLabel = document.createElement("label");
                sourceLabel.innerText = "\u2003[" + skillObject.source.replace(/(\r\n|\n|\r)/gm, "") + "]";
                sourceLabel.htmlFor = checkbox.id;

                skillDiv.append(sourceLabel);
                grid.appendChild(skillDiv);

                document.body.appendChild(stat_tab);
            });
        });
    });
    var footer = document.createElement("div");
    footer.className = "footer";
    document.body.appendChild(footer);

    var skillCount = document.createElement("p");
    skillCount.innerText = "Skills: " + totalSkills + "/102";
    skillCount.id = "skillCounter";
    footer.appendChild(skillCount);
    updateTotalCounter();

    var pdfButton = document.createElement("button");
    pdfButton.className = "generateButton";
    pdfButton.textContent = "Generate PDF";
    pdfButton.addEventListener("click", (event) => {
        createPdf();
    });
    footer.appendChild(pdfButton);
}

function updateTotalCounter() {
    var counter = document.getElementById("skillCounter");
    if(counter){
        counter.innerText = "Skills: " + totalSkills + "/102";
        console.log(counter);
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