class Tab {
    constructor(tab_name) {
        this._tab_name = tab_name;
        this._active_skills = new Object();
    }

    get tab_name(){
        return this._tab_name;
    }

    getActiveSkills(){
        return active_skills;
    }
    
    setSkill(id, skill){
        active_skills[id] = skill;
    }
}

class Skill {
    constructor(skill_name, stat, default_count, has_entry, source, enabled){
        this._skill_name = skill_name != "" ? skill_name : "<blank>";
        this._stat = stat;
        this._has_entry = has_entry;
        this._source = source;
        this._enabled = enabled.replace(/(\r\n|\n|\r)/gm, "");
        this._count = parseInt(default_count);
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