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
    public $sourcePath = '@vendor/execut/yii2-dropdown-content-input';
    public $js = [
        'assets/DropdownContent.js',
    ];

    public $css = [
        'assets/DropdownContent.css'
    ];

    public $depends = [
        'yii\jui\JuiAsset',
        'yii\bootstrap\BootstrapAsset'
    ];
}