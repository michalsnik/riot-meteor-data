const RiotMeteorData = {
  init() {
    this.data = {};
    this._meteorDataManager = new MeteorDataManager(this);

    const newData = this._meteorDataManager.calculateData();
    this._meteorDataManager.updateData(newData);

    this.on('update', function() {
      const newData = this._meteorDataManager.calculateData();
      this._meteorDataManager.updateData(newData);
    });

    this.on('unmount', function() {
       this._meteorDataManager.dispose();
    });
  }
};

class MeteorDataManager {
  constructor(component) {
    this.component = component;
    this.computation = null;
    this.oldData = null;
  }

  dispose() {
    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }
  }

  calculateData() {
    const component = this.component;

    if (!component.getMeteorData) return null;

    if (Meteor.isServer) {
      return component.getMeteorData();
    }

    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }

    let data;

    this.computation = Tracker.nonreactive(() => {
      return Tracker.autorun((c) => {
        if (c.firstRun) {
          data = component.getMeteorData();
        } else {
          c.stop();
          component.update();
        }
      });
    });

    if (Package.mongo && Package.mongo.Mongo) {
      Object.keys(data).forEach(function (key) {
        if (data[key] instanceof Package.mongo.Mongo.Cursor) {
          console.warn(`
            Warning: you are returning a Mongo cursor from getMeteorData. This value
            will not be reactive. You probably want to call ".fetch()" on the cursor
            before returning it.
          `);
        }
      });
    }

    return data;
  }

  updateData(newData) {
    const component = this.component;
    const oldData = this.oldData;

    if (! (newData && (typeof newData) === 'object')) {
      throw new Error("Expected object returned from getMeteorData");
    }

    for (let key in newData) {
      component.data[key] = newData[key];
    }

    if (oldData) {
      for (let key in oldData) {
        if (!(key in newData)) {
          delete component.data[key];
        }
      }
    }
    this.oldData = newData;
  }
}

export const RiotMeteorData;
