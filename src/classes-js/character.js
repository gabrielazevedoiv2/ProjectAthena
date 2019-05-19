const statsJson = require('../data/stats.json');
module.exports = class Character {
    constructor(name, job, stats, position) {
        this.name = name;
        this.job = job;
        this.stats = statsJson.map((x) => {
            
        })
        this.position = position;
    }
}