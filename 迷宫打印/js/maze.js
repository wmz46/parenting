function Maze(obj, col, row,enable) {
    this.col = col || 10;
    this.row = row || 10;
    this.obj = obj;
    this.canvas = obj.getContext('2d');
    this.maze_cells = {};
    this.start_cell = {};
    this.visitRooms = [];
    this.roomsLine = [];
    this.start_col = null;
    this.start_row = null;
    this.offsetCanvas = null;
    this.enable = enable;
    this.init();
}
Maze.prototype = {
    init: function () {
        this.cell = (this.obj.width - 2) / this.col;
        for (var i = 0; i < this.row; i++) {
            this.maze_cells[i] = [];
            for (var j = 0; j < this.col; j++) {
                this.maze_cells[i].push({
                    'x': j,
                    'y': i,
                    'top': false,
                    'bottom': false,
                    'left': false,
                    'right': false,
                    'isVisited': false,
                    'g': 0,
                    'h': 0,
                    'f': 0 });

            }
        }
        this.start_cell = { 'x': 0, 'y': 0 };
        this.start_row = this.start_cell.x;
        this.start_col = this.start_cell.y;
        this.visitRooms.push(this.start_cell);
        this.roomsLine.push(this.start_cell);
        this.maze_cells[0][0].isVisited = true;
        this.maze_cells[0][0].top = true;
        this.maze_cells[this.row - 1][this.col - 1].bottom = true;
        this.calcCells(0, 0, this.maze_cells);
        this.drawCells();
        this.maze_cells[0][0].top = false;
        this.maze_cells[this.row - 1][this.col - 1].bottom = false;
        this.drawRect(this.start_col, this.start_row);
        if(this.enable) {
            this.bindEvent();
        }

    },
    calcCells: function (x, y, arr) {
        var neighbors = [];
        if (x - 1 >= 0 && !this.maze_cells[x - 1][y].isVisited) {
            neighbors.push({ 'x': x - 1, 'y': y });
        }
        if (x + 1 < this.row && !this.maze_cells[x + 1][y].isVisited) {
            neighbors.push({ 'x': x + 1, 'y': y });
        }
        if (y - 1 >= 0 && !this.maze_cells[x][y - 1].isVisited) {
            neighbors.push({ 'x': x, 'y': y - 1 });
        }
        if (y + 1 < this.col && !this.maze_cells[x][y + 1].isVisited) {
            neighbors.push({ 'x': x, 'y': y + 1 });
        }
        if (neighbors.length > 0) {//相邻房间有未访问房间
            var current = { 'x': x, 'y': y };
            var next = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.maze_cells[next.x][next.y].isVisited = true;
            this.visitRooms.push({ 'x': next.x, 'y': next.y });
            this.roomsLine.push({ 'x': next.x, 'y': next.y });
            this.breakWall(current, next);
            this.calcCells(next.x, next.y, arr);
        } else {
            var next = this.roomsLine.pop();
            if (next != null) {
                this.calcCells(next.x, next.y, arr);
            }
        }
    },
    breakWall: function (cur, next) {
        if (cur.x < next.x) {
            this.maze_cells[cur.x][cur.y].bottom = true;
            this.maze_cells[next.x][next.y].top = true;
        }
        if (cur.x > next.x) {
            this.maze_cells[cur.x][cur.y].top = true;
            this.maze_cells[next.x][next.y].bottom = true;
        }
        if (cur.y < next.y) {
            this.maze_cells[cur.x][cur.y].right = true;
            this.maze_cells[next.x][next.y].left = true;
        }
        if (cur.y > next.y) {
            this.maze_cells[cur.x][cur.y].left = true;
            this.maze_cells[next.x][next.y].right = true;
        }
    },
    drawCells: function () {
        var ctx = this.canvas, //canvas对象
            w = this.cell;
        console.log(ctx);
        ctx.clearRect(0, 0, this.obj.width, this.obj.height);
        ctx.beginPath();
        ctx.save();
        ctx.translate(1, 1);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        for (var i in this.maze_cells) {//i 为 row
            var len = this.maze_cells[i].length;
            for (var j = 0; j < len; j++) {
                var cell = this.maze_cells[i][j];
                i = parseInt(i);
                console.log(typeof i);
                if (!cell.top) {
                    ctx.moveTo(j * w, i * w);
                    ctx.lineTo((j + 1) * w, i * w);
                }
                if (!cell.bottom) {
                    ctx.moveTo(j * w, (i + 1) * w);
                    ctx.lineTo((j + 1) * w, (i + 1) * w);
                }
                if (!cell.left) {
                    ctx.moveTo(j * w, i * w);
                    ctx.lineTo(j * w, (i + 1) * w);
                }
                if (!cell.right) {
                    ctx.moveTo((j + 1) * w, i * w);
                    ctx.lineTo((j + 1) * w, (i + 1) * w);
                }
            }
        }
        ctx.stroke();
        ctx.restore();
        this.drawOffset();
    },
    drawRect: function (col, row) {
        var ctx = this.canvas;
        ctx.save();
        ctx.clearRect(0, 0, this.obj.width,  this.obj.height);
        ctx.drawImage(this.offsetCanvas, 0, 0);
        ctx.translate(2, 2);
        if(this.enable) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(col * this.cell, row * this.cell, this.cell - 2, this.cell - 2);
        }
        ctx.restore();
    },
    drawOffset: function () {
        var offsetCanvas = document.createElement('canvas');
        offsetCanvas.width = this.obj.width;
        offsetCanvas.height = this.obj.height;
        var offset = offsetCanvas.getContext('2d');
        offset.clearRect(0, 0,this.obj.width, this.obj.height);
        offset.drawImage(this.obj, 0, 0, offsetCanvas.width, offsetCanvas.height);
        this.offsetCanvas = offsetCanvas;
    },
    bindEvent: function () {
        var that = this;
        window.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case 37:
                    event.preventDefault();
                    if (that.maze_cells[that.start_row][that.start_col].left) {
                        that.start_col--;
                    }
                    break;
                case 38:
                    event.preventDefault();
                    if (that.maze_cells[that.start_row][that.start_col].top) {
                        that.start_row--;
                    }
                    break;
                case 39:
                    event.preventDefault();
                    if (that.maze_cells[that.start_row][that.start_col].right) {
                        that.start_col++;
                    }
                    break;
                case 40:
                    event.preventDefault();
                    if (that.maze_cells[that.start_row][that.start_col].bottom) {
                        that.start_row++;
                    }
                    break;}

            that.drawRect(that.start_col, that.start_row);
            if (that.start_col == maze.col - 1 && that.start_row == maze.row - 1) {
                alert('到达终点了');
            }
        });
    } };
