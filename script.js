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
const studyForm = document.querySelector("#studyForm");
const studyName = document.querySelector("#studyName");
const studyNameField = document.querySelector("#studyNameField");
const studyNameHelp = document.querySelector("#studyNameHelp");
const studyNameCount = document.querySelector("#studyNameCount");
const studyDate = document.querySelector("#studyDate");
const studyCount = document.querySelector("#studyCount");
const studyError = document.querySelector("#studyError");
const reviewHelp = document.querySelector("#reviewHelp");
const studySummary = document.querySelector("#studySummary");
const studySubmitStatus = document.querySelector("#studySubmitStatus");
const studyComplete = document.querySelector("#studyComplete");
const stepNames = ["단어장 정보", "하루 학습량", "내용 확인"];

let currentStep = 1;

// 단계가 바뀌면 그 단계의 제목으로 초점을 옮겨, 화면 낭독기도 위치를 알 수 있게 합니다.
function showStudyStep(step) {
  currentStep = step;

  studySteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });

  studyProgress.textContent = step <= 3
    ? `${step} / 3 · ${stepNames[step - 1]}`
    : "학습 시작 완료";

  const heading = document.querySelector(`.study-step[data-step="${step}"] h3`);
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

// ----- 9주차: 단어장 이름 입력 경험 -----
// 입력 전에는 조건을 안내하고, 입력 중에는 글자 수와 조건 충족 여부를 바로 보여 줍니다.
function updateStudyNameExperience() {
  const length = studyName.value.length;
  const enough = studyName.value.trim().length >= 2;
  const invalid = studyName.getAttribute("aria-invalid") === "true";

  studyNameCount.textContent = `${length} / 20자`;
  studyNameField.classList.toggle("is-valid", enough && !invalid);

  if (!invalid) {
    studyNameHelp.textContent = enough
      ? "입력 조건을 충족했습니다."
      : "다른 단어장과 구분되도록 2자 이상 입력해 주세요.";
  }
}

function showStudyNameError(message) {
  studyName.setAttribute("aria-invalid", "true");
  studyError.textContent = message;
  studyNameField.classList.remove("is-valid");
  studyNameField.classList.add("has-error");
  studyName.classList.add("has-error");
  return false;
}

function clearStudyNameError() {
  studyName.removeAttribute("aria-invalid");
  studyNameField.classList.remove("has-error");
  studyName.classList.remove("has-error");
  updateStudyNameExperience();
}

function validateStudyName() {
  const name = studyName.value.trim();

  if (!name) {
    return showStudyNameError("단어장 이름을 입력해 주세요.");
  }

  if (name.length < 2) {
    return showStudyNameError("단어장 이름을 2자 이상 입력해 주세요.");
  }

  clearStudyNameError();
  return true;
}

// 오류가 확인된 뒤부터는 고칠 때마다 바로 다시 검사합니다.
studyName.addEventListener("input", function () {
  updateStudyNameExperience();

  if (studyName.getAttribute("aria-invalid") === "true") {
    validateStudyName();
  }
});

function clearStudyError() {
  clearStudyNameError();
  studyDate.classList.remove("has-error");
  studyError.textContent = "";
}

// 기존 동의 조건은 그대로 두고, 시작 버튼에서 새 흐름으로 들어갑니다.
startButton.addEventListener("click", function () {
  studyFlow.hidden = false;
  showStudyStep(1);
  studyName.focus();
});

// 필수값이 비어 있으면 같은 단계에 머물며 고칠 방법을 알려 줍니다.
document.querySelector("#studyNext1").addEventListener("click", function () {
  if (!validateStudyName()) {
    studyName.focus();
    return;
  }

  if (!studyDate.value) {
    studyError.textContent = "학습 시작일을 선택해 주세요.";
    studyDate.classList.add("has-error");
    studyDate.focus();
    return;
  }

  studyError.textContent = "";
  studyDate.classList.remove("has-error");
  showStudyStep(2);
});

studyCount.addEventListener("change", function () {
  reviewHelp.hidden = Number(studyCount.value) < 10;
});

// ----- 9주차: 선택에 따라 열리는 조건부 입력(복습 알림 시간대) -----
const studyReminderOption = document.querySelector("#studyReminderOption");
const studyReminderOptions = document.querySelector("#studyReminderOptions");
const studyReminderTimeInputs = [
  ...document.querySelectorAll('input[name="reminder-time"]')
];

function syncStudyReminderFields() {
  const open = studyReminderOption.checked;
  studyReminderOption.setAttribute("aria-expanded", String(open));
  studyReminderOptions.hidden = !open;
  studyReminderTimeInputs.forEach(function (input) {
    input.disabled = !open;
  });
}

