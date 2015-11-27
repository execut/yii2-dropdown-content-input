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