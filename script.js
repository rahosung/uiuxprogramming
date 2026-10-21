// 파일이 실행되는지 확인하는 임시 로그입니다.
console.log("JavaScript가 연결되었습니다.");

// 1. 변하지 않는 값은 const로 저장합니다.
const panelTitle = "알림 설정";
const dailyGoal = 5;

// 2. 저장 전후로 바뀌는 상태는 let으로 저장합니다.
let isSaved = false;

// 자료형을 예상하고 typeof로 확인합니다.
console.log(typeof panelTitle); // "string"
console.log(typeof dailyGoal);  // "number"
console.log(typeof isSaved);    // "boolean"

// 3. JavaScript가 바꿀 요소를 id로 찾습니다.
const saveMessage = document.querySelector("#saveMessage");
const saveButton = document.querySelector("#saveButton");

// 4. 상태에 맞는 문구를 반환합니다.
function makeSaveMessage(saved) {
  if (saved === true) {
    return `하루 ${dailyGoal}개 학습 알림이 저장되었습니다.`;
  }
  return `매일 ${dailyGoal}개 단어 학습 알림을 저장해 주세요.`;
}

// 5. 클릭 순간 실행할 동작입니다.
function saveSettings() {
  isSaved = true;
  saveMessage.textContent = makeSaveMessage(isSaved);
  saveMessage.classList.add("is-saved");
  saveButton.textContent = "저장됨";
  saveButton.disabled = true;
}

// 6. click 이벤트와 함수를 연결합니다.
saveButton.addEventListener("click", saveSettings);

// ----- 6주차: 상호작용 연습 -----

const themeButton = document.querySelector("#themeButton");
const userNameInput = document.querySelector("#userName");
const userNameCount = document.querySelector("#userNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark
    ? "밝은 테마로 바꾸기"
    : "어두운 테마로 바꾸기";
}

function handleUserNameInput() {
  const currentLength = userNameInput.value.length;
  userNameCount.textContent = currentLength + " / 10";
}

function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "확인이 완료되었습니다. 단어 학습을 시작할 수 있습니다."
    : "안내를 확인하면 학습을 시작할 수 있습니다.";

  agreeMessage.classList.toggle("is-ready", agreed);
}

themeButton.addEventListener("click", handleThemeClick);
userNameInput.addEventListener("input", handleUserNameInput);
agreeCheck.addEventListener("change", handleAgreeChange);

// ----- 6주차: 주요 기능 탭 -----

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});

// ----- 7주차: 단어 학습 시작 흐름 -----

const studyFlow = document.querySelector("#studyFlow");
const studySteps = document.querySelectorAll(".study-step");
const studyProgress = document.querySelector("#studyProgress");
const studyName = document.querySelector("#studyName");
const studyDate = document.querySelector("#studyDate");
const studyCount = document.querySelector("#studyCount");
const studyError = document.querySelector("#studyError");
const reviewHelp = document.querySelector("#reviewHelp");
const studySummary = document.querySelector("#studySummary");
const stepNames = ["단어장 정보", "하루 학습량", "내용 확인"];

function showStudyStep(step) {
  studySteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });

  studyProgress.textContent = step <= 3
    ? `${step} / 3 · ${stepNames[step - 1]}`
    : "학습 시작 완료";
}

function clearStudyError() {
  studyError.textContent = "";
  studyName.classList.remove("has-error");
  studyDate.classList.remove("has-error");
}

// 기존 동의 조건은 그대로 두고, 시작 버튼에서 새 흐름으로 들어갑니다.
startButton.addEventListener("click", function () {
  studyFlow.hidden = false;
  showStudyStep(1);
  studyName.focus();
});

// 필수값이 비어 있으면 같은 단계에 머물며 고칠 방법을 알려 줍니다.
document.querySelector("#studyNext1").addEventListener("click", function () {
  const missingName = !studyName.value.trim();
  const missingDate = !studyDate.value;

  if (missingName || missingDate) {
    studyError.textContent = missingName
      ? "단어장 이름을 입력해 주세요."
      : "학습 시작일을 선택해 주세요.";

    studyName.classList.toggle("has-error", missingName);
    studyDate.classList.toggle("has-error", missingDate);
    (missingName ? studyName : studyDate).focus();
    return;
  }

  clearStudyError();
  showStudyStep(2);
});

