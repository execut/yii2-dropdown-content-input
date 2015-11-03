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
//
//    /**
//     * Displayed value after show widget
//     *
//     * @var string|null
//     */
//    public $displayedValue = null;

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
        echo $this->renderWidget();
        echo $this->renderContainer();
        $this->registerWidget('dropdownContent');
    }

    /**
     * Render container
     *
     * @return string
     */
    public function renderContainer() {
        return $this->container->render();
    }

    /**
     * Get dropdown container
     *
     * @return Container
     */
    public function getContainer() {
        $container = \yii::createObject(array_merge([
            'class' => Container::className()
        ], $this->containerOptions));

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
        $options = $this->options;
        $options['autocomplete'] = 'off';
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