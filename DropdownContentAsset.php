<?php
/**
 * User: execut
 * Date: 11.09.15
 * Time: 14:35
 */

namespace execut\widget\dropdownContent;
use yii\web\AssetBundle;

class DropdownContentAsset extends AssetBundle
{
    public static $isDebugMode = false;
    public $sourcePath = '@vendor/execut/yii2-dropdown-content-input';
    public $js = [
        'assets/DropdownContent.js',
    ];

    public $depends = [
        'yii\jui\JuiAsset',
        'yii\bootstrap\BootstrapAsset'
    ];

    public function init() {
        if (empty($this->css)) {
            if (self::$isDebugMode) {
                $cssFile = 'assets/DropdownContent.less';
            } else {
                $cssFile = 'assets/DropdownContent.css';
            }

            $this->css = [
                $cssFile,
            ];
        }

        parent::init();
    }
}