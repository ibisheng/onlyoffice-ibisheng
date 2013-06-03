/**
 * Created by JetBrains WebStorm.
 * User: Alexey.Musinov
 * Date: 15.09.11
 * Time: 14:10
 * To change this template use File | Settings | File Templates.
 */
/*
  popupmenu2.js - simple JavaScript popup menu library.

  Copyright (C) 2009 Jiro Nishiguchi <jiro@cpan.org> All rights reserved.
  This is free software with ABSOLUTELY NO WARRANTY.

  You can redistribute it and/or modify it under the modified BSD license.

  Usage:
    var popup = new PopupMenu();
    popup.add(menuText, function(target){ ... });
    popup.addSeparator();
    popup.bind('targetElement');
    popup.bind(); // target is document;
*/

var PopupMenu2 = function() {
    this.init();
};

PopupMenu2.SEPARATOR = "PopupMenu2.SEPARATOR";
PopupMenu2.current = null;
PopupMenu2.addEventListener = function(element, name, observer, capture) {
    if (typeof element == 'string') {
        element = document.getElementById(element);
    }
    if (element.addEventListener) {
        element.addEventListener(name, observer, capture);
    } else if (element.attachEvent) {
        element.attachEvent('on' + name, observer);
    }
};

PopupMenu2.prototype = {
    init: function() {
        this.items  = [];
        this.width  = 0;
        this.height = 0;
        this.mouseX = 0;
        this.mouseY = 0;
    },
    setSize: function(width, height) {
        this.width  = width;
        this.height = height;
        if (this.element) {
            var self = this;
            with (this.element.style) {
                if (self.width)  width  = self.width  + 'px';
                if (self.height) height = self.height + 'px';
            }
        }
    },
    bind: function(element) {
        var self = this;
        if (!element) {
            element = document;
        } else if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        this.target = element;
        this.target.oncontextmenu = function(e) {
            self.show.call(self, e);
            return false;
        };
        var listener = function() { self.hide.call(self) };
        PopupMenu2.addEventListener(document, 'click', listener, true);
    },
    add: function(text, callback) {
        this.items.push({ text: text, callback: callback });
    },
    addSeparator: function() {
        this.items.push(PopupMenu2.SEPARATOR);
    },
    setPos: function(e) {
        if (!this.element) return;
        if (!e) e = window.event;
        var x, y;
        if (window.opera) {
            x = e.clientX;
            y = e.clientY;
        } else if (document.all) {
            x = document.body.scrollLeft + event.clientX;
            y = document.body.scrollTop + event.clientY;
        } else if (document.layers || document.getElementById) {
            x = e.pageX;
            y = e.pageY;
        }
        this.element.style.top  = y + 'px';
        this.element.style.left = x + 'px';
        this.mouseX = x;
        this.mouseY = y;
    },
    show: function(e) {
        if (PopupMenu2.current && PopupMenu2.current != this) return;
        PopupMenu2.current = this;
        if (this.element) {
            this.setPos(e);
            this.element.style.display = '';
        } else {
            this.element = this.createMenu(this.items);
            this.setPos(e);
            document.body.appendChild(this.element);
        }
    },
    hide: function() {
        PopupMenu2.current = null;
        if (this.element) this.element.style.display = 'none';
    },
    createMenu: function(items) {
        var self = this;
        var menu = document.createElement('div');
        with (menu.style) {
            if (self.width)  width  = self.width  + 'px';
            if (self.height) height = self.height + 'px';
            border     = "1px solid gray";
            background = '#FFFFFF';
            color      = '#0F0F0F';
            position   = 'absolute';
            display    = 'block';
            padding    = '2px';
            cursor     = 'default';
            fontSize   = "10pt";
        }
        for (var i = 0; i < items.length; i++) {
            var item;
            if (items[i] == PopupMenu2.SEPARATOR) {
                item = this.createSeparator();
            } else {
                item = this.createItem(items[i]);
            }
            menu.appendChild(item);
        }
        return menu;
    },
    createItem: function(item) {
        var self = this;
        var elem = document.createElement('div');
        elem.style.padding = '2px';
        var callback = item.callback;
        PopupMenu2.addEventListener(elem, 'click', function(_callback) {
            return function() {
                self.hide();
                _callback(self.target);
            };
        }(callback), true);
        PopupMenu2.addEventListener(elem, 'mouseover', function(e) {
            elem.style.background = '#B6BDD2';
        }, true);
        PopupMenu2.addEventListener(elem, 'mouseout', function(e) {
            elem.style.background = '#FFFFFF';
        }, true);
        elem.appendChild(document.createTextNode(item.text));
        return elem;
    },
    createSeparator: function() {
        var sep = document.createElement('div');
        with (sep.style) {
            borderTop = '1px dotted #CCCCCC';
            fontSize  = '0px';
            height    = '0px';
        }
        return sep;
    }
};