import React, { useRef, useEffect } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var ImageMapper = function (_a) {
    var src = _a.src, map = _a.map, _b = _a.fillColor, fillColor = _b === void 0 ? 'rgba(255, 255, 255, 0.5)' : _b, _c = _a.strokeColor, strokeColor = _c === void 0 ? 'rgba(0, 0, 0, 0.5)' : _c, _d = _a.lineWidth, lineWidth = _d === void 0 ? 1 : _d, width = _a.width, height = _a.height, active = _a.active, imgWidth = _a.imgWidth, onLoad = _a.onLoad, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, onMouseMove = _a.onMouseMove, onImageClick = _a.onImageClick, onImageMouseMove = _a.onImageMouseMove;
    var absPos = { position: 'absolute', top: 0, left: 0 };
    var styles = {
        container: { position: 'relative' },
        canvas: __assign(__assign({}, absPos), { pointerEvents: 'none', zIndex: 2 }),
        img: __assign(__assign({}, absPos), { zIndex: 1, userSelect: 'none' }),
        map: (onClick && { cursor: 'pointer' }) || undefined
    };
    var img = useRef(null);
    var container = useRef(null);
    var canvas = useRef(null);
    useEffect(function () {
        initCanvas();
    }, [src, map, fillColor, strokeColor, lineWidth, width, height, active, imgWidth]);
    var drawrect = function (coords, fillColor, lineWidth, strokeColor) {
        var _a;
        var left = coords[0], top = coords[1], right = coords[2], bot = coords[3];
        var ctx = (_a = canvas.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(left, top, right - left, bot - top);
        ctx.fillRect(left, top, right - left, bot - top);
        ctx.fillStyle = fillColor;
    };
    var drawcircle = function (coords, fillColor, lineWidth, strokeColor) {
        var _a;
        var ctx = (_a = canvas.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = fillColor;
    };
    var drawpoly = function (coords, fillColor, lineWidth, strokeColor) {
        var _a;
        var coords1 = coords.reduce(function (a, _, i, s) { return (i % 2 ? a : __spreadArrays(a, [s.slice(i, i + 2)])); }, []);
        var ctx = (_a = canvas.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        coords1.forEach(function (c) { return ctx.lineTo(c[0], c[1]); });
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = fillColor;
    };
    var initCanvas = function () {
        if (!canvas.current || !img.current || !container.current) {
            return;
        }
        if (width)
            img.current.width = width;
        if (height)
            img.current.height = height;
        canvas.current.width = width || img.current.clientWidth;
        canvas.current.height = height || img.current.clientHeight;
        container.current.style.width = (width || img.current.clientWidth) + 'px';
        container.current.style.height = (height || img.current.clientHeight) + 'px';
        var ctx = canvas.current.getContext('2d');
        if (!ctx)
            return;
        ctx.fillStyle = fillColor;
        if (onLoad)
            onLoad();
        renderPrefilledAreas();
    };
    var hoverOn = function (_a) {
        var area = _a.area, index = _a.index, event = _a.event;
        var _b;
        var shape = (_b = event.target) === null || _b === void 0 ? void 0 : _b.getAttribute('shape');
        if (!shape)
            return;
        if (active && ['draw' + shape]) {
            drawArea(area);
        }
        if (onMouseEnter)
            onMouseEnter(area, index, event);
    };
    var hoverOff = function (_a) {
        var area = _a.area, index = _a.index, event = _a.event;
        var _b;
        if (active && canvas.current) {
            var ctx = (_b = canvas.current) === null || _b === void 0 ? void 0 : _b.getContext('2d');
            if (!ctx)
                return;
            ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
            renderPrefilledAreas();
        }
        if (onMouseLeave)
            onMouseLeave(area, index, event);
    };
    var click = function (_a) {
        var area = _a.area, index = _a.index, event = _a.event;
        if (onClick) {
            event.preventDefault();
            onClick(area, index, event);
        }
    };
    var imageClick = function (event) {
        if (onImageClick) {
            event.preventDefault();
            onImageClick(event);
        }
    };
    var mouseMove = function (_a) {
        var area = _a.area, index = _a.index, event = _a.event;
        if (onMouseMove) {
            onMouseMove(area, index, event);
        }
    };
    var imageMouseMove = function (event) {
        if (onImageMouseMove) {
            onImageMouseMove(event);
        }
    };
    var scaleCoords = function (coords) {
        // calculate scale based on current 'width' and the original 'imgWidth'
        var scale = width && imgWidth && imgWidth > 0 ? width / imgWidth : 1;
        return coords.map(function (coord) { return coord * scale; });
    };
    var renderPrefilledAreas = function () {
        map.areas.map(function (area) {
            if (!area.preFillColor)
                return;
            drawArea(area);
        });
    };
    var drawArea = function (area) {
        switch (area.shape) {
            case 'rect':
                drawrect(scaleCoords(area.coords), area.preFillColor || fillColor, area.lineWidth || lineWidth, area.strokeColor || strokeColor);
                break;
            case 'circle':
                drawcircle(scaleCoords(area.coords), area.preFillColor || fillColor, area.lineWidth || lineWidth, area.strokeColor || strokeColor);
                break;
            case 'poly':
                drawpoly(scaleCoords(area.coords), area.preFillColor || fillColor, area.lineWidth || lineWidth, area.strokeColor || strokeColor);
                break;
        }
    };
    var computeCenter = function (area) {
        if (!area)
            return [0, 0];
        var scaledCoords = scaleCoords(area.coords);
        switch (area.shape) {
            case 'circle':
                return [scaledCoords[0], scaledCoords[1]];
            case 'poly':
            case 'rect':
            default: {
                // Calculate centroid
                var n_1 = scaledCoords.length / 2;
                var _a = scaledCoords.reduce(function (_a, val, idx) {
                    var y = _a.y, x = _a.x;
                    return !(idx % 2) ? { y: y, x: x + val / n_1 } : { y: y + val / n_1, x: x };
                }, { y: 0, x: 0 }), y = _a.y, x = _a.x;
                return [x, y];
            }
        }
    };
    var renderAreas = function () {
        return map.areas.map(function (area, index) {
            var scaledCoords = scaleCoords(area.coords);
            var center = computeCenter(area);
            var extendedArea = __assign(__assign({}, area), { scaledCoords: scaledCoords, center: center });
            return (React.createElement("area", { key: area._id || index, shape: area.shape, coords: scaledCoords.join(','), onMouseEnter: function (event) {
                    return hoverOn({
                        area: extendedArea,
                        index: index,
                        event: event
                    });
                }, onMouseLeave: function (event) {
                    return hoverOff({
                        area: extendedArea,
                        index: index,
                        event: event
                    });
                }, onMouseMove: function (event) {
                    return mouseMove({
                        area: extendedArea,
                        index: index,
                        event: event
                    });
                }, onClick: function (event) {
                    return click({
                        area: extendedArea,
                        index: index,
                        event: event
                    });
                }, href: area.href }));
        });
    };
    return (React.createElement("div", { style: styles.container, ref: container },
        React.createElement("img", { style: styles.img, src: src, useMap: "#" + map.name, alt: '', ref: img, onClick: imageClick, onMouseMove: imageMouseMove }),
        React.createElement("canvas", { ref: canvas, style: styles.canvas }),
        React.createElement("map", { name: map.name, style: styles.map }, renderAreas())));
};

export { ImageMapper };
//# sourceMappingURL=index.es.js.map
