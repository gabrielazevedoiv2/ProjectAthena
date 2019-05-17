import Character from './character';
class User {
    name: string;
    character: Character;
    constructor(name: string, character: Character) {
        this.name = name;
        this.character = character;
    }
}