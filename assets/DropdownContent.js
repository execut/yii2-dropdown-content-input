/**
 * Created by execut on 07.10.14.
 */
$.widget("execut.dropdownContent", {
    inputEl: null,
    items: null,
    containerEl: null,
    _create: function () {
        var t = this;

        t._initElements();
        t._initEvents();
        t._initValue();
        t._checkDisable();
        t._initItems();
        if (t.containerEl.hasClass('expanded')) {
            t.openContainer();
            t.inputEl.focus();
        }
        //else {
        //    t.containerEl.hide();
        //}
    },
    _initElements: function () {
        var t = this,
            el = t.element;
        t.inputEl = el.next();
        t.containerEl = t.inputEl.parent().next();
        t.items = t.containerEl.find('.item');
        t.caretEl = t.inputEl.next();
        t.formEl = t.inputEl.parents('form');
        t.formEls = t.formEl.find(':input:not(.tree-input):not(.kv-search-input)')
        t.clearEl = t.caretEl.find('.clear');
        t.element.parent().css('z-index', 0);
    },
    _initValue: function () {
        var t = this,
            el = t.element,
            val = el.val();
        if (val) {
            t.inputEl.val(t.items.filter('[val=' + val + ']').attr('text'));
        }
    },
    _initEvents: function () {
        var t = this;
        //if (typeof t.options.dependedEls !== 'undefined') {
        //    $(t.options.dependedEls).each(function (undefined, id) {
        //        var dependedEl = $(id);
        //        dependedEl.change(function () {
        //            if (dependedEl.val()) {
        //                t.disable();
        //                t.reload();
        //            } else {
        //                t.disable();
        //            }
        //        });
        //        //dependedEl.dropdownContent('addRelatedElement', t);
        //    });
        //}

        t.caretEl.click(function () {
            t.toggleContainer();
        });

        t.inputEl.focus(function () {
            if (t.isSkipFocus) {
                t.isSkipFocus = false;
            } else {
                t.openContainer();
            }
        });

        t.inputEl.keyup(function (e) {
            if (e.keyCode == 13) {
                t.items.filter('.selected').click();
            } else {
                t.openContainer();
                t.items.removeClass('selected');
                t.items.each(function (undefined, el) {
                    var $el = $(el),
                        text = $el.text().toLowerCase(),
                        currVal = t.inputEl.val().toLowerCase();
                    if (currVal.length == 0) {
                        return false;
                    }

                    if (text.match(new RegExp('^' + t._escapeRegExp(currVal)))) {
                        $el.addClass('selected');
                        return false;
                    }
                });
            }
        });

        //t.element.change(function () {
        //    var val = t.element.val();
        //    $(t._relatedElements).each(function (key, el) {
        //    });
        //});

        $(document.body).click(function (event) {
            if (!$(event.target).is(t.inputEl) && !$(event.target).is(t.containerEl) && !$(event.target).is(t.caretEl) && !$(event.target).is(t.caretEl.children().first())) {
                t.closeContainer();
            }
        });

        t.clearEl.click(function () {
            t.clear();
        });

        t._initItemsEvents();
    },
    clear: function () {
        var t = this;
        if (t.element.val() !== '') {
            t._setSelectedItemValues($());
            t.element.change();
        }
    },
    _initItems: function () {
        var t = this;
        if (t.element.val().length) {
            var currentEl = t.items.filter('*[val=' + t.element.val() + ']').addClass('selected');
            if (!currentEl.length) {
                t.element.val('');
                t.inputEl.val('');
            }
        }
    },
    _checkDisable: function () {
        var t = this;
        if (!t.items.length) {
            t.disable();
        } else {
            t.enable();
        }
    },
    reload: function () {
        var t = this;
        $.get(t.options.ajaxUrl, t.serializeForm(), function (data) {
            t.containerEl.children().remove();
            t.containerEl.html(data);
            t.items = t.containerEl.find('.item');
            t._initItemsEvents();
            t._checkDisable();
        });
    },
    serializeForm: function () {
        var t = this,
            data = {},
            inputEl = t.formEls;

        inputEl.filter(function () {
            var el = jQuery(this),
                elName = el.attr('name');
            data[elName] = el.val();
        });

        for (var key in data) {
            if (data[key] == '' || data[key] === null) {
                delete data[key];
            }
        }

        return data;
    },
    disable: function () {
        var t = this;
        t.inputEl.val('');
        t.element.val('').change();
        t.items.removeClass('selected');
        t.inputEl.attr('disabled','disabled');
        t.element.attr('disabled','disabled');
    },
    enable: function () {
        var t = this;
        t.inputEl.attr('disabled', false);
        t.element.attr('disabled', false);
    },
    //_relatedElements: [],
    //addRelatedElement: function (el) {
    //    var t = this;
    //    t._relatedElements[t._relatedElements.length] = el;
    //},
    _initItemsEvents: function () {
        var t = this;
        t.items.click(function () {
            var $item = $(this),
                oldValue = t.element.val()
            t._setSelectedItemValues($item);
            t.closeContainer();
            if (oldValue !== t.element.val()) {
                t.element.change();
            }

            return false;
        });
    },
    _setSelectedItemValues: function ($item) {
        var t = this,
            val = $item.attr('val'),
            name = $item.attr('text');
        t.items.removeClass('selected');
        $item.addClass('selected');
        t.inputEl.val(name);
        var oldVal = t.element.val();
        if (oldVal !== val) {
            t.element.val(val);
        }
    },
    toggleContainer: function () {
        var t = this;
        if (t.containerEl.is(':visible')) {
            t.closeContainer();
        } else {
            t.openContainer();
        }
    },
    isSkipFocus: false,
    openContainer: function () {
        var t = this;
        t.containerEl.show();
        t.inputEl.addClass('active');
        if (!t.inputEl.is(":focus")) {
            t.isSkipFocus = true;
            t.inputEl.focus();
        }

        t.caretEl.addClass('active');
        t.element.parent().css('z-index', 100);
        t.containerEl.css('z-index', 10);
    },
    _escapeRegExp: function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    closeContainer: function () {
        var t = this,
            selectedEl = t.items.filter('.selected');
        t.element.parent().css('z-index', 0);
        if (t.containerEl.is(':visible')) {
            t.caretEl.removeClass('active');
            if (selectedEl.length) {
                t._setSelectedItemValues(selectedEl);
            } else {
                var isChanged = t.inputEl.val() !== '';
                t.inputEl.val('');
                t.element.val('');
                if (isChanged) {
                    t.inputEl.change();
                }
            }

            t.containerEl.hide();
            t.inputEl.removeClass('active');
            t._trigger('close');
        }
    },
});