studyCount.addEventListener("change", function () {
  reviewHelp.hidden = Number(studyCount.value) < 10;
});

document.querySelector("#studyBack2").addEventListener("click", function () {
  showStudyStep(1);
});

document.querySelector("#studyNext2").addEventListener("click", function () {
  studySummary.textContent =
    `${studyName.value.trim()} · ${studyDate.value} 시작 · 하루 ${studyCount.value}개`;
  showStudyStep(3);
});

document.querySelector("#studyBack3").addEventListener("click", function () {
  showStudyStep(2);
});

document.querySelector("#studyComplete").addEventListener("click", function () {
  addMyList({
    name: studyName.value.trim(),
    date: studyDate.value,
    count: studyCount.value
  });
  showStudyStep(4);
});

document.querySelector("#studyRestart").addEventListener("click", function () {
  studyName.value = "";
  studyDate.value = "";
  studyCount.value = "5";
  reviewHelp.hidden = true;
  studySummary.textContent = "";
  clearStudyError();
  showStudyStep(1);
  studyName.focus();
});

// ----- 중간고사: 내 단어장 목록 -----
// 7주차 흐름의 끝(학습 시작하기)에 연결됩니다. 완료할 때마다 목록에
// 추가되고, 목록에서 다시 열어 보거나 삭제(취소)할 수 있습니다.

const myListsEmpty = document.querySelector("#myListsEmpty");
const myListsContainer = document.querySelector("#myListsContainer");
const myListDetail = document.querySelector("#myListDetail");
const myListDetailText = document.querySelector("#myListDetailText");

let myLists = [];
let nextListId = 1;
let openDetailId = null;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 목록 상태(비어 있음 / 항목 있음)에 맞게 화면을 다시 그립니다.
function renderMyLists() {
  myListsEmpty.hidden = myLists.length > 0;
  myListsContainer.hidden = myLists.length === 0;

  myListsContainer.innerHTML = myLists.map(function (list) {
    return `
      <li class="my-list-item" data-id="${list.id}">
        <div class="my-list-info">
          <strong>${escapeHtml(list.name)}</strong>
          <span>${list.date} 시작 · 하루 ${list.count}개</span>
        </div>
        <div class="my-list-actions">
          <button type="button" class="secondary-button" data-action="open">열기</button>
          <button type="button" class="secondary-button" data-action="delete">삭제</button>
        </div>
      </li>
    `;
  }).join("");
}

function addMyList(entry) {
  myLists.push({
    id: nextListId,
    name: entry.name,
    date: entry.date,
    count: entry.count
  });
  nextListId += 1;
  renderMyLists();
}

// 목록 안의 열기·삭제 버튼은 나중에 생성되므로, 부모 요소에서
// 이벤트 위임(event delegation)으로 한 번에 처리합니다.
myListsContainer.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const item = button.closest(".my-list-item");
  const id = Number(item.dataset.id);
  const list = myLists.find(function (entry) {
    return entry.id === id;
  });

  if (button.dataset.action === "open") {
    openDetailId = id;
    myListDetailText.textContent =
      `${list.name} · ${list.date} 시작 · 하루 ${list.count}개`;
    myListDetail.hidden = false;
    return;
  }

  if (button.dataset.action === "delete") {
    myLists = myLists.filter(function (entry) {
      return entry.id !== id;
    });
    renderMyLists();

    // 삭제한 단어장을 상세 화면으로 보고 있었다면 상세 화면도 닫습니다.
    if (openDetailId === id) {
      myListDetail.hidden = true;
      openDetailId = null;
    }
  }
});

document.querySelector("#myListDetailClose").addEventListener("click", function () {
  myListDetail.hidden = true;
  openDetailId = null;
});
