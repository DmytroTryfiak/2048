import React, { useEffect, useState } from 'react';
import game from './logic';
import './styles.scss';

function Game2048() {
    const [data, setData] = useState(game.grid)
    const [continueGame, setContinueGame] = useState(false)
    useEffect(() => {
        const handleKeyboard = (e) => {
            switch (e.keyCode) {
                case 38: //Up
                    makeStep(0)
                    break;
                case 39: //Right
                    makeStep(1)
                    break;
                case 40: //Down
                    makeStep(2)
                    break;
                case 37: //Left
                    makeStep(3)
                    break;
                default:
                    break;
            }
        }
        document.addEventListener("keydown", handleKeyboard)
        return () => {
            document.removeEventListener("keydown", handleKeyboard)
        }
    }, [])
    const newGame = () => {
        game.createNewGame()
        setContinueGame(false)
        setData([...game.grid])
    }
    const updateGrid = () => {
        if (!game.moved)
            return
        game.updateGrid()
        setData([...game.grid])
        game.moved = false
    }
    const makeStep = (type) => {
        if (game.moved)
            return
        game.makeStep(type)
        setData([...game.grid])
    }
    const setContinue = () => {
        setContinueGame(true)
    }
    return (
        <div className="game2048">
            <div className="header">
                <div className="title">
                    Game 2048
                </div>
                <div className="score">
                    Score: <br></br>
                    {game.score}
                </div>
                <div className="bestScore">
                    Best: <br></br>
                    {game.bestScore}
                </div>
                <Button content='New game' callback={newGame} />
            </div>
            <div className="gridContainer" onTransitionEnd={updateGrid}>
                {
                    data.map((element, i) => (
                        <div className={`gridItem gridItem-${i}`} key={i}>
                        </div>
                    )
                    )
                }
                {
                    data.map((element) => (
                        element ?
                            <Tile data={element} key={element.id}/>
                            :
                            null
                    )
                    )
                }
                {
                    game.gameWon && !continueGame ?
                        <div className='gameStatus gameWon'>
                            <p className='gameStatusTitle'>Game won!</p>
                            <div>
                                <Button content='New game' callback={newGame} />
                                <Button content='Continue' callback={setContinue} />
                            </div>
                        </div>
                        :
                        null
                }
                {
                    game.gameOver ?
                        <div className='gameStatus gameOver'>
                            <p className='gameStatusTitle'>Game over</p>
                            <div>
                                <Button content='New game' callback={newGame} />
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        </div>

    )
}

function Button({ content, callback }) {
    return (
        <button className='button' onClick={callback}>
            {content}
        </button>
    )
}

function Tile({ data }) {
    return (
        <div className={`gridItem gridItem-${data.position} gridItemValue-${data.value}`} >
            {data.value}
        </div>
    )
}

export default Game2048;