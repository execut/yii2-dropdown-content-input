<?php
namespace execut\widget\dropdownContent;


use nsept\jscrollpane\assets\JScrollPaneAsset;
use nsept\mousewheel\MousewheelAsset;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\jui\InputWidget;

/**
 * Widget for render custom dropdown
 *
 * @author eXeCUT
 */
class DropdownContent extends InputWidget
{
    const CLEAR_BUTTON_POSITION_INPUT = 1;
    const CLEAR_BUTTON_POSITION_CONTAINER = 2;
    public $clearButtonPosition = self::CLEAR_BUTTON_POSITION_CONTAINER;

    public $isAllowFocus = true;

    public $isFixed = false;

    /**
     * Options for container object
     *
     * @var array
     */
    public $containerOptions = [];

    /**
     * Template for render widget
     *
     * @var string
     */
    public $template = '{input}{container}';

    /**
     * Html options for html input of dropdown
     *
     * @var array
     */
    public $inputOptions = [];

    /**
     * Ids of depends inputs. Then it's changed, dropdown content is being reloaded
     *
     * @var array
     */
    public $depends = [];

    public $ajaxUrl = null;

    /**
     * Renders the widget.
     */
    public function run()
    {
        DropdownContentAsset::register($this->view);
        JScrollPaneAsset::register($this->view);
        MousewheelAsset::register($this->view);
        $parts = [
            '{input}' => $this->renderWidget(),
            '{container}' =>  $this->renderContainer()
        ];

        $result = strtr($this->template, $parts);
        $options = [
            'id' => $this->id,
        ];
        Html::addCssClass($options, 'dropdown-content');

        echo Html::tag('div', $result, $options);

        $this->registerWidget('dropdownContent', $this->id);
    }

    /**
     * Render container
     *
     * @return string
     */
    public function renderContainer() {
        return $this->getContainer()->render();
    }

    /**
     * Get dropdown container
     *
     * @return Container
     */
    public function getContainer() {
        $container = \yii::createObject(array_merge([
            'class' => Container::class,
        ], $this->containerOptions, [
            'owner' => $this,
        ]));

        return $container;
    }

    /**
     * Renders the dropdown widget.
     *
     * @return string the rendering result.
     */
    public function renderWidget()
    {
        $class = '';
        if ($this->isAllowFocus) {
            $class = ' allow-focus';
        }

        $result = '<div class="dropdown-wrapper' . $class . '">';
        $options = [
            'autocomplete' => 'off'
        ];
        $depends = $this->depends;
        foreach ($depends as $key => $depend) {
            $depends[$key] = Html::getInputId($this->model, $depend);
        }

        $this->clientOptions = ArrayHelper::merge([
            'depends' => $depends,
            'ajaxUrl' => $this->ajaxUrl,
            'formName' => $this->model->formName(),
            'isAllowFocus' => $this->isAllowFocus,
            'isFixed' => $this->isFixed,
        ], $this->clientOptions);
        if ($this->hasModel()) {
            if ($this->value !== null) {
                $options['value'] = $this->value;
            }

            $result .= Html::activeHiddenInput($this->model, $this->attribute, $options);
            $id = Html::getInputId($this->model, $this->attribute);
        } else {
            $result .= Html::hiddenInput($this->name, $this->value, $options);
            $id = $this->id . '-hiddeninput';
        }

        $result .= Html::textInput($this->id . '_input', null, array_merge([
            'class' => [
                'form-control'
            ],
            'autocomplete' => 'off',
        ], $this->inputOptions, [
                'id' => $id . '-input',
            ])) . '<div class="controll-wrapper">' . $this->renderCarret() . $this->renderClearButton() . '</div></div><div class="controll-wrapper-border-stub"></div>';

        return $result;
    }

    protected function renderCarret() {
        return '<span class="caret"></span>';
    }

    protected function renderClearButton() {
        if ($this->clearButtonPosition !== self::CLEAR_BUTTON_POSITION_INPUT) {
            return;
        }

        return '<span class="clear">×</span>';
    }
}
