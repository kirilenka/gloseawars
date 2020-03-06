'use strict';

const
  SHIP_COUNT = 10,
  SCREEN_SIZE = 10;

const
  record = document.getElementById('record'),
  shot   = document.getElementById('shot'),
  hit    = document.getElementById('hit'),
  dead   = document.getElementById('dead'),
  enemy  = document.getElementById('enemy'),
  again  = document.getElementById('again'),
  header = document.querySelector('.header');

let trs = '';
for (let i = 0; i < SCREEN_SIZE; i++) {
  let tr = "<tr>";
  for (let j = 0; j < SCREEN_SIZE; j++) {
    tr += `<td id="${i}${j}"></td>`;
  }
  tr += "</tr>";
  trs += tr;
}

enemy.innerHTML = trs;

const game = {
  ships: [],
  shipCount: 0,
  options: {
    count: [1, 2, 3, 4],
    size: [4, 3, 2, 1]
  },
  collision: new Set(),
  createShip(shipSize) {
    const ship = {
      hit: [],
      location: [],
    };

    const direction = (Math.random()) < 0.5;

    let x,y;

    if (direction) {

      x = Math.floor(Math.random() * SCREEN_SIZE);
      y = Math.floor(Math.random() * (SCREEN_SIZE - shipSize));
      
    } else {

      x = Math.floor(Math.random() * (SCREEN_SIZE - shipSize));
      y = Math.floor(Math.random() * SCREEN_SIZE);
      
    }

    for (let i = 0; i < shipSize; i++) {
      if (direction) {
        ship.location.push(x+''+(y+i));
      } else {
        ship.location.push((x+i)+''+y);
      }
      ship.hit.push('');
    }

    if (this.checkCollision(ship.location)) {
      return this.createShip(shipSize);
    }

    this.addCollision(ship.location);

    return ship;
  },
  checkCollision(location) {
    for (const coord of location) {
      if (this.collision.has(coord)) {
        return true;
      }
    }
  },
  addCollision(location) {
    for (let i = 0; i < location.length; i++) {
      const startCoordX = location[i][0] - 1;
      const startCoordY = location[i][1] - 1;
      for (let j = startCoordX; j < startCoordX + 3; j++) {
        for (let z = startCoordY; z < startCoordY + 3; z++) {
          if (j >= 0 && j < SCREEN_SIZE && z >= 0 && z < SCREEN_SIZE) {
            const coord = j + '' + z;

            this.collision.add(coord);
          }
        }
      }
    }
  },
  generate() {
    for (let i = 0; i<this.options.count.length; i++) {
      for (let j=0; j<this.options.count[i]; j++) {
        const size =  this.options.size[i];
        const ship = this.createShip(size);
        this.ships.push(ship);
        this.shipCount++;
        
      }
    }
  }
};

const play = {
  record: parseInt(localStorage.getItem('seaWarsRecord') || 0),
  shot: 0,
  hit: 0,
  dead: 0,

  get updateData() {
    return `record: ${record}, shot: ${shot}, hit: ${hit}, dead: ${dead}`;
  },

  set updateData(data) {
    this[data]++;
    this.render();
  },

  render() {
    record.textContent = this.record;
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  }
};

const show = {
  hit(cell) {
    this.changeClass(cell, 'hit');
  },
  miss(cell) {
    this.changeClass(cell, 'miss');
  },
  dead(cell, ship) {
    this.changeClass(cell, 'dead');

    const location = ship.location[0];

    for (const coords of ship.location) {
      const startCoordX = coords[0] - 1;
      const startCoordY = coords[1] - 1;
      for (let j = startCoordX; j < startCoordX + 3; j++) {
        for (let z = startCoordY; z < startCoordY + 3; z++) {
          if (j >= 0 && j < SHIP_COUNT && z >= 0 && z < SHIP_COUNT) {
            const coord = j + '' + z;

            if (!document.getElementById(coord).className) {
              document.getElementById(coord).className = 'miss';
            }
          }
        }
      }
    }

  },
  changeClass(cell, className) {
    cell.className = className;
  }
};

const fire = event => {
  const {target} = event;
  if (target.tagName === 'TD' && !target.className && game.shipCount >0) {
    show.miss(target);
    play.updateData = 'shot';

    for (let i = 0; i<game.ships.length; i++) {
      const ship = game.ships[i];
      const index = ship.location.indexOf(target.id);

      if (index >= 0) {
        show.hit(target);
        play.updateData = 'hit';
        ship.hit[index] = 'x';
        const life = ship.hit.indexOf('');
        if (life < 0) {
          play.updateData = 'dead';
          for (const cell of ship.location) {
            show.dead(document.getElementById(cell), ship);
          }
          game.shipCount--;

          if (game.shipCount < 1) {
            header.textContent = 'Game Over';
            header.style.color = 'red';
            if (play.shot < play.record || play.record === 0) {
              localStorage.setItem('seaWarsRecord', play.shot);
              play.record = play.shot;
              play.render();
            }
          }
        }
      }
    }
  }
};

const init = () => {
  enemy.addEventListener('click', fire);
  play.render();
  game.generate();

  again.addEventListener('click', event => {
    play.shot = 0;
    play.hit = 0;
    play.dead = 0;
    game.ships = [];
    game.shipCount = 0;
    game.collision = new Set();
    for (const row of enemy.rows) {
      for (const cell of row.cells) {
        cell.className = '';
      }
    }

    header.textContent = 'Sea Wars';
    header.style.color = 'black';
    play.render();
    game.generate();
  });

  record.addEventListener('dblclick', event => {
    localStorage.setItem('seaWarsRecord', 0);
    play.record = 0;
    play.render();
  });
};

init();