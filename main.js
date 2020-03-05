'use strict';

const
  record = document.getElementById('record'),
  shot   = document.getElementById('shot'),
  hit    = document.getElementById('hit'),
  dead   = document.getElementById('dead'),
  enemy  = document.getElementById('enemy'),
  again  = document.getElementById('again'),
  header = document.querySelector('.header');

let trs = '';
for (let i = 0; i < 10; i++) {
  let tr = "<tr>";
  for (let j = 0; j < 10; j++) {
    tr += `<td id="${i}${j}"></td>`;
  }
  tr += "</tr>";
  trs += tr;
}

enemy.innerHTML = trs;

const game = {
  ships: [
    {
      location: ['26', '36', '46', '56'],
      hit: ['', '', '', '']
    },
    {
      location: ['11', '12', '13'],
      hit: ['', '','']
    },
    {
      location: ['69','79'],
      hit: ['','']
    },
    {
      location: ['32'],
      hit: ['']
    },
  ],
  shipCount: 4
};

const play = {
  record: localStorage.getItem('seaWarsRecord') || 0,
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
  dead(cell) {
    this.changeClass(cell, 'dead');
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
            show.dead(document.getElementById(cell));
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

  again.addEventListener('click', event => {
    location.reload();
  });
};

init();