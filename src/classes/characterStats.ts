import * as stats from '../data/stats.json';
import Stat from './stat'
export default class CharacterStats {
    stats: object = {
        Agility: Stat,
        Strength: Stat,
        Intelligence: Stat,
        Luck: Stat,
        Dexterity: Stat,
        Vitality: Stat
    };
    constructor() {
        stats.forEach((elem: string) => {
            this.stats[elem] = new Stat(elem, 1, 1);
        });
    }
}