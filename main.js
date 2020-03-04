'use strict';

const
  record = document.getElementById('record'),
  shot   = document.getElementById('shot'),
  hit    = document.getElementById('hit'),
  dead   = document.getElementById('dead'),
  enemy  = document.getElementById('enemy'),
  again  = document.getElementById('again');

const play = {
  record: 0,
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
  hit() {

  },
  miss(cell) {
    this.changeClass(cell, 'miss');
  },
  dead() {

  },
  changeClass(cell, className) {
    cell.className = className;
  }
};

const fire = event => {
  const {target} = event;
  if (!target.className) {
    show.miss(target);
    play.updateData = 'shot';
  }
};

const init = () => {
  enemy.addEventListener('click', fire);
};

init();