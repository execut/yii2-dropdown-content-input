<?php
namespace execut\widget\dropdownContent;


use yii\helpers\Html;
use yii\jui\InputWidget;

/**
 * Widget for render custom dropdown
 *
 * @author eXeCUT
 */
class DropdownContent extends InputWidget
{
    /**
     * Flag for use less compiler
     *
     * @var bool
     */
    public $isDebugMode = false;

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
     * Renders the widget.
     */
    public function run()
    {
        DropdownContentAsset::$isDebugMode = $this->isDebugMode;
        DropdownContentAsset::register($this->view);
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
            'class' => Container::className(),
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
        $result = '<div class="wrapper">';
        $options = [
            'autocomplete' => 'off'
        ];
        if ($this->hasModel()) {
            $result .= Html::activeHiddenInput($this->model, $this->attribute, $options);
        } else {
            $result .= Html::hiddenInput($this->name, $this->value, $options);
        }

        $result .= Html::textInput($this->id . '_input', null, array_merge([
            'class' => [
                'form-control'
            ],
            'autocomplete' => 'off',
        ], $this->inputOptions)) . '<div class="controll-wrapper"><span class="caret"></span><span class="clear">×</span></div></div>';

        return $result;
    }
}