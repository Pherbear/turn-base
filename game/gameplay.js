//enemyShips and playerShips consist of arrays (ships) of arrays (each ship block) that have 3 items [x-cords, y-cords, hit]
// if hit == 0, it has not been hit yet
// if hit == 1, it has been hit
// all hit needs to be 1 in order for the ship to sink
// the index of each ship corresponds to the same order they were loaded in
// index 0 = 1st ship, index 1 = 2nd ship etc etc


const gridSize = 10
let playerGrid = []
let enemyGrid = []
populateArray(gridSize, playerGrid)
populateArray(gridSize, enemyGrid)

let viewingPlayer = false
let positions = []

export default function gameplay(save_state = null) {
    
    //TODO: Create random generation for grid
    //here we will generate the grid, create enemy and player ships
    //will not load new positions if the game is loaded 
    //enemy and player will have 5 ships:
    // 3 ships 2 grid length
    // 1 ship 3 grid length
    // 1 ship 4 grid length

    
    if (save_state) {
        console.log(`${save_state} has been loaded!`)

        //TODO: this is a test for loading, this needs to be replaced
        //with actual save data, this data is hard coded currently
        positions = [
                {x: 3, y: 2, direction: 'right', size: 4, affiliate: 'enemy', damage: [0,0,0,0]},
                {x: 3, y: 5, direction: 'down', size: 3, affiliate: 'enemy', damage: [0,0,0]},
                {x: 1, y: 5, direction: 'down', size: 2, affiliate: 'enemy', damage: [0,0]},
                {x: 7, y: 5, direction: 'down', size: 2, affiliate: 'enemy', damage: [0,0]},
                {x: 3, y: 9, direction: 'right', size: 2, affiliate: 'enemy', damage: [0,0]},
                {x: 3, y: 2, direction: 'down', size: 4, affiliate: 'player', damage: [0,0,0,0]},
                {x: 5, y: 3, direction: 'down', size: 3, affiliate: 'player', damage: [0,0,0]},
                {x: 1, y: 0, direction: 'right', size: 2, affiliate: 'player', damage: [0,0]},
                {x: 7, y: 2, direction: 'down', size: 2, affiliate: 'player', damage: [0,0]},
                {x: 1, y: 9, direction: 'right', size: 2, affiliate: 'player', damage: [0,0]},
            ]

    } else {

        //TODO: generate cordinates of new game
        console.log(`new game`)
    }
    
    //loading html to game
    let game = document.getElementById('game')
    game.innerHTML = `
    <div id="gameplay" class="gameplay">
        <div>
            <div class="player">
                Player's grid:
                <div class="grid">
                </div>
            </div>
            <div class="enemy">
                Enemy's grid:
                <div class="grid">
                </div>
            </div>
            <button>Switch View</button>
        </div>
        <div id="status" class="status">
            <div id="hit">Start Attacking!</div>
        </div>
    </div>
    `
    let player = game.querySelector(".player")
    let enemy = game.querySelector(".enemy")

    //here we are generating the ships based off the data we are given from
    //our save data or data generated by a new game

    //TODO: find a way to combine both of these for loops to clean up code since they are 
    //both very similar

    for(const ship of positions){
        let shipIndex = positions.indexOf(ship)
        let affiliate = ship.affiliate
        let y = ship.y
        let x = ship.x
        
        let gridType
        let htmlsection

        if (affiliate == 'enemy') {
            gridType = enemyGrid
            htmlsection = enemy
        }
        else if (affiliate == 'player') {
            gridType = playerGrid
            htmlsection = player
        }

        if (ship.direction == 'down'){
            for (let i = 0; i < ship.size; i++){
                gridType[x][y+i] = [ship, i]
            }
        }     
        else if (ship.direction == 'right'){
            for (let i = 0; i < ship.size; i++){
                gridType[x+i][y] = [ship, i]
            }
        }
        htmlsection.querySelector(".grid").innerHTML += generateShip(ship)
        game.querySelector(".status").innerHTML += generateShipHTML(ship)
    }


    //load grid into game once generation or file has been loaded for both player and enemy
    for (let y = 0; y < playerGrid.length; y++) {
        for(let x = 0; x < playerGrid[y].length; x++){
            let item = `<div class="gridItem" id="${x} ${y} player"></div>`
            player.querySelector(".grid").innerHTML += item
        }
    }
    
    for (let y = 0; y < enemyGrid.length; y++) {
        for(let x = 0; x < enemyGrid[y].length; x++){
            let item = `<div class="gridItem" id="${x} ${y} enemy"></div>`
            enemy.querySelector(".grid").innerHTML += item
        }
    }
    
    //adding eventlistener to players and enemy grid
    //later i want to take off the option to attack yourself XD
    //check out the gridMissle() function
    let elements = document.querySelectorAll(".enemy .gridItem")
    for(const element of elements){
        element.addEventListener("click", gridMissle)
    }

    //adding event listener to switch view button
    //enemy.style.display = "none"
    player.style.display = "none"
    let button = game.querySelector("button")
    button.addEventListener("click", switchView)
}

