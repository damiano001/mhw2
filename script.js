
const elements = document.querySelectorAll('.choice-grid div');
const selectedElements = new Map();

for (const element of elements){
  element.addEventListener('click', eventHandler);
}

function selectElement(space) {
  space.style.backgroundColor = '#cfe3ff';
  space.querySelector('.checkbox').src = './images/checked.png';
  selectedElements.set(space.dataset.questionId, space);
  space.removeEventListener('click', eventHandler);
}

function deselectElement(space) {
  space.style.backgroundColor = '#f4f4f4';
  space.querySelector('.checkbox').src = './images/unchecked.png';
  selectedElements.delete(space.dataset.questionId);
  space.addEventListener('click', eventHandler);
}

function eventHandler(event){     
    const space = event.currentTarget;
    const questionId = space.dataset.questionId;
  
    if (selectedElements.size === 3) {
      return;
    }
  
    const selected = selectedElements.get(questionId);
    if (selected) {      
        deselectElement(selected);
        selectElement(space);
     
    } else {      
      selectElement(space);
    }

    const questionElements = document.querySelectorAll(`.choice-grid div[data-question-id="${questionId}"]`);
    for (const element of questionElements) {
        if (!selectedElements.has(questionId) || element !== space) {
           element.style.opacity = 0.6;
        } else {
          element.style.opacity = 1;
        }
    }

    if (selectedElements.size === 3) {      
      showPersonality();
    }
}
 
  function showPersonality() {
    const personalityTitle = document.createElement('h2');
    const personalityText = document.createElement('p');

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Ricomincia il quiz';
    restartButton.addEventListener('click', restartQuiz);

    const personalityResult = getPersonalityResult();
  
    personalityTitle.textContent = personalityResult.title;
    personalityText.textContent = personalityResult.contents;
  
    const resultContainer = document.querySelector('#results');
    resultContainer.appendChild(personalityTitle);
    resultContainer.appendChild(personalityText);
    resultContainer.appendChild(restartButton);
   
  }

  function getPersonalityResult() {
    const choices = Array.from(selectedElements.values());
    const choiceIds = choices.map((choice) => choice.dataset.choiceId);
    const resultId = findResultId(choiceIds);
    const result = RESULTS_MAP[resultId];
  
    if (!result) {      
       const defaultResult = choiceIds[0];
       return RESULTS_MAP[defaultResult];

    }  
    return result;
  }
  
  function findResultId(choiceIds) {
    
    if (choiceIds.every((id) => id === choiceIds[0])) {
      return choiceIds[0];
    }  
    
    const counts = {};
    let maxCount = 0;
    let resultId;
  
    for (const id of choiceIds) {
      counts[id] = counts[id] || 0;
      counts[id]++;
      if (counts[id] > maxCount) {
        maxCount = counts[id];
        resultId = id;
      }
    }
  
    return resultId;
  }


  function restartQuiz() {
    for (const element of elements) {
      element.style.backgroundColor = '#f4f4f4';
      element.querySelector('.checkbox').src = './images/unchecked.png';
      element.style.opacity = 1;
      element.addEventListener('click', eventHandler);
    }
    selectedElements.clear();
    
    const resultContainer = document.querySelector('#results');
    resultContainer.parentNode.removeChild(resultContainer);
  
    
    const newResultContainer = document.createElement('div');
    newResultContainer.id = 'results';
    document.querySelector('article').appendChild(newResultContainer);

  }

  
  
  















