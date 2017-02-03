angular.module('minesweeper', []);
angular.module('minesweeper').controller('MineSweeperCtrl',
    [
        '$scope', '$window', '$timeout',
        function ($scope, $window, $timeout) {
            var ctrl = this,
                Math = $window.Math;
            var clicks = 0;
            var cells = [];
            ctrl.createGrid = function (width, height) {
                var grid = [],
                    row, x, y;
                for (y = 0; y < height; y++) {
                    row = [];
                    for (x = 0; x < width; x++) {
                        row.push({
                            x: x,
                            y: y,
                            hidden: true,
                            value: 0
                        });
                    }
                    grid.push(row);
                }
                return grid;
            };

            ctrl.lose = function () {
                ctrl.revealAll($scope.grid);
                $scope.losses++;
                $timeout(ctrl.showLoss);
            };

            ctrl.showLoss = function () {
                $window.alert('you lose!');
                $scope.resetGrid();
            };

            ctrl.win = function () {
                ctrl.revealAll($scope.grid);
                $scope.wins++;
                var totalTime = ctrl.getTime() - $scope.startTime;
                if (totalTime < $scope.bestTime) {
                    $scope.bestTime = totalTime;
                }
                $timeout(ctrl.showWin);
            };


            ctrl.showWin = function () {
                $window.alert('you win!');
                $scope.resetGrid();
            };

            $scope.reveal = function (cell) {
              if (clicks<2) {
                cells[clicks] = cell;
                clicks++;
                cell.hidden = false;
              }
              if (clicks==2){
                if (cells[0].value != cells[1].value){

                  $timeout(function(){
                    cells[0].hidden = true;
                    cells[1].hidden = true;
                  }, 1000);
                  clicks = 0;
                }
                else {
                  clicks = 0;
                }
              }
            };




            ctrl.traverseGrid = function (grid, fn) {
                angular.forEach(grid, function (row) {
                    angular.forEach(row, function (cell) {
                        fn(cell);
                    });
                });
            };

            ctrl.revealAll = function (grid) {
                ctrl.traverseGrid(grid, function (cell) {
                    cell.hidden = false;
                });
            };

            ctrl.hasWon = function (grid) {
                var won = true;
                ctrl.traverseGrid(grid, function (cell) {
                    if (cell.hidden && !cell.mine) {
                        won = false;
                    }
                });
                return won;
            };

            ctrl.addNumbers = function(grid) {
                var laid = 0,
                    cell,firstCell,pairCell;
                var row, x, y, z;
                var numbersAvialable = (grid.length*grid.length)/2; //num of pairs
                var next = true;
                for (z = 1; z < numbersAvialable+1; z++){
                  next = true;
                  do {
                      firstCell = ctrl.getRandomCell(grid);
                      pairCell = ctrl.getRandomCell(grid);
                      if ((!pairCell.value) && (!firstCell.value) && (firstCell != pairCell)){ //if cells are empty
                            firstCell.value = z;
                            pairCell.value = z;
                            next = false;
                          }
                      }
                      while(next);
                }
              };


            ctrl.getRandomCell = function (grid) {
                var height = grid.length,
                    width = grid[0].length,
                    x = Math.floor(Math.random() * width),
                    y = Math.floor(Math.random() * height);

                return grid[y][x];
            };

            // ctrl.traverseNearbyCells = function (grid, originX, originY, fn) {
            //     var height = grid.length,
            //         width = grid[0].length,
            //         startX = Math.max(originX - 1, 0),
            //         startY = Math.max(originY - 1, 0),
            //         endX = Math.min(width - 1, originX + 1),
            //         endY = Math.min(height - 1, originY + 1),
            //         x, y;
            //
            //     for (y = startY; y <= endY; y++) {
            //         for (x = startX; x <= endX; x++) {
            //             if (x !== originX || y !== originY) {
            //                 fn(grid[y][x]);
            //             }
            //         }
            //     }
            // };

            ctrl.getTime = function () {
                return +new Date();
            };

            $scope.resetGrid = function () {
                $scope.grid = ctrl.createGrid($scope.gridWidth, $scope.gridHeight);
                ctrl.addNumbers($scope.grid);
                $scope.startTime = ctrl.getTime();
            };

            $scope.gridWidth = 8;
            $scope.gridHeight = 8;
            $scope.mineCount = 10;
            $scope.wins = 23;
            $scope.losses = 0;
            $scope.bestTime = 15 * 60 * 1000; // 15 minutes in milliseconds
            $scope.showStartForm = true;
            $scope.grid = true;

            $scope.startGame = function (){
                $scope.showStartForm = false;
                $scope.showGrid = true;
                $scope.resetGrid();
            };

            $scope.newGame = function (){
                $scope.showStartForm = true;
                $scope.showGrid = false;
            };
        }
    ]);

angular.module('minesweeper').directive('rightClick', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var cmd = $parse(attrs.rightClick);
            elem.on('contextmenu', function(e) {
                scope.$apply(function (){
                    cmd(scope);
                    e.preventDefault();
                });
            });
        }
    };
});
