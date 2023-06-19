const tabs = Object();

async function setupSkills(){
    this.tabs = parseCSV("./cp2020/skills.csv").then((lines) => {
        const tempTabs = Object();
        for(var i = 1; i < lines.length; i++){
            let skillRow = lines[i].replace(/(\r\n|\n|\r)/gm, "").split(",");
            let skill = new Skill(skillRow);
            let tab = tempTabs[skill.stat]
            if(tab == null){
                tab = new Tab(skill.stat);
                tempTabs[skill.stat] = tab;
            }
            tab.addSkill(skill);
        }
        Object.keys(tempTabs).forEach(tab => {
            tempTabs[tab].sort();
        });

        return tempTabs;
    });

    return this.tabs;
}


class Tab {

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

    addSkill(skill){
        let id = this._skills.length;
        this._skills[id] = skill
        return id;
    }

    sort() {
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
    constructor(skill_name, stat, default_count, has_entry, source, enabled){
        if(typeof(skill_name) == String){
            this._skill_name = skill_name;
            this._stat = stat;
            this._has_entry = has_entry;
            this._source = source;
            this._enabled = enabled;
            this._count = parseInt(default_count);
        }else{
            let array = skill_name;

            this._skill_name = array[0];
            this._stat = array[1].toUpperCase();
            this._has_entry = array[3];
            this._source = array[4];
            this._enabled = array[5];
            this._count = parseInt(array[4]);
        }
    }

    removeCount(count) {
        this._count -= parseInt(count);

        if(this._count <= 1){
            this.count = 1;
        }
    }

    addCount(count){
        this._count += parseInt(count);
    }

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