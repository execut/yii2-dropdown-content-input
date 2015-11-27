# Dropdown field with customized content for yii2
This widget allows you to embed any content in the dropdown list, for example, GridView. To do this you need be transmit of html content in the settings of
the container widget ('containerOptions'), where each option of dropdown has
class "item" and attributes: name (displayed selected value), val (the selected value for input field).
Widget use bootstrap grid for stretching list container by width of row.

## Installation

The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

### Install

Either run

```
$ php composer.phar require execut/yii2-dropdown-content-input "dev-master"
```

or add

```
"execut/yii2-dropdown-content-input": "dev-master"
```

to the ```require``` section of your `composer.json` file.

## Simple example
This example shows how to transmit a GridView in the widget and use widget inside form:
![Expanded first select](https://raw.githubusercontent.com/execut/yii2-dropdown-content-input/master/examples/example1.png)
![Expanded three select](https://raw.githubusercontent.com/execut/yii2-dropdown-content-input/master/examples/example2.png)
```php
<?php
use \yii\data\ArrayDataProvider;
use \execut\widget\dropdownContent\DropdownContent;
use \yii\widgets\ActiveForm;

class TestModel extends \yii\base\Model{
    public $city = null;
    public $otherCity = null;
}

$dataProvider = new ArrayDataProvider();
$dataProvider->allModels = [
    [
        'name' => 'Moskow',
        'country' => 'Russia'
    ],
    [
        'name' => 'London',
        'country' => 'UK',
    ],
    [
        'name' => 'Washington',
        'country' => 'USA'
    ],
];
$dataProvider->key = 'name';

$widgetParams = [
    'name' => 'test',
    'value' => 'London',
    'inputOptions' => [
        'placeholder' => 'Test placeholder...'
    ],
    'containerOptions' => [
        'isExpand' => true,
        'content' => function () use ($dataProvider) {
            return \yii\grid\GridView::widget([
                'columns' => [
                    'name' => [
                        'attribute' => 'name',
                    ],
                ],
                'dataProvider' => $dataProvider,
                'rowOptions' => function ($row) {
                    return [
                        'class' => 'item',
                        'val' => $row['name'],
                        'text' => $row['name'],
                    ];
                },
            ]);
        },
    ],
];
$form = new ActiveForm();
?>
<div class="container">
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <?php
                /**
                 * Usage as widget
                 */
                echo DropdownContent::widget($widgetParams);
                $widgetParams['containerOptions']['isExpand'] = false;
                ?>
            </div>
        </div>
    </div>
    <!-- Set relative position bootstrap row for stretching container content by width of row-->
    <div class="row" style="position: relative">
        <!--        Reset position for bootstrap col to default-->
        <div class="col-md-6" style="position: static">
            <div class="form-group">
                <?php
                /**
                 * Usage as form field
                 */
                $model = new TestModel();

                echo $form->field($model, 'city')->widget(DropdownContent::className(), $widgetParams);
                ?>
            </div>
        </div>
        <!--        Reset position for bootstrap col to default-->
        <div class="col-md-6" style="position: static">
            <div class="form-group">
                <?php
                echo $form->field($model, 'otherCity')->widget(DropdownContent::className(), $widgetParams);
                ?>
            </div>
        </div>
    </div>
</div>
```
## License

**yii2-dropdown-content-input** is released under the Apache License Version 2.0. See the bundled `LICENSE.md` for details.
