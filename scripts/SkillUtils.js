var tabStorage = Object();

async function returnTabs(){
    if(Object.keys(this.tabStorage).length > 0){
        return this.tabStorage;
    } else {
        return await setupSkills("./cp2020/skills.csv");
    }
}

async function setupSkills(url){
    this.tabStorage = parseCSV(url).then((lines) => {
        const temptabStorage = Object();
        for(var i = 1; i < lines.length; i++){
            let skillRow = lines[i].replace(/(\r\n|\n|\r)/gm, "").split(",");
            let skill = new Skill(skillRow);
            let tab = temptabStorage[skill.stat]
            if(tab == null){
                tab = new Tab(skill.stat);
                temptabStorage[skill.stat] = tab;
            }
            tab.addSkill(skill);
        }
        Object.keys(temptabStorage).forEach(tab => {
            temptabStorage[tab].sort();
        });

        return temptabStorage;
    });

    return this.tabStorage;
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
            this._has_entry = has_entry.toUpperCase() == "TRUE";
            this._source = source;
            this._enabled = enabled.toUpperCase() == "TRUE";
            this._count = parseInt(default_count);
        }else{
            let array = skill_name;

            this._skill_name = array[0];
            this._stat = array[1].toUpperCase();
            this._has_entry = array[3].toUpperCase() == "TRUE";
            this._source = array[4];
            this._enabled = array[5].toUpperCase() == "TRUE";
            this._count = parseInt(array[2]);
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