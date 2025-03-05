let grid, cols, rows, res = 10;
let maxAge = 10;

function setup() {
  createCanvas(600, 400);
  cols = floor(width / res);
  rows = floor(height / res);
  grid = make2DArray(cols, rows);
  // Initialize grid: each cell is an object { alive, age }
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      grid[i][j] = { alive: floor(random(2)) === 1, age: 0 };
}

function draw() {
  background(220);
  let next = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];
      // Draw the cell: live cells are colored based on age
      if (cell.alive) {
        let c = lerpColor(color(0, 255, 0), color(255, 0, 0), cell.age / maxAge);
        fill(c);
      } else {
        fill(255);
      }
      stroke(0);
      rect(i * res, j * res, res, res);

      // Count live neighbors (with toroidal wrap-around)
      let sum = 0;
      for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
          if (a === 0 && b === 0) continue;
          let x = (i + a + cols) % cols;
          let y = (j + b + rows) % rows;
          if (grid[x][y].alive) sum++;
        }
      }

      // Apply Conway's rules with aging:
      // - A live cell with 2 or 3 neighbors survives if it hasn't reached maxAge.
      // - Otherwise, it dies.
      // - A dead cell with exactly 3 live neighbors becomes alive (age 0).
      if (cell.alive) {
        next[i][j] = (sum === 2 || sum === 3) && cell.age < maxAge ?
          { alive: true, age: cell.age + 1 } : { alive: false, age: 0 };
      } else {
        next[i][j] = (sum === 3) ? { alive: true, age: 0 } : { alive: false, age: 0 };
      }
    }
  }
  grid = next;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) arr[i] = new Array(rows);
  return arr;
}