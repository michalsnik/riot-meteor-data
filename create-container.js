import riot from 'riot';
import RiotMeteorData from './riot-meteor-data';

riot.mixin('RiotMeteorData', RiotMeteorData);

const createContainer = function (componentName, componentHTML, fn) {
  return riot.tag(componentName, componentHTML, function (opts) {
    const data = fn.call(this, opts);

    this.getMeteorData = data;

    this.mixin('RiotMeteorData');
  });
};

export default createContainer;
