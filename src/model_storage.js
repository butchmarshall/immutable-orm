import Immutable from 'immutable';

import {
	UUIDMap
} from './orm';

class ModelStorage extends Immutable.Record({
	primaryKey: "id",
	byUUID: Immutable.Map(),
	byUUID_List: Immutable.List(), // Caching for all() method
	byPrimaryKey: Immutable.Map(),
}, "ModelStorage") {
	all() {
		return this.byUUID_List;
	}
	getRowsByUUID(__uuids) {
		return this.byUUID.filter((v,k) => {
			return __uuids.includes(k);
		}).toList();
	}
	getRowByPrimaryKey(key) {
		return this.getRowByUUID(this.byPrimaryKey.get(key));
	}
	getRowByUUID(__uuid) {
		return this.byUUID.get(__uuid);
	}
	insertRow(row) {
		let byUUID = this.byUUID.set(UUIDMap.get(row), row),
		byPrimaryKey = this.byPrimaryKey.set(row[this.primaryKey], UUIDMap.get(row));

		let that = this.set("byUUID", byUUID);
		that = that.set("byPrimaryKey", byPrimaryKey);
		that = that.set("byUUID_List", that.byUUID.toList());

		return that;
	}
	removeRow(row) {
		let byUUID = this.byUUID.remove(UUIDMap.get(row)),
		byPrimaryKey = this.byPrimaryKey.remove(row[this.primaryKey]);

		let that = this.set("byUUID", byUUID);
		that = that.set("byPrimaryKey", byPrimaryKey);
		that = that.set("byUUID_List", that.byUUID.toList());

		return that;
	}
}

export default ModelStorage;