import store from '../../../../store/index'

function ClearScreenControl() { }

ClearScreenControl.prototype.onClick = function () {
    store.dispatch('clearDroneTrajectory')
    // console.log(store)
}

ClearScreenControl.prototype.onAdd = function (map) {
    this._map = map;

    // Container
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    // Button
    const button = document.createElement('button');
    button.className = 'mapboxgl-ctrl-icon';
    button.title = 'Clear screen';
    button.onclick = this.onClick

    // Icon
    const img = document.createElement('img');
    img.src = require('../../../../assets/icons/eraser.svg');
    img.width = 15;
    img.height = 15;

    button.appendChild(img);
    this._container.appendChild(button);

    return this._container;
};

ClearScreenControl.prototype.onRemove = function () {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
};



export default ClearScreenControl;