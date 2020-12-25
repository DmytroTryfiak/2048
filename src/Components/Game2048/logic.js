const storageName = 'game2048'

class Game2048 {
    constructor(size) {
        this.size = size
        //if there is a storage, then create game from storage
        const storageData = localStorage.getItem(storageName)
        if (storageData) {
            const data = JSON.parse(storageData)
            this.id = data.id
            this.bestScore = data.bestScore
            if (data.grid) {
                this.grid = data.grid
                this.size = Math.sqrt(this.grid.length)
                this.score = data.score
            } else {
                this.createNewGame()
            }
        } else {
            this.id = 0
            this.bestScore = 0
            this.createNewGame()
        }
    }
    createNewGame() {
        this.grid = new Array(this.size * this.size).fill(null)
        this.addTile()
        this.addTile()
        this.score = 0
        this.gameWon = false
        this.gameOver = false
        this.moved = false
    }
    //get free cell in the grid
    get freeCellsList() {
        return this.grid.map((element, index) => {
            return ({
                index: index,
                value: element
            })
        }).filter((element) => element.value === null)
    }
    addTile() {
        const newFreeIndex = Math.floor(Math.random() * (this.freeCellsList.length - 1))//index of free cell
        const newValue = Math.random() < 0.9 ? 2 : 4; //new value 2-90%, 4 -10%
        const newIndex = this.freeCellsList[newFreeIndex].index //new index in grid
        this.grid[newIndex] = {
            value: newValue,
            position: newIndex, //new position then tile merge
            id: this.id++,
            merge: false,
            remove: false,
        }
    }
    isGameOver() {
        //if there is a free cell then game continue
        if (this.freeCellsList.length !== 0)
            return false
        //if there are equal values then game continue
        for (let i = 0; i < this.size * this.size; i += this.size) {
            for (let j = 0; j < this.size - 1; j++) {
                if (this.grid[i + j].value === this.grid[i + j + 1].value)
                    return false
            }
        }
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size * this.size - this.size; j += this.size) {
                if (this.grid[i + j].value === this.grid[i + j + this.size].value)
                    return false
            }
        }
        return true
    }
    makeStep(type = 0) {
        let gain, offset, deltaOffset, deltaIndex
        switch (type) {
            case 0: //up
                gain = 4
                offset = 0
                deltaOffset = 1
                break
            case 1: //right
                gain = -1
                offset = this.size - 1
                deltaOffset = this.size
                break;
            case 2: //down
                gain = -4
                offset = this.size * this.size - this.size
                deltaOffset = 1
                break;
            case 3: //left
                gain = 1
                offset = 0
                deltaOffset = this.size
                break
            default:
                break;
        }
        deltaIndex = gain
        //get index in grid from index in loop
        const getIndex = index => index * gain + offset
        //first loop in one direction
        for (let i = 0; i < this.size; i++) {
            let newIndex = getIndex(0) //index of position there insert new Tale
            let nextIndex = getIndex(0)//index of next tale
            //second loop in other direction
            for (let j = 0; j < this.size; j++) {
                let index = getIndex(j)
                if (this.grid[index]) {
                    if (newIndex !== index) {
                        this.grid[index].position = newIndex
                        this.moved = true
                    }
                    let k = j + 1
                    //loop for searcn next element
                    while (k < this.size) {
                        nextIndex = getIndex(k)
                        if (this.grid[nextIndex]) {
                            //if value equal merge tale
                            if (this.grid[nextIndex].value === this.grid[index].value) {
                                this.grid[nextIndex].position = this.grid[index].position
                                this.grid[index].merge = true
                                this.grid[nextIndex].remove = true
                                this.moved = true
                                j=k
                            }
                            break
                        }
                        k++
                    }
                    newIndex += deltaIndex
                }
            }
            offset += deltaOffset
        }
    }
    //update grid, make mrge and new position
    updateGrid() {
        if (this.moved) {
            let updateGrid = new Array(this.size * this.size).fill(null)
            this.grid.forEach(element => {
                if (element) {
                    if (element.remove)
                        return
                    if (element.merge) {
                        element.value *= 2
                        element.merge = false
                        this.score += element.value
                        //if merge value 2048 then game over
                        if (element.value === 2048)
                            this.gameWon = true
                    }
                    updateGrid[element.position] = element
                }

            });
            this.grid = [...updateGrid]
            this.bestScore = this.score > this.bestScore ? this.score : this.bestScore
            this.addTile()
            this.gameOver = this.isGameOver();
            this.writeToStorage()
            this.moved=false
        }
    }

    writeToStorage() {
        const data = {}
        data.bestScore = this.bestScore
        //if game over then write null
        if ( this.gameOver) {
            data.grid = null
            data.score = null
            data.id = null 
        } else {
            data.grid = this.grid
            data.score = this.score
            data.id = this.id
        }
        localStorage.setItem(storageName, JSON.stringify(data))
    }

}
const game = new Game2048(4)

export default game;