<div ng-controller="InitCtrl" style="height: 100%;">
    <div ng-if="error" style="overflow: auto; white-space:pre; height: 100%;">{{error}}</div>

    <div ng-if="configLoaded">
        <div data-config="config" pattern></div>
    </div>
</div>