//currently this event listener is for the grid, it will show the cordinates of
//the selected item in console and change the color of the clicked grid item

function gridMissle(e){
    let target = e.target

    //cords is going to get the id
    //from the grid itself. each id from the target in the grid comes with 3 pieces of 
    //data:
    //cords[0] = x
    //cords[1] = y
    //cords[2] = (enemy or player)

    let cords = target.id.split(" ")

    //css of the clicked item in the grid

    
    //status is the big text on the right that says "hit" or "miss"
    let status = document.getElementById("hit")
    
    //tile is data from the array (playerGrid or enemyGrid)
    //consists of ['ship', shipIndex, sectionIndex] or ['']
    //'ship' meaning there is a ship on that grid, '' meaning there is nothing so its a miss
    //shipIndex telling the game which ship it is, 0 = 1st enemy ship, 1 = 2nd enemy ship, etc
    //sectionIndex telling the game which part of the ship it is
    
    let x = cords[0]
    let y = cords[1]
    
    //enemy or player
    let affiliate = cords[2]

    let ship
    let shipSectionIndex

    if (affiliate == 'enemy'){
        ship = enemyGrid[x][y][0]
        shipSectionIndex = enemyGrid[x][y][1]
    } else if (affiliate == 'player'){
        ship = playerGrid[x][y][0]
        shipSectionIndex = playerGrid[x][y][1]
    }
    
    if(ship){
        target.style.cssText = `background:red;opacity:0.5;`
        status.innerText = `Hit!`
        ship.damage[shipSectionIndex] = 1
        isShipSunk(ship)
    } else {
        target.style.cssText = `background:yellow;opacity:0.5;`
        status.innerText = `Miss!`
    }

    //turn()
}

function switchView(){

    let player = game.querySelector(".player")
    let enemy = game.querySelector(".enemy")

    if (viewingPlayer){
        player.style.display = "none"
        enemy.style.display = "block"
        viewingPlayer = false
    } else {
        enemy.style.display = "none"
        player.style.display = "block"
        viewingPlayer = true
    }

}

//this function only generates the ship image, doesn't affect actual gameplay
function generateShip(ship){
    let x = ship.x
    let y = ship.y
    let direction = ship.direction
    let size = ship.size
    let targetx = x + 1
    let targety = y + 1

    if(direction == 'down'){
        targety += size
    } else if (direction == 'right'){
        targetx += size
    }

    let html = `
    <div class = "ship_container"
        style = "grid-area: ${y+1} / ${x+1} / ${targety} / ${targetx};">
        <img src="../assets/sprites/ship_${direction}.jpg"
            class = "ship_image">
            </div>
            `
    
    return html
}

//this function generates the status of the ships on the right side of the game
//eg. Enemy Large Vessel: Active
function generateShipHTML(ship){
    let size = ship.size
    let affiliate = ship.affiliate
    let index = positions.indexOf(ship)
    let shipType = ``

    switch(size){
        case 4:
            shipType = `Large`
            break;
        case 3:
            shipType = 'Medium'
            break;
        case 2:
            shipType = 'Small'
            break;
        default:
            shipType = 'Unknown'
            break;
    }
    
    let capitalized = affiliate.charAt(0).toUpperCase() + affiliate.slice(1)

    let html = `<div id="${affiliate}_ship_${index}" class="ship_status">${capitalized} ${shipType} Vessel: <a>Active</a></div>`
    
    return html
}

function populateArray(size, array){
    for(let i = 0; i < size; i++){
        let inner = []
        for(let j = 0; j < size; j++){
            inner.push([''])
        }
        array.push(inner)
    }
}

function isShipSunk(ship){

    let affiliate = ship.affiliate
    let index = positions.indexOf(ship)

    let ship_html = document.getElementById(`${affiliate}_ship_${index}`).querySelector("a")
    ship_html.innerText = "Damaged"
    ship_html.style.color = "yellow"

    for(const section of ship.damage){
        if(section == 0) return 
    }

    ship_html.innerText = "Inactive"
    ship_html.style.color = "red"
}

function turn(){
    setTimeout(function(){
        switchView()
    }, 1000)
}