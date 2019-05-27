const startFight = (playerInfo) => {
    const enemy = enemies.find((x) => enemies.indexOf(x) == Math.floor(Math.random()*enemies.length));
    const player = {...playerInfo};
    const playerFight = setInterval(() => {
        enemy.health -= player.equipment.weapon.skill(player.attack);
        if (enemy.health < 0) {
            clearInterval(playerFight);
            reloadFightButton();
        }
    }, 1000/player.speed);
    const enemyFight = setInterval(() => {
        player.health -= enemy.attack;
        if (player.health < 0) {
            clearInterval(enemyFight);
            reloadFightButton();
        }
    }, 1000/player.speed);
}

const reloadFightButton = () => {
    document.getElementById('modalFight').style.display = 'flex';
}

window.onload = () => {
    var player = {
        health: 100,
        attack: 10,
        defense: 10,
        speed: 1,
        equipment: {
            weapon: weapons[0],
            armor: armors[0],
            acc: accessories[0]
        }
    }

    document.getElementById('startFight').onclick = (e) => {
        document.getElementById('modalFight').style.display = 'none';
        startFight(player);
    }
}