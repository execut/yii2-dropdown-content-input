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
     */
    public function render() {
        if ($this->isExpand) {
            $expandClass = ' expanded';
        } else {
            $expandClass = '';
        }

        echo Html::beginTag('div', [
            'class' => 'dropdown-content-container' . $expandClass,
        ]);
        if (is_callable($this->content)) {
            echo call_user_func($this->content);
        } else {
            echo $this->content;
        }

        echo Html::tag('div', '×', [
            'class' => 'caret'
        ]);
        echo Html::endTag('div');
    }
}