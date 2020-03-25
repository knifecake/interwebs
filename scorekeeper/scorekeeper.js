const saveScores = () => {
  const items = document.querySelectorAll('#scoreboard li');
  let scores = [];
  items.forEach(i => {
    const key = i.querySelector('input[type="text"]').value;
    const val = i.querySelector('input[type="tel"]').value;

    scores.push({ key, val });
  });

  localStorage.setItem('scores', JSON.stringify(scores));
};

const restoreScores = () => {
  const scores = JSON.parse(localStorage.getItem('scores'));

  if (scores !== null) {

    document.getElementById('scoreboard').textContent = '';
    scores.forEach(s => addPlayer(s.key, s.val));
  }

  document
    .querySelectorAll('#scoreboard li')
    .forEach(bindPlayerEvents);
}

const addPlayer = (name, score) => {
  const list = document.getElementById('scoreboard');
  const li = document.createElement('li');
  const cross = document.createElement('button');
  const name_field = document.createElement('input');
  const score_field = document.createElement('input');
  name_field.setAttribute('type', 'text');
  name_field.setAttribute('value', name);
  score_field.setAttribute('type', 'tel');
  score_field.setAttribute('value', score);
  cross.appendChild(document.createTextNode('\u00D7')); // times symbol
  li.appendChild(cross);
  li.appendChild(name_field);
  li.appendChild(score_field);
  list.appendChild(li);

  bindPlayerEvents(li);
}

const removePlayer = e => {
  e.target.parentNode.remove();
  saveScores();
}

const bindPlayerEvents = li => {
  li.querySelector('button')
    .addEventListener('click', removePlayer);

  li.querySelectorAll('input')
    .forEach(i => i.addEventListener('blur', saveScores));
}


document
  .getElementById('add-player')
  .addEventListener('click', _ => addPlayer('New player', 0));

restoreScores();
