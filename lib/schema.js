export const tables = {
  CROP_TYPE: {
    columns: [
      { name: 'CROPTYPEID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'CROPCATEGORY', type: 'varchar(40)', nullable: false },
    ],
    displayName: 'Crop Types',
    icon: '🌱',
  },
  FARM: {
    columns: [
      { name: 'FARMID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'FARM_NAME____', type: 'varchar(30)', nullable: false, displayName: 'FARM_NAME' },
      { name: 'LOCATION', type: 'varchar(30)', nullable: true },
      { name: 'CITY', type: 'varchar(30)', nullable: true },
    ],
    displayName: 'Farms',
    icon: '🏡',
  },
  DRIVER: {
    columns: [
      { name: 'DRIVERID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'DRIVERNAME', type: 'varchar(30)', nullable: false },
      { name: 'LICENSENUMBER', type: 'numeric(30)', nullable: false },
    ],
    displayName: 'Drivers',
    icon: '🚚',
  },
  TRUCK: {
    columns: [
      { name: 'TRUCK_ID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'TRUCK_REG', type: 'varchar(50)', nullable: false },
      { name: 'CAPACITY_KG', type: 'float', nullable: false },
    ],
    displayName: 'Trucks',
    icon: '🚛',
  },
  RESTAURANT: {
    columns: [
      { name: 'RESTAURANTID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'NAME', type: 'varchar(50)', nullable: false },
      { name: 'DELIVERY_ADDRESS', type: 'varchar(50)', nullable: false },
      { name: 'DELIVER_WINDOW', type: 'datetime2', nullable: true },
      { name: 'CITY', type: 'varchar(50)', nullable: true },
    ],
    displayName: 'Restaurants',
    icon: '🍽️',
  },
  DELIVARY_TRIP: {
    columns: [
      { name: 'TRIPID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'DRIVERID', type: 'int', nullable: false },
      { name: 'TRUCK_ID', type: 'int', nullable: false },
      { name: 'TRIP_DATE', type: 'datetime2', nullable: false },
      { name: 'ROUTE_NAME', type: 'varchar(50)', nullable: false },
      { name: 'TOTAL_DISTANCE', type: 'float', nullable: true },
    ],
    displayName: 'Delivery Trips',
    icon: '🗺️',
  },
  FARM_SPECIALIZATION: {
    columns: [
      { name: 'CROPTYPEID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'FARMID', type: 'int', nullable: false, isPrimaryKey: true },
    ],
    displayName: 'Farm Specializations',
    icon: '🌾',
  },
  HARVEST_BATCH: {
    columns: [
      { name: 'FARMID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'BATCHID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'CROPTYPEID', type: 'int', nullable: false },
      { name: 'HARVEST_DATE', type: 'datetime2', nullable: false },
      { name: 'AVAILABLE_QTY', type: 'numeric(30)', nullable: false },
      { name: 'UNIT_PRICE', type: 'numeric(30)', nullable: false },
    ],
    displayName: 'Harvest Batches',
    icon: '📦',
  },
  ORDERS: {
    columns: [
      { name: 'RESTAURANTID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'ORDERID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'ORDER_DATE', type: 'datetime2', nullable: true },
      { name: 'ORDER_STATUS', type: 'varchar(30)', nullable: true },
    ],
    displayName: 'Orders',
    icon: '📋',
  },
  ORDER_LINE: {
    columns: [
      { name: 'RESTAURANTID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'ORDERID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'ORDERLINEID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'FARMID', type: 'int', nullable: false },
      { name: 'BATCHID', type: 'int', nullable: false },
      { name: 'QUANTITY', type: 'numeric(30)', nullable: false },
    ],
    displayName: 'Order Lines',
    icon: '🛒',
  },
  DELIVARY_TRIP_LINE: {
    columns: [
      { name: 'TRIP_ID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'ORDER_LINE_ID', type: 'int', nullable: false, isPrimaryKey: true },
      { name: 'TRIPID', type: 'int', nullable: false },
      { name: 'RESTAURANTID', type: 'int', nullable: false },
      { name: 'ORDERID', type: 'int', nullable: false },
      { name: 'ORDERLINEID', type: 'int', nullable: false },
      { name: 'STOP_SEQUENCE', type: 'int', nullable: false },
      { name: 'ACTUAL_DELIVERY_TIME', type: 'datetime2', nullable: false },
    ],
    displayName: 'Delivery Trip Lines',
    icon: '🚗',
  },
};

export const tableList = Object.keys(tables);

export function getTableDisplayName(tableName) {
  return tables[tableName]?.displayName || tableName;
}

export function getTableIcon(tableName) {
  return tables[tableName]?.icon || '📊';
}

export function getTableColumns(tableName) {
  return tables[tableName]?.columns || [];
}

export function getPrimaryKeyColumns(tableName) {
  const columns = getTableColumns(tableName);
  return columns.filter(col => col.isPrimaryKey);
}

export function getNonPrimaryColumns(tableName) {
  const columns = getTableColumns(tableName);
  return columns.filter(col => !col.isPrimaryKey);
}
