import { useState } from "react";

import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale } from "chart.js";

import "./App.css";

const GRID_SIZE = 10;
ChartJS.register(LinearScale);

function App() {
  const [grid, setGrid] = useState(
    Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
      Array.from({ length: GRID_SIZE }, (_, colIndex) =>
        rowIndex === 0 && colIndex === 0 ? 1 : 0
      )
    )
  );
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [spacesPainted, setSpacesPainted] = useState(0);
  const [moveSequence, setMoveSequence] = useState([]);

  const moveRobot = (direction) => {
    const newX = robotPosition.x + direction.x;
    const newY = robotPosition.y + direction.y;

    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
      setRobotPosition({ x: newX, y: newY });
      setSpacesPainted(spacesPainted + 1);

      const updatedGrid = grid.map((row, rowIndex) => {
        if (rowIndex === newY) {
          return row.map((cell, cellIndex) =>
            cellIndex === newX ? spacesPainted + 1 : cell
          );
        } else {
          return row;
        }
      });

      setGrid(updatedGrid);
      setMoveSequence([...moveSequence, { x: newX, y: newY }]);
    }
  };

  const automateMovement = () => {
    const sequence = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
    ];

    let delay = 500;
    sequence.forEach((direction, index) => {
      setTimeout(() => {
        moveRobot(direction);
        if (index === sequence.length - 1) {
          alert("Automated movement completed!");
        }
      }, delay * index);
    });
  };

  return (
    <div className="App">
      <h1>Robot Painting Application</h1>
      <div className="grid-container">
        {grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={cell ? "painted" : ""}
            />
          ))
        )}
      </div>
      <div className="controls">
        <button onClick={() => moveRobot({ x: 0, y: -1 })}>Move Up</button>
        <button onClick={() => moveRobot({ x: 0, y: 1 })}>Move Down</button>
        <button onClick={() => moveRobot({ x: -1, y: 0 })}>Move Left</button>
        <button onClick={() => moveRobot({ x: 1, y: 0 })}>Move Right</button>
        <button onClick={automateMovement}>Automate Movement</button>
      </div>
      <span className="info">
        <p>
          Robot Final Location: ({robotPosition.x + 1}, {robotPosition.y + 1})
        </p>
        <p>Spaces Painted: {spacesPainted}</p>
      </span>
      <div className="chart">
        <Chart
          type="line"
          data={{
            labels: moveSequence.map((_, index) => index + 1),
            datasets: [
              {
                label: "Robot Moves",
                data: moveSequence.map(
                  (move) => GRID_SIZE * move.y + move.x + 1
                ),
                fill: false,
                borderColor: "rgba(75,192,192,1)",
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
