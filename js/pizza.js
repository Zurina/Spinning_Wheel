const colors = [
    '#00FFFF', '#00FF00', '#C0C0C0', '#008080',
    '#a700ef', '#800000', '#0000FF', '#000080',  
    '#FF00FF', '#808000', '#FFFF00', '#808080',	
    '#008000', '#FF0000', '#FFFFFF', '#800080',
    '#6a7382', '#64ba95', '#02016d', '#4c721d'

]

var persons = []

window.onload = function() {
    showPersons()
    arrangePizzas()
}()

function showPersons() {
    if (persons.length < 1) {
        const label = {
            name: '<span class="text-black">No contestants yet...</span>',
            color: '#d7f1f5'
        }
        document.getElementById('names').innerHTML = createDiv(label)
    }
    else {
        var html = ""
        persons.forEach(person => {
            html += createDiv(person)
        })
        document.getElementById('names').innerHTML = html
    }
}



function createDiv(person) {
    return `
        <div class="col-lg-12 mb-4">
        <div class="card text-white shadow" style="background-color: ${person.color}">
        <div class="card-body">
            ${person.name}
        </div>
        </div>
    </div>
    `
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

function createPizzaHTML(person) {
    return `
        <div id="${person.id}" class="hold">
            <div class="Pizza"><br><br><span style="opacity:0;">invisibleeeeeeeee</span>${person.name}</div>
        </div>
    `
}

function createPizzaStyle(person, sliceWidth) {
    return `
        #${person.id} {
            transform: rotate(${person.currentDegree}deg);
        }
        #${person.id} .Pizza {
            background-color: ${person.color};
            transform: rotate(${sliceWidth}deg);
        }
    `
}

function createArrow() {
    return `
    <div id="PizzaArrow" class="PizzaArrowHold">
        <div class="InnerPizzaArrow"></div>
    </div>
    `
}

function arrangePizzas() {
    if (persons.length == 0) {
        document.getElementsByClassName('PizzaContainer')[0].innerHTML = `<div class="alert alert-info" role="alert">Add some contestants to the game...</div>`
    }
    else if(persons.length == 1) {
        document.getElementsByClassName('PizzaContainer')[0].innerHTML = `<div class="alert alert-success" role="alert">${persons[0].name} is the last contestant!!!!</div>`
    }
    else {
        var sliceWidth = 360 / persons.length
        var html = ""
        var style = ""
        for(let i = 0; i < persons.length; i++) {
            persons[i].currentDegree = sliceWidth * i
            html += createPizzaHTML(persons[i])
            style += createPizzaStyle(persons[i], sliceWidth)
        }

        html += createArrow()
        document.getElementsByClassName('PizzaContainer')[0].innerHTML = html
        document.getElementById('pizzaStyle').innerHTML = style;
    }
}

function createPizzaStyleAnimation(person) {
    return `
        #${person.id} {
            transform: rotate(${person.currentDegree}deg);
            transition-duration: 5s;
        }
    `
}

function animation() {
    var style = ""
    for(let i = 0; i < persons.length; i++) {
        persons[i].currentDegree += 360
        style += createPizzaStyleAnimation(persons[i])
    }
    document.getElementById('pizzaStyle').innerHTML += style;
}

function spinAnimation() {
    for(let i = 0; i < 8; i++) {
        animation()
    }
}

function adjustCurrentDegree() {
    for(let i = 0; i < persons.length; i++) {
        persons[i].currentDegree = persons[i].currentDegree % 360
    }
}

function deleteChosenPerson() {
    const pizzaSliceWidth = 360 / persons.length
    for(let i = 0; i < persons.length; i++) {
        const personDegree = persons[i].currentDegree % 360
        if (personDegree < 270 && (personDegree + pizzaSliceWidth) >= 270)
            persons.splice(i, 1)
    }
}

async function game() {
    spinAnimation()
    deleteChosenPerson()

    await sleep(5000)
    arrangePizzas()
    adjustCurrentDegree()
    showPersons()
}

document.getElementById("animate").addEventListener('click',function () {
    game()
}); 

document.getElementById("addContestants").addEventListener('click', function() {
    const contestants = document.getElementById("exampleFormControlTextarea1").value.split('\n')
    const sliceWidth = 360 / contestants.length
    const newPersonArray = []
    for (var i = 0; i < contestants.length; i++) {
        if (contestants[i] != "") {
            const person = {
                name: contestants[i],
                color: colors[i],
                id: `PizzaSlice${colors[i].slice(1)}`,
                currentDegree: sliceWidth * i
            }
            newPersonArray.push(person)
        }
    } 
    persons = newPersonArray
    arrangePizzas()
    adjustCurrentDegree()
    showPersons()
    document.getElementById("exampleFormControlTextarea1").value = ""
})
