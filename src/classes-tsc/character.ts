import Job from "./job";
import CharacterStats from "./characterStats";
import Coordinates2d from "./coordinates2d";

export default class Character {
    name: string;
    job: Job;
    stats: CharacterStats;
    worldPos: Coordinates2d;
    constructor(name: string, job: Job, stats: CharacterStats, worldPos: Coordinates2d) {
        this.name = name;
        this.job = job;
        this.stats = stats;
        this.worldPos = worldPos;
    }
}