function studyReminderTimeLabel() {
  const checked = studyReminderTimeInputs.find(function (input) {
    return input.checked;
  });
  return checked ? checked.value : "";
}

studyReminderOption.addEventListener("change", syncStudyReminderFields);
syncStudyReminderFields();

document.querySelector("#studyBack2").addEventListener("click", function () {
  showStudyStep(1);
});

document.querySelector("#studyNext2").addEventListener("click", function () {
  const reminderText = studyReminderOption.checked
    ? ` · 알림 ${studyReminderTimeLabel()} 받기`
    : "";

  studySummary.textContent =
    `${studyName.value.trim()} · ${studyDate.value} 시작 · 하루 ${studyCount.value}개${reminderText}`;
  showStudyStep(3);
});

document.querySelector("#studyBack3").addEventListener("click", function () {
  showStudyStep(2);
});

// ----- 9주차: 제출 상태(저장 중·완료·실패)와 다시 시도 -----
// 주소에 ?list-error=1을 붙이면 저장 실패 상황을 테스트할 수 있습니다.
const forceStudySaveFailure = new URLSearchParams(location.search).has("list-error");

function setStudySubmitState(loading, message) {
  studyForm.setAttribute("aria-busy", String(loading));
  studyComplete.disabled = loading;
  studyComplete.textContent = loading ? "저장하는 중…" : "학습 시작하기";
  studySubmitStatus.textContent = message;
}

function wait(milliseconds) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, milliseconds);
  });
}

async function persistStudyEntry(entry) {
  await wait(500);

  if (forceStudySaveFailure) {
    throw new Error("수업용 저장 실패");
  }

  addMyList(entry);
}

// 1·2단계에서 Enter를 눌러도 같은 다음 단계 검사가 실행되도록 submit을 가로챕니다.
studyForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (currentStep === 1) {
    document.querySelector("#studyNext1").click();
    return;
  }

  if (currentStep === 2) {
    document.querySelector("#studyNext2").click();
    return;
  }

  if (currentStep !== 3) {
    return;
  }

  if (!validateStudyName()) {
    showStudyStep(1);
    window.requestAnimationFrame(function () {
      studyName.focus();
    });
    return;
  }

  const entry = {
    name: studyName.value.trim(),
    date: studyDate.value,
    count: studyCount.value,
    reminder: studyReminderOption.checked ? studyReminderTimeLabel() : ""
  };

  setStudySubmitState(true, "단어장을 저장하고 있습니다.");

  try {
    await persistStudyEntry(entry);
    setStudySubmitState(false, "단어장을 저장했습니다.");
    document.querySelector("#completeMessage").textContent =
      `'${entry.name}' 단어장이 만들어졌습니다. 내 단어장 목록에서 다시 열어볼 수 있습니다.`;
    showStudyStep(4);
  } catch {
    setStudySubmitState(
      false,
      "저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요."
    );
  }
});

document.querySelector("#studyRestart").addEventListener("click", function () {
  studyForm.reset();
  syncStudyReminderFields();

  reviewHelp.hidden = true;
  studySummary.textContent = "";
  clearStudyError();
  setStudySubmitState(false, "");

  showStudyStep(1);
  studyName.focus();
});

// ----- 중간고사: 내 단어장 목록 -----
// 7주차 흐름의 끝(학습 시작하기)에 연결됩니다. 완료할 때마다 목록에
// 추가되고, 목록에서 다시 열어 보거나 삭제(취소)할 수 있습니다.

const myListsEmpty = document.querySelector("#myListsEmpty");
const myListsEmptyText = document.querySelector("#myListsEmptyText");
const myListsEmptyAction = document.querySelector("#myListsEmptyAction");
const myListStatus = document.querySelector("#myListStatus");
const myListsContainer = document.querySelector("#myListsContainer");
const myListDetail = document.querySelector("#myListDetail");
const myListDetailText = document.querySelector("#myListDetailText");

let myLists = [];
let nextListId = 1;
let openDetailId = null;

// ----- 10주차: 알림 설정 여부로 목록 범위 좁히기 -----
const myListFilterButtons = document.querySelectorAll(".my-list-filter");
let currentListFilter = "all";

