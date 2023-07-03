//Setups the UI on page load
window.addEventListener("load", setupUI);

async function setupUI(){
    //Waits for all tabs to be loaded
    await returnTabs().then((tabs) => {
        //Creates empty container for all the tabs and appends it to the body
        var tabDiv = document.createElement("div");
        tabDiv.className = "tab_div";
        document.body.appendChild(tabDiv);

        //Is is the first tab, for setting default open tab
        var firstTab = true;
        
        //Creates a "Grid" for aligning the skills of the tabs
        var grid;

        //Loops through each tab
        Object.keys(tabs).forEach(async tabString => {
            var tab = tabs[tabString];

            //Get all the skills of the tab and loops through them
            let skills = await tab.getSkills();
            skills.forEach(skillObject => {
                var stat_name = skillObject.stat.toUpperCase();
                var stat_tab = document.getElementById(stat_name);

                //If no div exists for the specific tab, create one
                if(!stat_tab){
                    stat_tab = document.createElement("div");
                    stat_tab.id = stat_name;
                    stat_tab.className = "stat_content";
                    document.body.appendChild(stat_tab);

                    //Creates the button for the tab and adds to the tab div
                    var tab_button = document.createElement("button");
                    tab_button.className = "tab_links";
                    tab_button.setAttribute("onclick", "openTab(event, \"" + stat_name + "\")");
                    tab_button.innerText = stat_name;
                    tabDiv.appendChild(tab_button);

                    //Sets the default tab
                    if(firstTab){
                        tab_button.click();
                        firstTab = false;
                    }

                    //Creates the "Grid" and adds it to the tab
                    grid = document.createElement("div")
                    grid.id = "grid_" + stat_name;
                    grid.className = "tabGrid";

                    stat_tab.appendChild(grid);
                }
                //Gets the grid(incase tab already existed)
                grid = document.getElementById("grid_" + stat_name);

                //Creates container for the skill
                var skill_name = skillObject.skill_name == "" ? "<blank>" : skillObject.skill_name
                var skillDiv = document.createElement("div");
                skillDiv.id = skill_name;
                skillDiv.className = "skillDiv";

                //Creates a checkbox for enabled/disabling a skill
                var skillId = skill_name + skillObject.source
                var checkbox = document.createElement("input");
                checkbox.id = skillId + "_checkbox"
                checkbox.type = "checkbox";
                checkbox.className = "should_enable";
                checkbox.checked = skillObject.enabled;
                checkbox.addEventListener('change', (event) => {
                    //Changes the enabled state of the skill and updates the total skill counter
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

                //Adds the checkbox to the skill div
                skillDiv.append(checkbox);

                //If more than 1 skill can exist, adds a number type input to the skill div
                if(skillObject.count > 0){
                    var spinBox = document.createElement("input");
                    spinBox.type = "number";
                    spinBox.min = "1";
                    spinBox.max = "99";
                    spinBox.step = "1";
                    spinBox.value = skillObject.count;
                    
                    spinBox.setAttribute("style", "width: 30px");
                    //Changes skill count on change
                    spinBox.addEventListener("change", (event) => {
                        skillObject.updateCount(parseInt(event.target.value));
                        updateTotalCounter();
                    });
                    skillDiv.appendChild(spinBox);
                }

                //Creates appropriate labels for the skill
                var nameLabel = document.createElement("label");
                nameLabel.innerText = "\u2002" + skillDiv.id;
                nameLabel.htmlFor = checkbox.id;

                skillDiv.append(nameLabel);

                var sourceLabel = document.createElement("label");
                sourceLabel.innerText = "\u2003[" + skillObject.source.replace(/(\r\n|\n|\r)/gm, "") + "]";
                sourceLabel.htmlFor = checkbox.id;

                skillDiv.append(sourceLabel);
                grid.appendChild(skillDiv);
                //Add the stat tab to the body
                document.body.appendChild(stat_tab);
            });
        });
    });

    //Creates the footer
    var footer = document.createElement("div");
    footer.className = "footer";
    document.body.appendChild(footer);

    //Creates and sets the total skill counter
    var skillCount = document.createElement("p");
    skillCount.innerText = "Skills: " + totalSkills + "/102";
    skillCount.id = "skillCounter";
    footer.appendChild(skillCount);
    updateTotalCounter();

    //Creates the generate PDF button
    var pdfButton = document.createElement("button");
    pdfButton.className = "generateButton";
    pdfButton.textContent = "Generate PDF";
    //Generates a PDF on button click
    pdfButton.addEventListener("click", (event) => {
        createPdf();
    });
    footer.appendChild(pdfButton);
}

function updateTotalCounter() {
    //Gets the skill counter UI object and sets the text to correct value
    var counter = document.getElementById("skillCounter");
    if(counter){
        counter.innerText = "Skills: " + totalSkills + "/102";
    }
}

//Make the correct tab visible
function openTab(evt, tabName) {
    var i, statcontent, tablinks;
  
    //Gets the tabs and hide them all
    statcontent = document.getElementsByClassName("stat_content");
    for (i = 0; i < statcontent.length; i++) {
      statcontent[i].style.display = "none";
    }

    //Grays out all tabs
    tablinks = document.getElementsByClassName("tab_links");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    //Set the correct tab as active
    document.getElementById(tabName).style.display = "block";
    //Sets the tab button as active
    evt.currentTarget.className += " active";
}