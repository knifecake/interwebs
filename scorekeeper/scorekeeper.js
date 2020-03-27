let focusedElement;

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

const processInput = (e) => {
  const input = e.target.value;
  if (input.length > 0) { 
    if (input[0] == '+' || input[0] == '-') {
      const player = e.target.parentNode.querySelector('input[type="text"]').value;
      const scores = JSON.parse(localStorage.getItem('scores') || "[]");
      const prev = scores.find(s => s.key == player);
      if (prev !== undefined && input != prev.val) {
        const curr = +prev.val + +input;
        if (!isNaN(curr)) {
          e.target.value = curr;
        }
      }
    }
  } else {
    e.target.value = 0;
  }

  saveScores();
}

const addPlayer = (name, score, focus = false) => {
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

  if (focus)
    name_field.focus();
}

const removePlayer = e => {
  e.target.parentNode.remove();
  saveScores();
}

const bindPlayerEvents = li => {
  li.querySelector('button')
    .addEventListener('click', removePlayer);

  li.querySelectorAll('input[type="text"]')
    .forEach(i => i.addEventListener('blur', saveScores));

  li.querySelectorAll('input[type="tel"]')
    .forEach(i => i.addEventListener('blur', processInput));

  li.querySelectorAll('input')
    .forEach(i => {
      // blur when pressing enter
      i.addEventListener('keypress', e => {
        if (e.key == "Enter") {
          i.blur();
        }
      });

      // select text when input is focused
      i.addEventListener('focus', e => {
        if (focusedElement == i) return;

        focusedElement = i;
        setTimeout(() => i.select(), 0);
      });
    });
}

document
  .getElementById('add-player')
  .addEventListener('click', _ => addPlayer('New player', 0, true));

restoreScores();
