var weapons = [{
    name: 'bare hand',
    attack: 1,
    skill: function(attack) {
        return this.attack + attack;
    }
}];

var armors = [{
    name: 'tunic',
    defense: 1
}];

var accessories = [{
    name: 'wooden ring',
}];