function getVisibleMyLists() {
  return myLists.filter(function (list) {
    if (currentListFilter === "reminder") return !!list.reminder;
    if (currentListFilter === "none") return !list.reminder;
    return true;
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 목록 상태(비어 있음 / 항목 있음 / 필터 결과 없음)에 맞게 화면을 다시 그립니다.
function renderMyLists() {
  const visibleLists = getVisibleMyLists();
  const trulyEmpty = myLists.length === 0;

  myListsEmpty.hidden = visibleLists.length !== 0;
  myListsContainer.hidden = visibleLists.length === 0;

  if (visibleLists.length === 0) {
    myListsEmptyText.textContent = trulyEmpty
      ? "아직 만든 단어장이 없습니다. 학습을 시작하면 여기에 추가됩니다."
      : "선택한 조건에 맞는 단어장이 없습니다. 다른 조건을 선택해 보세요.";
    myListsEmptyAction.textContent = trulyEmpty ? "학습 시작하러 가기" : "전체 보기";
    myListsEmptyAction.href = trulyEmpty ? "#interaction-practice" : "#myLists";
  }

  myListsContainer.innerHTML = visibleLists.map(function (list) {
    const reminderText = list.reminder ? ` · 알림 ${list.reminder} 받기` : "";

    return `
      <li class="my-list-item" data-id="${list.id}">
        <div class="my-list-info">
          <strong>${escapeHtml(list.name)}</strong>
          <span>${list.date} 시작 · 하루 ${list.count}개${escapeHtml(reminderText)}</span>
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
    count: entry.count,
    reminder: entry.reminder || ""
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
    const reminderText = list.reminder ? ` · 알림 ${list.reminder} 받기` : "";

    openDetailId = id;
    myListDetailText.textContent =
      `${list.name} · ${list.date} 시작 · 하루 ${list.count}개${reminderText}`;
    myListDetail.hidden = false;
    return;
  }

  if (button.dataset.action === "delete") {
    const itemsBeforeDelete = [...myListsContainer.querySelectorAll(".my-list-item")];
    const deletedIndex = itemsBeforeDelete.findIndex(function (el) {
      return Number(el.dataset.id) === id;
    });

    myLists = myLists.filter(function (entry) {
      return entry.id !== id;
    });
    renderMyLists();

    // 삭제한 단어장을 상세 화면으로 보고 있었다면 상세 화면도 닫습니다.
    if (openDetailId === id) {
      myListDetail.hidden = true;
      openDetailId = null;
    }

    // 삭제 후에도 초점을 잃지 않도록, 같은 자리의 다음 항목이나 선택된 필터로 옮겨 줍니다.
    const itemsAfterDelete = [...myListsContainer.querySelectorAll(".my-list-item")];
    const nextItem = itemsAfterDelete[deletedIndex] || itemsAfterDelete[deletedIndex - 1];
    const nextButton = nextItem ? nextItem.querySelector('button[data-action="delete"]') : null;
    const selectedFilter = document.querySelector('.my-list-filter[aria-pressed="true"]');
    (nextButton || selectedFilter)?.focus();
  }
});

document.querySelector("#myListDetailClose").addEventListener("click", function () {
  myListDetail.hidden = true;
  openDetailId = null;
});

myListFilterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentListFilter = button.dataset.filter;

    myListFilterButtons.forEach(function (item) {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    renderMyLists();

    const count = getVisibleMyLists().length;
    const filterName = button.textContent.trim();
    myListStatus.textContent = count > 0
      ? `${filterName} 단어장 ${count}개가 표시됩니다.`
      : `${filterName} 단어장이 없습니다. 다른 조건을 선택해 보세요.`;
  });
});

// ----- 11주차: 결과가 없을 때 전체 보기로 돌아가기 -----
myListsEmptyAction.addEventListener("click", function (event) {
  if (myLists.length === 0) {
    return;
  }

  event.preventDefault();
  const allButton = document.querySelector('.my-list-filter[data-filter="all"]');
  allButton.click();
  allButton.focus();
});

// ----- 10주차: 메뉴와 현재 위치 -----

const navLinks = document.querySelectorAll("#mainNav a");

function updateCurrentNav() {
  const currentHash = window.location.hash;

  navLinks.forEach(function (link) {
    const current = currentHash
      ? link.getAttribute("href") === currentHash
      : link === navLinks[0];

    link.classList.toggle("is-current", current);

    if (current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const currentLink = document.querySelector('#mainNav a[aria-current="page"]');
  const pageName = currentLink ? currentLink.textContent.trim() : "서비스 정보";
  document.title = `${pageName} | 단어장`;
}

window.addEventListener("hashchange", updateCurrentNav);
updateCurrentNav();

// ----- 10주차: 모바일 메뉴 열고 닫기 -----

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", function () {
  const isOpen = mainNav.classList.toggle("is-open");

  menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// ----- 11주차: 열린 모바일 메뉴를 Esc로 닫고 메뉴 버튼으로 초점 복귀 -----
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape" || !mainNav.classList.contains("is-open")) {
    return;
  }

  mainNav.classList.remove("is-open");
  menuToggle.textContent = "메뉴 열기";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.focus();
});

// 목적지를 선택하면 모바일 메뉴를 닫습니다.
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    mainNav.classList.remove("is-open");
    menuToggle.textContent = "메뉴 열기";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});
