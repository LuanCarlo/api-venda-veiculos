/**
 * Created by Marcony on 09/06/16.
 */
angular.module('xyScroll', []);
angular.module('xyScroll').directive('xyScroll', ['$log', '$document', '$timeout', function($log, $document, $timeout) {
    return {
        scope: {
            x: '=?',
            y: '=?',
            dragX: '=?',
            dragY: '=?'
        },
        template: '<div class="xy-outer"><div class="xy-inner" ng-transclude></div>'
        + '<div class="xy-scroll xy-scroll-x" ng-class="{active: isActive || dragging}">'
        + '<div class="xy-bar xy-bar-x" ng-style="scrollX" ng-mousedown="beginDragX($event)"></div></div>'
        + '<div class="xy-scroll xy-scroll-y" ng-class="{active: isActive || dragging}" ng-style="{paddingTop: topOffset}">'
        + '<div class="xy-bar xy-bar-y" ng-style="scrollY" ng-mousedown="beginDragY($event)"></div></div></div>',
        transclude: true,
        link: function(scope, element, attrs) {
            // ...
            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;

            var accelerationTimer = null,
                accelerationDelay = null,
                speed = 0.5,
                speedX = 1,
                speedY = 1;

            var content = element.find('.xy-content'),
                header = element.find('.xy-header-left'),
                top = element.find('.xy-header-top'),
                corner = element.find('.xy-corner'),
                inner = content.parent(), //element.find('.xy-inner'),
                child = content.children();

            scope.dragging = false;
            scope.isActive = false;
            scope.scrollX = {
                left: 0,
                width: 100,
                // opacity: 1
            };

            scope.scrollY = {
                top: 0,
                height: 30,
                // opacity: 1
            };

            scope.topOffset = 0;

            $timeout(function() {
                setup();
                resize();
            });

            function setup() {
                inner.on('mousewheel wheel', mousewheel);

                if (scope.dragX || scope.dragY) {
                    content.on('mousedown', mousedown);
                }
                content.on('mouseover', mouseover);
                content.on('mouseout', mouseout);
                content.on('touchstart', touchstart); //touch test

                var resizeEvent = attrs["resize"];
                if (resizeEvent) { //optional resize via scope.$boardcast
                    scope.$on(resizeEvent, function() {
                        $timeout(resize, 0);
                    });
                }
                var resetEvent = attrs["reset"];
                if (resetEvent) {
                    scope.$on(resetEvent, function() {
                        $timeout(restart, 0);
                    });
                }
            }

            function resize() {
                //top header
                scope.topOffset = getTopOffset();
                corner.height(scope.topOffset);
                top.height(scope.topOffset);
                //scrollbar
                scope.scrollX.width = getScrollWidth();
                scope.scrollY.height = getScrollHeight();
                speedX = getRatioX();
                speedY = getRatioY();
                //set position
                scrollX();
                scrollY();
            }

            function restart() {
                x = 0;
                y = 0;
                scrollX();
                scrollY();
                update();
            }

            function mousewheel(event) {
                event.preventDefault();
                // support non-webkit browsers
                if (event.originalEvent != undefined) {
                    event = event.originalEvent;
                }
                var delta = getWheelDelta(event); // event.wheelDeltaY || event.wheelDelta;
                delta = Math.floor(delta * accelerate());
                // shift or cmd(Mac) is pressed?
                if (event.shiftKey || event.metaKey) {
                    moveX(-delta);
                } else {
                    moveY(-delta);
                }
                update();
            }

            function getWheelDelta(event) {
                if (event.type == "wheel" || event.deltaY) {
                    var delta = event.deltaX || event.deltaY;
                    return (event.deltaMode == 0) ? -delta : -delta * 40; //line mode
                }
                if (event.type == "mousewheel") {
                    return event.wheelDeltaY || event.wheelDelta;
                }
            }

            scope.beginDragX = function(event) {
                event.preventDefault();
                scope.dragging = true;
                startX = event.pageX;
                $document.on('mousemove', dragX);
                $document.one('mouseup', endDragX);
            }

            scope.beginDragY = function(event) {
                event.preventDefault();
                scope.dragging = true;
                startY = event.pageY;
                $document.on('mousemove', dragY);
                $document.one('mouseup', endDragY);
            }

            function dragX(event) {
                event.preventDefault();

                var delta = event.pageX - startX;
                startX += delta;
                moveX(delta * speedX);
                update();
            }

            function dragY(event) {
                event.preventDefault();

                var delta = event.pageY - startY;
                startY += delta;
                moveY(delta * speedY);
                update();
            }

            function endDragX(e) {
                scope.dragging = false;
                scope.$apply();
                $document.off('mousemove', dragX);
                $document.off('mouseup', endDragX);
            }

            function endDragY(e) {
                scope.dragging = false;
                scope.$apply();
                $document.off('mousemove', dragY);
                $document.off('mouseup', endDragY);
            }

            function mousedown(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                scope.dragging = true;
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.one('mouseup', mouseup);
            }

            function mousemove(event) {
                event.preventDefault();
                if (scope.dragX) {
                    x = limitX(event.pageX - startX);
                    scrollX();
                }
                if (scope.dragY) {
                    y = limitY(event.pageY - startY);
                    scrollY();
                }
                update();
            }

            function mouseup() {
                scope.dragging = false;
                scope.$apply();
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }

            function mouseover(event) {
                scope.isActive = true;
                scope.$apply();
            }

            function mouseout(event) {
                scope.isActive = false;
                scope.$apply();
            }

            function touchstart(event) {
                var touch = getTouchEvent(event);
                $log.log('touchstart', touch);
                startX = touch.pageX - x;
                startY = touch.pageY - y;
                $document.on('touchmove', touchmove);
                $document.on('touchend', touchend);
            }

            function touchmove(event) {
                event.preventDefault();
                var touch = getTouchEvent(event);
                x = limitX(touch.pageX - startX);
                y = limitY(touch.pageY - startY);
                scrollY();
                scrollX();
                update();
            }

            function touchend(event) {
                $document.off('touchmove', touchmove);
                $document.off('touchend', touchend);
                $log.log('touchend.');
            }

            function getTouchEvent(event) {
                if (event.originalEvent != undefined) {
                    event = event.originalEvent;
                }
                if (!event.touches) {
                    return;
                }
                return event.touches[0]; //single touch
            }

            function moveX(distance) {
                x = limitX(x - distance);
                scrollX();
            }

            function moveY(distance) {
                y = limitY(y - distance);
                scrollY();
            }

            function scrollX() {
                var pos = {
                    left: x + 'px'
                };
                top.css(pos);
                content.css(pos);
            }

            function scrollY() {
                var yOffset = y + scope.topOffset; //left header
                header.css({
                    top: yOffset + 'px'
                });
                content.css({
                    top: y + 'px'
                });
            }

            function limitX(value) {
                //value is negative
                var limit = maxX();
                return Math.min(0, Math.max(-limit, value));
            }

            function limitY(value) {
                var limit = maxY();
                return Math.min(0, Math.max(-limit, value));
            }

            function maxX() {
                var limit = actualWidth() - inner.width();
                return limit;
            }

            function maxY() {
                var viewHeight = element.height();
                var height = actualHeight();
                return height - viewHeight;
            }

            function actualHeight() {
                var h = child.height();
                return h + scope.topOffset;
            }

            function actualWidth() {
                var h = top.children().width();
                var w = child.width();
                return Math.max(h, w);
            }

            function getTopOffset() {
                return Math.max(top.children().height(), corner.height());
            }

            function getBarPositionX() {
                var viewWidth = inner.width();
                var barSize = scope.scrollX.width;
                var max = viewWidth - barSize;
                var xMax = maxX();
                var ratio = -x / xMax;
                return Math.floor(ratio * max);
            }

            function getBarPositionY() {
                var height = element.height();
                var barSize = scope.scrollY.height;
                var offset = scope.topOffset;
                var max = height - barSize - offset;
                var yMax = maxY();
                var ratio = -y / yMax;
                return Math.floor(ratio * max);
            }

            function getScrollWidth() {
                var w = inner.width(); //.xy-inner width
                var len = actualWidth();
                return w * w / len;
            }

            function getScrollHeight() {
                var h = element.height() - top.height();
                var len = actualHeight();
                return h * h / len;
            }

            function getRatioX() {
                var viewLength = inner.width();
                var actualLength = actualWidth();
                return actualLength / viewLength;
            }

            function getRatioY() {
                var viewLength = element.height() - top.height();
                var actualLength = actualHeight();
                return actualLength / viewLength;
            }

            function update() {
                scope.x = x;
                scope.y = y;
                scope.scrollX.left = getBarPositionX();
                scope.scrollY.top = getBarPositionY();
                scope.$apply();
            }

            /** acceleration effect on mouse wheel */
            function accelerate() {
                if (accelerationTimer) {
                    //keep moving state
                    $timeout.cancel(accelerationTimer);
                    if (accelerationDelay) {
                        //keep acceleration
                        $timeout.cancel(accelerationDelay);
                    }
                    accelerationDelay = $timeout(function() {
                        speed += 0.1; //increase speed every 0.2s
                    }, 200);
                }
                accelerationTimer = $timeout(function() {
                    speed = 0.5;
                }, 400);

                return Math.min(speed, 1);
            }

        }
    };
}]);

angular.module('xyApp', ['xyScroll']).controller('xyCtrl', function($scope, $log) {
    var _this = this;
    this.isWorks = true
    this.x = 0;
    this.y = 0;
    this.status = 'it works!';
    this.fields = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    this.stuff = mockData();
    this.empty = function(){
        this.stuff = [];
        this.refresh();
    };
    this.random = function(){
        $log.debug('random new stuff..');
        var total = Math.floor(Math.random() * 30) + 1;
        this.stuff = mockData(total);
        this.refresh();
        $log.debug('total', this.stuff.length);
    };
    this.refresh = function(){
        $log.debug('refresh..');
        $scope.$broadcast('target.resize');
        $scope.$broadcast('target.reset');
    };

    function mockData(total) {
        total = total || 20;
        var data = [];
        for (var i = 0; i < total; ++i) {
            var item = {
                name: 'Item ' + i
            };
            for (var j = 0; j < _this.fields.length; j++) {
                item[j] = 'column ' + _this.fields[j] + i;
            }
            data.push(item);
        }
        return data;
    }
});