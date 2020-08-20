function Sudoku(obj, difficulty) {
    this.obj = obj;
    //难度 1，2，3
    this.difficulty = difficulty;
    this.a = [1, 2, 3, 4];
    this.sudoku = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    this.answer = [[], [], [], []];
    this.table = [[], [], [], []];
    this.gameStart();
}

Sudoku.prototype = {

    /**
     * 复制一个 Numeric 型的二维数组
     */
    copy: function (arr) {
        var a = [[], [], [], [], [], [], [], [], []];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                a[i].push(arr[i][j]);
            }
        }
        return a;
    },

    createGame: function () {
        while (!this.createSudoku()) ;
        // 保存答案
        this.answer = this.copy(this.sudoku);
        // 每行随机挖去几个数，挖的个数与难度有关
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < this.difficulty + Math.floor(Math.random() * 2); j++) {
                this.sudoku[i][Math.floor(Math.random() * 4)] = 0;
            }
        }
    },
    createSudoku: function () {
        this.clear(this.sudoku); // 把 sudoku 的值都赋值为 0
        // 随机填充编号为 1的 block
        // 以减少搜索次数
        this.setBlockRandomly(1);
        this.a.sort(this.randomComparator);
        var success = this.tryit(0, 0);
        return success;
    },
    clear: function (arr) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                arr[i][j] = 0;
            }
        }
    },
    /**
     * 将 1-9 随机排序后，填充到 n 号 block 中
     */
    setBlockRandomly: function (n) {
        var startRow = Math.floor((n - 1) /2) * 2;
        var startCol = (n - 1) % 2 *2;
        this.a.sort(this.randomComparator);
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                this.sudoku[startRow + i][startCol + j] = this.a[i * 2 + j];
            }
        }
    },
    randomComparator: function (a, b) {
        return 0.5 - Math.random();
    },
    tryit: function (i, j) {
        console.log("i: " + i + " j: " + j);
        if (i >= 4) {
            return true;
        }
        var s = i;
        var t = j + 1;
        if (t >= 4) {
            t -= 4;
            s++;
        }
        if (this.sudoku[i][j] !== 0) {
            var success = this.tryit(s, t);
            if (success) {
                return true;
            }
        }
         console.log("s: " + s + " t: " + t);
        for (var k = 0; k < 4; k++) {
            if (this.check(i, j, this.a[k])) {
                this.sudoku[i][j] = this.a[k];
                var success = this.tryit(s, t);
                if (success) {
                    return true;
                }
                this.sudoku[i][j] = 0;
            }
        }
        return false;
    },
    check: function (i, j, x) {
        return this.checkRow(i, x) && this.checkColumn(j, x) && this.checkBlock(i, j, x);
    },
    checkColumn: function (col, x) {
        for (var i = 0; i < 4; i++) {
            if (this.sudoku[i][col] === x) {
                return false;
            }
        }
        // console.log("check column true");
        return true;
    },
    checkRow: function (row, x) {
        for (var j = 0; j < 4; j++) {
            if (this.sudoku[row][j] === x) {
                return false;
            }
        }
        // console.log("check row true");
        return true;
    },
    checkBlock: function (row, col, x) {
        var startRow = Math.floor(row / 2) * 2;
        var startCol = Math.floor(col / 2) * 2;
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                if (this.sudoku[startRow + i][startCol + j] === x) {
                    return false;
                }
            }
        }
        // console.log("check block true");
        return true;
    },

    // 查看答案
    showAnswer: function () {
        this.setTable(this.answer);
    },

    /**
     * 把二维数组 a 中的数据设置到游戏面板上
     */
    setTable: function (a) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (a[i][j] !== 0) {
                    this.table[i][j].innerHTML = a[i][j];
                } else {
                    this.table[i][j].innerHTML = ' ';
                }
            }
        }
    },
    initTable: function () {
        var ul = document.createElement("ul");
        ul.setAttribute("class", 'sudoku');
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var li = document.createElement('li');
                li.setAttribute("x", i);
                li.setAttribute("y", j);
                this.table[i].push(li);
                ul.appendChild(li);
            }
        }
        this.obj.innerHTML = "";
        this.obj.appendChild(ul);
    },
    // 换一个数独
    change: function () {
        this.createGame();
        this.setTable(this.sudoku);
    },
    gameStart:function() {
        this.initTable();
        this.change();
    }
}