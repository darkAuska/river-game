const characters = [
  {
    id: "sato",
    name: "佐藤君",
    gender: "male",
    note: "可爱小学生"
  },
  {
    id: "lady",
    name: "邻家大姐姐",
    gender: "female",
    note: "单独和佐藤君在一起会出事"
  },
  {
    id: "ryu",
    name: "隆君",
    gender: "male",
    note: "单独和邻家大姐姐在一起会出事"
  },
  {
    id: "unicorn",
    name: "独角兽",
    gender: "female",
    note: "不能和男性单独相处"
  }
];

const state = {
  banks: {
    left: new Set(characters.map((c) => c.id)),
    right: new Set()
  },
  boatSide: "left",
  boat: []
};

const leftCharactersEl = document.getElementById("left-characters");
const rightCharactersEl = document.getElementById("right-characters");
const boatSlotsEl = document.getElementById("boat-slots");
const sailBtn = document.getElementById("sail-btn");
const resetBtn = document.getElementById("reset-btn");
const statusEl = document.getElementById("status");

function getCharacterById(id) {
  return characters.find((c) => c.id === id);
}

function renderCharacterCard(id) {
  const c = getCharacterById(id);
  const card = document.createElement("button");
  card.className = "character";
  card.type = "button";
  card.dataset.id = c.id;
  card.innerHTML = `
    <div class="avatar avatar-${c.id}"></div>
    <div class="info">
      <div class="title">${c.name}</div>
      <div class="meta">${c.note}</div>
    </div>
  `;
  return card;
}

function getCurrentBankSet() {
  return state.boatSide === "left" ? state.banks.left : state.banks.right;
}

function getOtherBankSet() {
  return state.boatSide === "left" ? state.banks.right : state.banks.left;
}

function moveToBoat(id) {
  const bank = getCurrentBankSet();
  if (!bank.has(id)) {
    return;
  }
  if (state.boat.length >= 2) {
    updateStatus("小船最多只能载 2 人。", true);
    return;
  }
  bank.delete(id);
  state.boat.push(id);
  postActionCheck();
}

function moveFromBoat(id) {
  const bank = getCurrentBankSet();
  state.boat = state.boat.filter((x) => x !== id);
  bank.add(id);
  postActionCheck();
}

function isFailure(peopleIds) {
  if (peopleIds.length !== 2) {
    return null;
  }
  const ids = new Set(peopleIds);

  if (ids.has("lady") && ids.has("sato")) {
    return "邻家大姐姐和佐藤君被单独留在一起，挑战失败。";
  }
  if (ids.has("lady") && ids.has("ryu")) {
    return "隆君和邻家大姐姐被单独留在一起，挑战失败。";
  }
  if (ids.has("unicorn")) {
    const otherId = peopleIds.find((id) => id !== "unicorn");
    const other = getCharacterById(otherId);
    if (other && other.gender === "male") {
      return "独角兽不能与男性单独相处，挑战失败。";
    }
  }
  return null;
}

function checkAllFailure() {
  const leftIds = [...state.banks.left];
  const rightIds = [...state.banks.right];
  const boatIds = [...state.boat];
  return isFailure(leftIds) || isFailure(rightIds) || isFailure(boatIds);
}

function checkWin() {
  return state.banks.right.size === characters.length && state.boat.length === 0;
}

function updateStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#b91c1c" : "#1f2937";
}

function render() {
  leftCharactersEl.innerHTML = "";
  rightCharactersEl.innerHTML = "";
  boatSlotsEl.querySelectorAll(".slot").forEach((slot) => {
    slot.innerHTML = "";
  });

  [...state.banks.left].forEach((id) => {
    leftCharactersEl.appendChild(renderCharacterCard(id));
  });
  [...state.banks.right].forEach((id) => {
    rightCharactersEl.appendChild(renderCharacterCard(id));
  });
  state.boat.forEach((id, index) => {
    const slot = boatSlotsEl.querySelector(`.slot[data-slot="${index}"]`);
    if (slot) {
      slot.appendChild(renderCharacterCard(id));
    }
  });

  const canSail = state.boat.length >= 2;
  sailBtn.disabled = !canSail;
  sailBtn.textContent = canSail
    ? `开船去${state.boatSide === "left" ? "右岸" : "左岸"}`
    : "开船过河（船上至少 2 人）";
}

function postActionCheck() {
  const failureMsg = checkAllFailure();
  render();

  if (failureMsg) {
    updateStatus(failureMsg, true);
    setTimeout(() => {
      alert(failureMsg);
      resetGame();
    }, 20);
    return;
  }

  if (checkWin()) {
    const msg = "恭喜！你已经把所有人安全送到右岸。";
    updateStatus(msg);
    setTimeout(() => {
      alert(msg);
    }, 20);
    return;
  }

  updateStatus(
    `当前船在${state.boatSide === "left" ? "左岸" : "右岸"}。点击角色可上下船。`
  );
}

function sail() {
  if (state.boat.length < 2) {
    updateStatus("船上至少要有 2 人才能开船。", true);
    return;
  }
  const targetBank = getOtherBankSet();
  state.boat.forEach((id) => targetBank.add(id));
  state.boat = [];
  state.boatSide = state.boatSide === "left" ? "right" : "left";
  postActionCheck();
}

function resetGame() {
  state.banks.left = new Set(characters.map((c) => c.id));
  state.banks.right = new Set();
  state.boat = [];
  state.boatSide = "left";
  render();
  updateStatus("点击角色将其上下船，满足条件后点击“开船过河”。");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest(".character");
  if (!target) {
    return;
  }
  const id = target.dataset.id;
  const inBoat = state.boat.includes(id);
  if (inBoat) {
    moveFromBoat(id);
    return;
  }
  moveToBoat(id);
});

sailBtn.addEventListener("click", sail);
resetBtn.addEventListener("click", resetGame);

render();
