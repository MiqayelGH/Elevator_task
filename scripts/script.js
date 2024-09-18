const elevator_div = document.querySelector('.elevator_container')
const floors_div = document.querySelector('.floors')
const elevatorsPosition = [1, 1, 1]
const elevatorAvailibility = [true, true, true]
const elevatorEndpoint = [null, null, null]
const elevatorIntervalIds = [null, null, null]
const elevatorTimeoutIds = [null, null, null]

const getDifferenceModul = (a, b) => {
    if (a > b) {
        return a - b
    }

    return b - a
}

const startMove = (elevator, countOfStages, to, from) => {
    elevatorAvailibility[elevator] = false;
    elevatorEndpoint[elevator] = to;

    if (!elevatorIntervalIds[elevator]) {

        elevatorIntervalIds[elevator] = setInterval(() => {
            const currentActiveElevator = document.querySelector(`.active_${elevator + 1}`);
            currentActiveElevator.classList.remove(`active_${elevator + 1}`);

            elevatorsPosition[elevator] += (to > from ? 1 : -1);

            const newElevator = document.querySelector(`.elevator-${elevator + 1}_${elevatorsPosition[elevator]}`)
            newElevator.classList.add(`active_${elevator + 1}`)

            newElevator.style.transform = `transform 1s ease-in-out;`;

        }, 1000)
    }

    if (!elevatorTimeoutIds[elevator]) {
        clearTimeout(elevatorTimeoutIds[elevator]);
    }

    elevatorTimeoutIds[elevator] = setTimeout(() => {
        elevatorAvailibility[elevator] = true;
        elevatorEndpoint[elevator] = null;
        clearInterval(elevatorIntervalIds[elevator])
        elevatorIntervalIds[elevator] = null;
        clearTimeout(elevatorTimeoutIds[elevator])
        elevatorTimeoutIds[elevator] = null;
    }, (countOfStages - 1) * 1000)

}

const checkElevatorGoingWay = (currentElevator, calledFloor) => {
    const isGoingUp = ((elevatorEndpoint[currentElevator] - elevatorsPosition[currentElevator]) > 0) // false -> its going down
    const inCurrentWay = isGoingUp ? calledFloor > elevatorEndpoint[currentElevator] : calledFloor < elevatorEndpoint[currentElevator]

    return inCurrentWay;
}

const addFloors = () => {
    for (let i = 20; i >= 1; i--) {
        const floorEl = document.createElement("label")
        const floorBtn = document.createElement("button")
        const elevator1 = document.createElement("div")
        const elevator2 = document.createElement("div")
        const elevator3 = document.createElement("div")


        floorEl.setAttribute("class", `${'floor_'+ i}`)
        floorBtn.setAttribute("value", i)

        floorBtn.innerHTML = `floor ${i}`

        if (i == 1) {
            elevator1.setAttribute("class", `elevator-1_${i} active_1`)
            elevator2.setAttribute("class", `elevator-2_${i} active_2`)
            elevator3.setAttribute("class", `elevator-3_${i} active_3`)
        } else {
            elevator1.setAttribute("class", `elevator-1_${i}`)
            elevator2.setAttribute("class", `elevator-2_${i}`)
            elevator3.setAttribute("class", `elevator-3_${i}`)
        }

        elevator1.style.height = '40px';
        elevator1.style.width = '40px';
        elevator2.style.height = '40px';
        elevator2.style.width = '40px';
        elevator3.style.height = '40px';
        elevator3.style.width = '40px';

        floorEl.appendChild(floorBtn)
        floorEl.appendChild(elevator1)
        floorEl.appendChild(elevator2)
        floorEl.appendChild(elevator3)

        floorBtn.addEventListener('click', (event) => {
            const calledFloor = Number(event.target.value);


            if (!elevatorsPosition.includes(calledFloor)) {
                let currentElevator = 0;
                let currentDif = getDifferenceModul(calledFloor, elevatorsPosition[currentElevator]);

                for (let k = 1; k < 3; k++) {
                    let currentElevatorDiff = getDifferenceModul(calledFloor, elevatorsPosition[k])


                    if (currentDif > currentElevatorDiff) {
                        if ((!elevatorEndpoint[currentElevator]) || (elevatorEndpoint[currentElevator] && !checkElevatorGoingWay(currentElevator, calledFloor))) {
                            currentDif = currentElevatorDiff
                            currentElevator = k;
                        }
                    }
                }

                startMove(currentElevator, currentDif + 1, calledFloor, elevatorsPosition[currentElevator])

            }
        })
        floors_div.appendChild(floorEl);
    }
}

const setElevatorsAtLvl1 = () => {
    for (let i = 1; i < 4; i++) {

        const elevator = document.querySelector(`.elevator-${i}_1`)
        elevator.classList.add(`active_${i}`)
    }
}

addFloors()
setElevatorsAtLvl1()