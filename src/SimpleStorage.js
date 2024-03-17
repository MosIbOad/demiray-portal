// SimpleStorage.js
class SimpleStorage {
    constructor() {
        this.data = {};
    }

    setData(key, value) {
        this.data[key] = value;
    }

    getData(key) {
        return this.data[key];
    }

    deleteData(key) {
        delete this.data[key];
    }
}

module.exports = SimpleStorage;
