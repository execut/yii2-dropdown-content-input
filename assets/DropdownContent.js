/**
 * Created by execut on 07.10.14.
 */
$.widget("execut.dropdownContent", {
    inputEl: null,
    items: null,
    containerEl: null,
    scrolledContainer: null,
    options: {
        itemSelector: '.item',
        ignoredElementsSelector: '',
        isDisable: true,
        isFocus: true,
        isAllowFocus: true,
        isScroll: true,
        isFixed: false,
        isExpand: false,
    },
    _create: function () {
        var t = this;

        t._initElements();
        t._initEvents();
        t._initValue();
        t._checkDisable();
        t._initItems();
        if (t.containerEl.hasClass('expanded') || t.isExpanded() || t.isFixed()) {
            t.openContainer(true);
            if (t.options.isScroll) {
                if (t.inputEl.offset()) {
                    window.scroll(t.inputEl.offset().top, 0);
                }
            }
        } else {
            t.closeContainer();
            t._trigger('close');
        }

        t.initClearButtons();
        t._recalculateFixed();
    },
    _jsPaneApi: null,
    _initJsPane: function () {
        var t = this;
        if (!t._jsPaneApi) {
            var numbers = t.containerEl.css('max-height') ? t.containerEl.css('max-height').match(/\d+/) : false;
            if (numbers && Number(numbers[0]) <= t.containerEl.outerHeight()) {
                t._jsPaneApi = t.scrolledContainer.jScrollPane({
                    horizontal: false,
                    mouseWheelSpeed: 15,
                }).data('jsp');
            } else {
                t._jsPaneApi = false;
            }
        }
    },
    _recalculateFixed: function () {
        var t = this,
            el = t.element;
        if (t.isFixed()) {
            t.openContainer();
            el.addClass('fixed-content');
        } else {
            if (el.hasClass('fixed-content')) {
                t.closeContainer();
                el.removeClass('fixed-content');
            }
        }
    },
    _initElements: function () {
        var t = this,
            el = t.element;
        t.wrapperEl = el.find('.dropdown-wrapper');
        t.hiddenInput = t.wrapperEl.find('input[type=hidden]');
        t.inputEl = t.wrapperEl.find('input[type=text]');

        if (!t.options.isAllowFocus) {
            t.inputEl.focus(function () {
                t.inputEl.blur();
            });
        }
        t.containerEl = el.find('.dropdown-content-container');
        if (t.containerEl.find('.scrollable-content').length) {
            t.scrolledContainer = t.containerEl.find('.scrollable-content');
        } else {
            t.scrolledContainer = t.containerEl;
        }

        t.caretEl = [];
        if (t.wrapperEl.find('.controll-wrapper').length) {
            t.caretEl[t.caretEl.length] = t.wrapperEl.find('.controll-wrapper')[0];
        }

        if (t.containerEl.find('.caret').length) {
            t.caretEl[t.caretEl.length] = t.containerEl.find('.caret')[0];
        }
        t.caretEl = $(t.caretEl);

        t.formEl = t.inputEl.parents('form');
        t.formEls = t.formEl.find(':input:not(.tree-input):not(.kv-search-input):not(:button)');
        t.clearEl = t.element.find('.clear');
        t.wrapperEl.css('z-index', 0);
        $('label[for="' + t.hiddenInput.attr('id') + '"]').attr('for', t.inputEl.attr('id'));
    },
    _initValue: function () {
        var t = this,
            val = t._getHiddenInputVal();
        if (val) {
            t.inputEl.val(t.getItems().filter('[val="' + val + '"]').attr('text'));
        }
    },
    _getHiddenInputVal: function () {
        var t = this,
            val = t.hiddenInput.val();
        if (val) {
            val = val.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\$&");
        }

        return val;
    },
    getItems: function () {
        var t = this;
        return t.containerEl.find(t.options.itemSelector);
    },
    _initEvents: function () {
        var t = this;

        if (t.caretEl.length) {
            t.caretEl.click(function () {
                t.toggleContainer();
            });
        }

        t.inputEl.click(function () {
            if (t.isSkipFocus) {
                t.isSkipFocus = false;
            } else {
                if (t.options.isAllowFocus) {
                    t.openContainer();
                } else {
                    t.toggleContainer();
                }
            }
        });

        t.inputEl.keyup(function (e) {
            if (e.keyCode == 13) {
                t.getItems().filter('.selected').click();
            } else {
                t.openContainer();
                t.getItems().removeClass('selected');
                t.getItems().each(function (undefined, el) {
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

        $(document.body).click(function (event) {
            var isCaretEl = $(event.target).is(t.caretEl) || $(event.target).is(t.caretEl.children().first());
            if (!$(event.target).is(t.inputEl) && !$(event.target).is(t.containerEl) && (t.containerEl.has($(event.target)).length) == 0 && !isCaretEl) {
                t.closeContainer();
            }
        });

        t.clearEl.click(function () {
            t.clear();
        });

        t.hiddenInput.change(function () {
            t.initClearButtons();
        });

        t._initItemsEvents();
        for (var key = 0; key < t.options.depends.length; key++) {
            (function () {
                var depend = t.options.depends[key],
                    dependedEl = $('#' + depend);
                dependedEl.change(function () {
                    if (dependedEl.val() === '') {
                        t.clear();
                        t.disable();
                    } else {
                        t.reload(t._replaceElementName(dependedEl.attr('name')));
                    }
                });
            })();
        }


        $(window).scroll(function () {
            t._recalcContainerPosition();
        });

        $(window).resize(function () {
            t._recalculateFixed();
            t.reinitializeScroll();
        })
    },
    _recalcContainerPosition: function () {
        var t = this;
        if (!document || !document.defaultView || !t.element.hasClass('active') || !t.containerEl.length || !t.containerEl[0].ownerDocument || !t.containerEl.parent().length || !t.containerEl.parent()[0].ownerDocument) {
            return;
        }

        t.containerEl.css('top', '');

        var containerHeight = t.containerEl.outerHeight(true),
            containerTopPosition = t.containerEl.offset().top,
            inputHeight = t.inputEl.outerHeight(true),
            inputTopPosition = t.inputEl.offset().top,
            relativeOffset = -inputHeight,
            relativeElChild = t.containerEl;
        while (relativeElChild.length && relativeElChild.parent().css('position') !== 'relative') {
            relativeOffset = relativeElChild.height();
            relativeElChild = relativeElChild.parent();
        }

        if (!relativeElChild.length) {
            relativeOffset = 0;
        }
        
        if (relativeOffset > inputHeight) {
            relativeOffset = relativeOffset - t.element.outerHeight(true);
        } else {
            relativeOffset = 0;
        }

        var isHasTopPlace = inputTopPosition >= containerHeight,
            isHasBottomPlace = ($(window.top).height() - inputTopPosition + $(window).scrollTop() - inputHeight) > containerHeight,
            isHasTopSmallSpace = (inputTopPosition - $(window).scrollTop()) > (inputHeight + 82);
        if (((inputTopPosition - $(window).scrollTop() > $(window).scrollTop() + $(window.top).height() - inputTopPosition + inputHeight) || ((inputTopPosition - $(window).scrollTop()) > containerHeight && t.element.hasClass('topped'))) && isHasTopPlace) {
            t.containerEl.css('top', (-containerHeight + relativeOffset) + 'px');
            t.element.addClass('topped');
        } else {
            t.containerEl.css('top', '');
            t.element.removeClass('topped');
        }
    },
    initClearButtons: function () {
        var t = this;
        if (t.hiddenInput.val() === '') {
            t.clearEl.hide();
        } else {
            t.clearEl.show();
        }
    },
    clear: function () {
        var t = this;
        if (t.hiddenInput.val() !== '') {
            t._trigger('clear');
            t._setSelectedItemValues($());
            t.hiddenInput.change();
            t.closeContainer();
        }
    },
    _initItems: function () {
        var t = this;
        if (t.hiddenInput.val() && t.hiddenInput.val().length) {
            var currentEl = t.getItems().filter('*[val="' + t._getHiddenInputVal() + '"]').addClass('selected');
            if (!currentEl.length) {
                t.hiddenInput.val('');
                t.inputEl.val('');
            }
        }
    },
    _checkDisable: function () {
        var t = this;
        if (!t.getItems().length) {
            t.disable();
        } else {
            t.enable();
        }
    },
    reload: function (changedAttribute) {
        var t = this,
            data = t.serializeForm();
        data['Filter[changedAttribute]'] = changedAttribute;
        t.disable();
        $.get(t.options.ajaxUrl, data, function (data) {
            t.containerEl.children().remove();
            t.containerEl.html(data);
            t._initItemsEvents();
            t._checkDisable();
            t.inputEl.val('').trigger('change').change();
            t.hiddenInput.val('').trigger('change').change();
            if (data !== '') {
                t.enable();
                t.openContainer();
            }
        });
    },
    serializeForm: function () {
        var t = this,
            data = {},
            inputEl = t.formEls;

        inputEl.filter(function () {
            var el = jQuery(this),
                elName = el.attr('name');
            elName = t._replaceElementName(elName);
            data[elName] = el.val();
        });

        for (var key in data) {
            if (data[key] == '' || data[key] === null) {
                delete data[key];
            }
        }

        return data;
    },
    _replaceElementName: function (elName) {
        var t = this;
        elName = elName.replace(t.options.formName, 'Filter', elName);

        return elName;
    },
    disable: function () {
        var t = this;
        if (t.options.isDisable) {
            t.inputEl.val('');
            t.hiddenInput.val('').change();
            t.getItems().removeClass('selected');
            t.inputEl.attr('disabled', 'disabled');
            t.element.attr('disabled', 'disabled');
        }
    },
    enable: function () {
        var t = this;
        t.inputEl.attr('disabled', false);
        t.element.attr('disabled', false);
    },
    _initItemsEvents: function () {
        var t = this;
        t.containerEl.on('click', t.options.itemSelector, function (e) {
            var $item = $(this),
                $target = $(e.target),
                oldValue = t.hiddenInput.val();
            if (!$item.is(t.options.itemSelector)) {
                return false;
            }

            if (t.options.ignoredElementsSelector.length && ($target.is(t.options.ignoredElementsSelector) || $item.is(t.options.ignoredElementsSelector))) {
                return false;
            }

            t._setSelectedItemValues($item);
            t.closeContainer();
            if (oldValue !== t.hiddenInput.val()) {
                t.hiddenInput.change();
            }

            return false;
        });
    },
    _setSelectedItemValues: function ($item) {
        var t = this,
            val = $item.attr('val'),
            name = $item.attr('text');
        t.getItems().removeClass('selected');
        $item.addClass('selected');
        t.inputEl.val(name);
        var oldVal = t.hiddenInput.val();
        if (oldVal !== val) {
            t.hiddenInput.val(val);
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
    openContainer: function (isFromCreate) {
        var t = this;
        t._trigger('open', null, {
            isFromCreate: isFromCreate,
        });
        t.containerEl.show();
        if (!t.isFixed()) {
            t.element.addClass('active');
        }

        if (!t.inputEl.is(":focus")) {
            if (t.options.isAllowFocus) {
                t.isSkipFocus = true;
            }

            if (t.options.isFocus) {
                t.inputEl.focus();
            }
        }

        if (t.element.css('position') === 'fixed') {
            $(document.body).css('overflow', 'hidden');
        }

        t._recalcContainerPosition();
        t._initJsPane();
        t.reinitializeScroll();
    },
    reinitializeScroll: function () {
        var t = this;
        if (t._jsPaneApi) {
            t._jsPaneApi.reinitialise();
        }
    },
    isExpanded: function () {
        var t = this;
        if (t.options.isExpand.length !== false) {
            if (t.options.isExpand['method'] === 'width') {
                if (t.options.isExpand['width'] <= $(window).width()) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        return t.options.isExpand;
    },
    isFixed: function () {
        var t = this;
        if (t.options.isFixed.length !== false) {
            if (t.options.isFixed['method'] === 'width') {
                if (t.options.isFixed['width'] <= $(window).width()) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        return t.options.isFixed;
    },
    _escapeRegExp: function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    closeContainer: function () {
        var t = this,
            selectedEl = t.getItems().filter('.selected');
        if (t.isFixed()) {
            return;
        }

        t.element.removeClass('topped');
        if (t.element.css('position') === 'fixed') {
            $(document.body).css('overflow', 'scroll');
        }

        t.wrapperEl.css('z-index', 0);
        if (t.containerEl.is(':visible')) {
            t.element.removeClass('active');
            if (selectedEl.length) {
                t._setSelectedItemValues(selectedEl);
            } else {
                var isChanged = t.inputEl.val() !== '';
                t.inputEl.val('');
                t.hiddenInput.val('');
                if (isChanged) {
                    t.hiddenInput.change();
                }
            }

            t.containerEl.hide();
            t._trigger('close');
        }

        t._recalcContainerPosition();
    },
});
