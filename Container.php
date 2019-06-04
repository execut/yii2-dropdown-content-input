<?php
namespace execut\widget\dropdownContent;


use yii\base\Component;
use yii\helpers\Html;

/**
 * Container for render custom content
 *
 * @property string $size Widget size mode TreeView::SIZE_SMALL | TreeView::SIZE_MIDDLE | TreeView::SIZE_NORMAL
 * @property string $dataProvider DataProvider
 * @property boolean $isExpand Expand dropdown after load
 *
 * @author eXeCUT
 */
class Container extends Component
{
    /**
     * Widget owner
     *
     * @var DropdownContent
     */
    public $owner = null;

    /**
     * Dropdown content or callback for render it
     *
     * @var string|Closure
     */
    public $content = '';

    /**
     * Is expand on load flag
     *
     * @var bool
     */
    public $isExpand = false;

    /**
     * Render container
     *
     * @return string
     */
    public function render() {
        if ($this->isExpand) {
            $expandClass = ' expanded';
        } else {
            $expandClass = '';
        }

        $result = Html::beginTag('div', [
            'class' => 'dropdown-content-container' . $expandClass,
            'id' => $this->owner->options['id'] . '-container',
        ]);

        if (is_callable($this->content)) {
            $result .= call_user_func($this->content);
        } else {
            $result .= $this->content;
        }

        if ($this->owner->clearButtonPosition === DropdownContent::CLEAR_BUTTON_POSITION_CONTAINER) {
            $result .= Html::tag('div', 'Сбросить', [
                'class' => 'clear clear-button'
            ]);
        } else {
            $result .= Html::tag('div', '×', [
                'class' => 'caret'
            ]);
        }

        $result .= Html::endTag('div');

        return $result;
    }
}