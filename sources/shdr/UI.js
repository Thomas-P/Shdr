// Generated by CoffeeScript 1.4.0
(function() {
  var UI;

  UI = (function() {

    UI.ERROR = 0;

    UI.SUCCESS = 1;

    UI.WARNING = 2;

    UI.INFO = 3;

    function UI(app) {
      this.app = app;
      this.initStatus();
      this.initSnippets();
      this.initModels();
      this.initMenus();
      this.initToggles();
      this.initButtons();
      this.initBoxes();
    }

    UI.prototype.hideMainLoader = function() {
      return $('#main-loader').fadeOut(400);
    };

    UI.prototype.showModelLoader = function() {
      return $('#model-loader').fadeIn(200);
    };

    UI.prototype.hideModelLoader = function() {
      return $('#model-loader').fadeOut(400);
    };

    UI.prototype.displayWebGLError = function() {
      return $('#main-loader div').text('WebGL support missing.');
    };

    UI.prototype.initStatus = function() {
      var content, el, icon, span;
      el = $('#status');
      span = el.children('span');
      icon = span.children('i');
      content = span.children('b');
      return this.status = {
        container: el,
        span: span,
        icon: icon,
        content: content
      };
    };

    UI.prototype.initBoxes = function() {
      var shareurl, shortenurl,
        _this = this;
      this.boxes = {
        share: $('#box-share'),
        about: $('#box-about')
      };
      $('.box .close').on('click', function(e) {
        return $(this).parent().fadeOut(200);
      });
      shareurl = this.boxes.share.find('#box-share-url');
      shortenurl = this.boxes.share.find('#box-share-shorten');
      shareurl.on('click', function(e) {
        return $(this).select();
      });
      return shortenurl.on('click', function(e) {
        shortenurl.text('Wait...');
        return _this.app.shortenURL(shareurl.val(), function(status, url, resp) {
          if (status && url) {
            _this.boxes.share.find('#box-share-url').val(url);
          }
          return shortenurl.text('Shorten');
        });
      });
    };

    UI.prototype.initButtons = function() {
      var _this = this;
      this.inputs = {
        savename: $('#save-name')
      };
      this.inputs.savename.on('click', function(e) {
        e.stopPropagation();
        $(_this).focus();
        return false;
      });
      return $('.menu-button').on('click', function(e) {
        return _this.onButton(e);
      });
    };

    UI.prototype.initToggles = function() {
      var _this = this;
      return $('.menu-toggle').on('click', function(e) {
        return _this.onToggle(e);
      });
    };

    UI.prototype.initMenus = function() {
      var _this = this;
      $('.menu-trigger').on('click.on', function(e) {
        return _this.onMenuTrigger(e);
      });
      return $('.menu-item').on('click', function(e) {
        return _this.onMenuItem(e);
      });
    };

    UI.prototype.initSnippets = function() {
      var button, key, list;
      list = $('#menu-snippets .menu-list');
      button = $('<button>').addClass('menu-item');
      for (key in shdr.Snippets) {
        list.append(button.clone().text(key));
      }
      return false;
    };

    UI.prototype.initModels = function() {
      var button, key, list, model, _ref;
      list = $('#menu-models .menu-list');
      button = $('<button>').addClass('menu-item');
      _ref = shdr.Models;
      for (key in _ref) {
        model = _ref[key];
        list.append(button.clone().text(model.name).attr('data-index', key));
      }
      return false;
    };

    UI.prototype.setStatus = function(message, type) {
      if (type == null) {
        type = UI.ERROR;
      }
      this.status.span.removeClass();
      this.status.icon.removeClass();
      switch (type) {
        case UI.ERROR:
          this.status.span.addClass('status-error');
          this.status.icon.addClass('icon-exclamation-sign');
          break;
        case UI.SUCCESS:
          this.status.span.addClass('status-success');
          this.status.icon.addClass('icon-ok-sign');
          break;
        case UI.WARNING:
          this.status.span.addClass('status-warning');
          this.status.icon.addClass('icon-warning-sign');
          break;
        case UI.INFO:
          this.status.span.addClass('status-info');
          this.status.icon.addClass('icon-info-sign');
      }
      return this.status.content.text(message);
    };

    UI.prototype.setMenuMode = function(mode) {
      var el, item;
      el = $('#menu-mode');
      item = el.find("button[data-index=" + mode + "]");
      if (item) {
        el.find('.menu-trigger').children('span').text(item.text());
      }
      return mode;
    };

    UI.prototype.onToggle = function(event) {
      var el, ico, root, state, _name;
      el = $(event.target);
      root = el.parent();
      ico = el.children('i');
      state = el.attr('data-current') === el.attr('data-off');
      if (state === true) {
        el.attr('data-current', el.attr('data-on'));
        ico.removeClass(ico.attr('data-off'));
        ico.addClass(ico.attr('data-on'));
      } else {
        el.attr('data-current', el.attr('data-off'));
        ico.removeClass(ico.attr('data-on'));
        ico.addClass(ico.attr('data-off'));
      }
      if (typeof this[_name = root.attr('data-action') + 'Action'] === "function") {
        this[_name](state, null, el);
      }
      return this.app.editor.focus();
    };

    UI.prototype.onButton = function(event) {
      var el, root, _name;
      el = $(event.target);
      root = el.parent();
      if (typeof this[_name = root.attr('data-action') + 'Action'] === "function") {
        this[_name](null, null, el);
      }
      return el.blur();
    };

    UI.prototype.onMenuTrigger = function(event) {
      var el, list, root,
        _this = this;
      el = $(event.target);
      root = el.parent();
      list = root.children('.menu-list');
      el.addClass('open');
      list.slideDown(200);
      $(document).on('click.menu-trigger', function() {
        return _this.offMenuTrigger(el, list);
      });
      el.off('click.on');
      el.on('click.off', function(e) {
        return _this.offMenuTrigger(el, list);
      });
      return event.stopPropagation();
    };

    UI.prototype.offMenuTrigger = function(el, list) {
      var _this = this;
      el.removeClass('open');
      el.off('click.off');
      el.blur();
      el.on('click.on', function(e) {
        return _this.onMenuTrigger(e);
      });
      list.slideUp(200);
      $(document).off('click.menu-trigger');
      return this.app.editor.focus();
    };

    UI.prototype.onMenuItem = function(event) {
      var el, index, item, list, root, _name;
      item = $(event.target);
      list = item.parent();
      root = list.parent();
      el = root.children('.menu-trigger');
      index = item.attr('data-index');
      if (typeof this[_name = root.attr('data-action') + 'Action'] === "function") {
        this[_name](index, item, el);
      }
      this.offMenuTrigger(el, list);
      return event.stopPropagation();
    };

    UI.prototype.updateAction = function(index, item, trigger) {
      trigger.html(item.html());
      return this.app.setUpdateMode(index);
    };

    UI.prototype.snippetsAction = function(index, item, trigger) {
      var code;
      code = shdr.Snippets[item.text()];
      if (code != null) {
        return this.app.editor.insert(code);
      }
    };

    UI.prototype.modelsAction = function(index, item, trigger) {
      trigger.children('span').text(item.text());
      return this.app.viewer.loadModel(index);
    };

    UI.prototype.modeAction = function(index, item, trigger) {
      trigger.children('span').text(item.text());
      return this.app.setMode(index);
    };

    UI.prototype.rotateAction = function(state) {
      return this.app.viewer.rotate = state;
    };

    UI.prototype.shareAction = function() {
      var url;
      this.app.updateDocument();
      url = this.app.packURL();
      this.boxes.share.find('#box-share-url').val(url);
      return this.boxes.share.fadeIn(200);
    };

    UI.prototype.downloadAction = function() {
      return this.app.download();
    };

    UI.prototype.aboutAction = function() {
      return this.boxes.about.fadeIn(200);
    };

    UI.prototype.helpAction = function() {
      var win;
      win = window.open('https://github.com/BKcore/Shdr/wiki/Help', '_blank');
      if (win) {
        return win.focus();
      } else {
        return this.ui.setStatus('Your browser as blocked the Help window, please disable your popup blocker.', shdr.UI.WARNING);
      }
    };

    UI.prototype.saveAction = function(_, __, el) {
      var menuname;
      menuname = $('#menu-name');
      if (!menuname.is(':visible')) {
        menuname.fadeIn(200);
        this.inputs.savename.val('Untitled');
        return this.setStatus('Please enter a file name, then hit the save button once again.', UI.INFO);
      } else {
        return this.app.save(this.inputs.savename.val());
      }
    };

    return UI;

  })();

  this.shdr || (this.shdr = {});

  this.shdr.UI = UI;

}).call(this);
