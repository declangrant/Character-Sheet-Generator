//Stores all tabs
var tabStorage = Object();

//Keeps track of total number of skills
var totalSkills = 0;

async function returnTabs(){
    //Returns or creates line of tabs
    if(Object.keys(this.tabStorage).length > 0){
        return this.tabStorage;
    } else {
        await setupSkills("./cp2020/skills.csv");
        return this.tabStorage;
    }
}

async function setupSkills(url){
    //Gets parsed CSV
    this.tabStorage = parseCSV(url).then((lines) => {
        //Temporary tab storage for editing locally
        const temptabStorage = Object();
        //Loops through each line in the CSV file
        for(var i = 1; i < lines.length; i++){
            //Cleans up the line and create a skill from it
            let skillRow = lines[i].replace(/(\r\n|\n|\r)/gm, "").split(",");
            let skill = new Skill(skillRow);
            let tab = temptabStorage[skill.stat]
            //if tab doesn't exist, create it
            if(tab == null){
                tab = new Tab(skill.stat);
                temptabStorage[skill.stat] = tab;
            }
            //if skill is enabled, add it to the skill counter
            if(skill.enabled) totalSkills += Math.max(skill.count, 1);
            
            //Add the skill to the tab
            tab.addSkill(skill);
        }
        //Sort tabs by skill name
        Object.keys(temptabStorage).forEach(tab => {
            temptabStorage[tab].sort();
        });

        //Return the tab storage for updating
        return temptabStorage;
    });
}


class Tab {
    //Creates a new tab object from its name
    constructor(tab_name) {
        this._tab_name = tab_name;
        this._skills = [];
    }

    get tab_name(){
        return this._tab_name;
    }

    getSkills() {
        return this._skills;
    }
    
    updateSkill(id, skill){
        this._skills[id] = skill;
    }

    //Add skill to the tab
    addSkill(skill){
        let id = this._skills.length;
        this._skills[id] = skill
        return id;
    }

    //Sort tags by skill name
    sort() {
        //Return of 1 means a first, -1 is b first, 0 is no change
        this._skills.sort(function(a, b) {
            if((a.skill_name == "" || a.skill_name == "Other")){
                return 1;
            }else if((b.skill_name == "" || b.skill_name == "Other")){
                return -1;
            } else if(a.skill_name < b.skill_name){
                return -1;
            }
            else if(a.skill_name > b.skill_name){
                return 1;
            }
            return 0;
        })
    }
}


class Skill {
    //Creates a new skill object from CSV file row
    constructor(line){
        this._skill_name = line[0];
        this._stat = line[1].toUpperCase();
        this._has_entry = line[3].toUpperCase() == "TRUE";
        this._source = line[4];
        this._enabled = line[5].toUpperCase() == "TRUE";
        this._count = parseInt(line[2]);
    }

    //Remove quanity of a skill
    removeCount(count) {
        this._count -= parseInt(count);

        if(this._count <= 1){
            this.count = 1;
        }
    }

    //Add quanity of a skill
    addCount(count){
        this._count += parseInt(count);
    }

    //Directly setting the count of a skill
    updateCount(count){
        var value = parseInt(count)

        if(this._enabled){
            totalSkills -= this._count;
            totalSkills += value;
        }
        this._count = value;
    }

    //Getters and setters for properties of the skill
    get count(){
        return this._count;
    }

    set count(value){
        this._count = parseInt(value)
    }

    get skill_name(){
        return this._skill_name;
    }

    set skill_name(value){
        this._skill_name = value;
    }

    get stat(){
        return this._stat;
    }

    set stat(value){
        this._stat = value;
    }

    get has_entry(){
        return this._has_entry;
    }

    set has_entry(value){
        this._has_entry = value;
    }

    get enabled(){
        return this._enabled;
    }

    set enabled(value){
        this._enabled = value;
    }

    get source(){
        return this._source;
    }

    set source(value){
        this._source = value;
    }
}