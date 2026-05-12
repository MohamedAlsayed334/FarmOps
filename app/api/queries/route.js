import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const joinQueries = {
  'orders-restaurants': {
    name: 'Orders + Restaurants',
    description: 'View all orders with their restaurant details',
    sql: `
      SELECT 
        o.RESTAURANTID,
        o.ORDERID,
        o.ORDER_DATE,
        o.ORDER_STATUS,
        r.NAME as RESTAURANT_NAME,
        r.DELIVERY_ADDRESS,
        r.CITY,
        r.DELIVER_WINDOW
      FROM ORDERS o
      INNER JOIN RESTAURANT r ON o.RESTAURANTID = r.RESTAURANTID
      ORDER BY o.ORDER_DATE DESC, o.ORDERID DESC
    `,
    columns: ['RESTAURANTID', 'ORDERID', 'ORDER_DATE', 'ORDER_STATUS', 'RESTAURANT_NAME', 'DELIVERY_ADDRESS', 'CITY', 'DELIVER_WINDOW']
  },
  'harvest-farms-crops': {
    name: 'Harvest + Farms + Crop Types',
    description: 'Complete harvest batch information with farm and crop details',
    sql: `
      SELECT 
        h.FARMID,
        h.BATCHID,
        h.HARVEST_DATE,
        h.AVAILABLE_QTY,
        h.UNIT_PRICE,
        f.FARM_NAME____ as FARM_NAME,
        f.LOCATION,
        f.CITY,
        c.CROPTYPEID,
        c.CROPCATEGORY
      FROM HARVEST_BATCH h
      INNER JOIN FARM f ON h.FARMID = f.FARMID
      INNER JOIN CROP_TYPE c ON h.CROPTYPEID = c.CROPTYPEID
      ORDER BY h.HARVEST_DATE DESC
    `,
    columns: ['FARMID', 'BATCHID', 'HARVEST_DATE', 'AVAILABLE_QTY', 'UNIT_PRICE', 'FARM_NAME', 'LOCATION', 'CITY', 'CROPTYPEID', 'CROPCATEGORY']
  },
  'delivery-trips-resources': {
    name: 'Delivery Trips + Drivers + Trucks',
    description: 'View delivery trips with assigned driver and truck information',
    sql: `
      SELECT 
        d.TRIPID,
        d.TRIP_DATE,
        d.ROUTE_NAME,
        d.TOTAL_DISTANCE,
        dr.DRIVERID,
        dr.DRIVERNAME,
        dr.LICENSENUMBER,
        t.TRUCK_ID,
        t.TRUCK_REG,
        t.CAPACITY_KG
      FROM DELIVARY_TRIP d
      INNER JOIN DRIVER dr ON d.DRIVERID = dr.DRIVERID
      INNER JOIN TRUCK t ON d.TRUCK_ID = t.TRUCK_ID
      ORDER BY d.TRIP_DATE DESC, d.TRIPID DESC
    `,
    columns: ['TRIPID', 'TRIP_DATE', 'ROUTE_NAME', 'TOTAL_DISTANCE', 'DRIVERID', 'DRIVERNAME', 'LICENSENUMBER', 'TRUCK_ID', 'TRUCK_REG', 'CAPACITY_KG']
  },
  'order-lines-details': {
    name: 'Order Lines + Harvest + Farms',
    description: 'View order line items with their harvest batch and farm sources',
    sql: `
      SELECT 
        ol.RESTAURANTID,
        ol.ORDERID,
        ol.ORDERLINEID,
        ol.QUANTITY,
        h.BATCHID,
        h.HARVEST_DATE,
        h.AVAILABLE_QTY,
        h.UNIT_PRICE,
        f.FARM_NAME____ as FARM_NAME,
        f.CITY,
        c.CROPCATEGORY
      FROM ORDER_LINE ol
      INNER JOIN HARVEST_BATCH h ON ol.FARMID = h.FARMID AND ol.BATCHID = h.BATCHID
      INNER JOIN FARM f ON ol.FARMID = f.FARMID
      INNER JOIN CROP_TYPE c ON h.CROPTYPEID = c.CROPTYPEID
      ORDER BY ol.RESTAURANTID, ol.ORDERID, ol.ORDERLINEID
    `,
    columns: ['RESTAURANTID', 'ORDERID', 'ORDERLINEID', 'QUANTITY', 'BATCHID', 'HARVEST_DATE', 'AVAILABLE_QTY', 'UNIT_PRICE', 'FARM_NAME', 'CITY', 'CROPCATEGORY']
  },
  'farm-specializations': {
    name: 'Farm Specializations',
    description: 'View which crops each farm specializes in',
    sql: `
      SELECT 
        f.FARMID,
        f.FARM_NAME____ as FARM_NAME,
        f.LOCATION,
        f.CITY,
        c.CROPTYPEID,
        c.CROPCATEGORY
      FROM FARM_SPECIALIZATION fs
      INNER JOIN FARM f ON fs.FARMID = f.FARMID
      INNER JOIN CROP_TYPE c ON fs.CROPTYPEID = c.CROPTYPEID
      ORDER BY f.FARM_NAME____, c.CROPCATEGORY
    `,
    columns: ['FARMID', 'FARM_NAME', 'LOCATION', 'CITY', 'CROPTYPEID', 'CROPCATEGORY']
  },
  'delivery-trip-lines': {
    name: 'Delivery Trip Lines + Orders',
    description: 'View delivery stops with their order details',
    sql: `
      SELECT 
        dtl.TRIP_ID,
        dtl.ORDER_LINE_ID,
        dtl.STOP_SEQUENCE,
        dtl.ACTUAL_DELIVERY_TIME,
        dt.ROUTE_NAME,
        dt.TRIP_DATE,
        ol.QUANTITY,
        r.NAME as RESTAURANT_NAME,
        r.DELIVERY_ADDRESS
      FROM DELIVARY_TRIP_LINE dtl
      INNER JOIN DELIVARY_TRIP dt ON dtl.TRIPID = dt.TRIPID
      INNER JOIN ORDER_LINE ol ON dtl.RESTAURANTID = ol.RESTAURANTID AND dtl.ORDERID = ol.ORDERID AND dtl.ORDERLINEID = ol.ORDERLINEID
      INNER JOIN RESTAURANT r ON dtl.RESTAURANTID = r.RESTAURANTID
      ORDER BY dtl.TRIP_ID, dtl.STOP_SEQUENCE
    `,
    columns: ['TRIP_ID', 'ORDER_LINE_ID', 'STOP_SEQUENCE', 'ACTUAL_DELIVERY_TIME', 'ROUTE_NAME', 'TRIP_DATE', 'QUANTITY', 'RESTAURANT_NAME', 'DELIVERY_ADDRESS']
  },
  'top-crop-by-orders': {
    name: 'Top Crop Type by Orders',
    description: 'Which crop type had the maximum number of orders placed by restaurants',
    sql: `
      SELECT 
        ct.CROPCATEGORY as CROP_TYPE,
        COUNT(DISTINCT ol.ORDERID) as ORDER_COUNT
      FROM CROP_TYPE ct
      INNER JOIN HARVEST_BATCH hb ON ct.CROPTYPEID = hb.CROPTYPEID
      INNER JOIN ORDER_LINE ol ON hb.FARMID = ol.FARMID AND hb.BATCHID = ol.BATCHID
      GROUP BY ct.CROPCATEGORY
      ORDER BY ORDER_COUNT DESC
    `,
    columns: ['CROP_TYPE', 'ORDER_COUNT']
  },
  'farms-no-activity-last-month': {
    name: 'Farms with No Activity',
    description: 'Which farms had no harvest batches listed or sold during the last month',
    sql: `
      SELECT 
        f.FARMID,
        f.FARM_NAME____ as FARM_NAME,
        f.LOCATION,
        f.CITY
      FROM FARM f
      WHERE f.FARMID NOT IN (
        SELECT DISTINCT hb.FARMID 
        FROM HARVEST_BATCH hb 
        WHERE hb.HARVEST_DATE >= DATEADD(MONTH, -1, GETDATE())
      )
      AND f.FARMID NOT IN (
        SELECT DISTINCT ol.FARMID 
        FROM ORDER_LINE ol
        INNER JOIN ORDERS o ON ol.RESTAURANTID = o.RESTAURANTID AND ol.ORDERID = o.ORDERID
        WHERE o.ORDER_DATE >= DATEADD(MONTH, -1, GETDATE())
      )
      ORDER BY f.FARM_NAME____
    `,
    columns: ['FARMID', 'FARM_NAME', 'LOCATION', 'CITY']
  },
  'top-driver-last-month': {
    name: 'Top Driver by Trips',
    description: 'Driver who completed the highest number of delivery trips last month',
    sql: `
      SELECT TOP 1
        d.DRIVERID,
        d.DRIVERNAME,
        d.LICENSENUMBER,
        COUNT(dt.TRIPID) as TRIP_COUNT
      FROM DRIVER d
      INNER JOIN DELIVARY_TRIP dt ON d.DRIVERID = dt.DRIVERID
      WHERE dt.TRIP_DATE >= DATEADD(MONTH, -1, GETDATE())
      GROUP BY d.DRIVERID, d.DRIVERNAME, d.LICENSENUMBER
      ORDER BY TRIP_COUNT DESC
    `,
    columns: ['DRIVERID', 'DRIVERNAME', 'LICENSENUMBER', 'TRIP_COUNT']
  },
  'restaurants-no-orders-last-month': {
    name: 'Inactive Restaurants',
    description: 'Restaurants that did not place any produce orders last month',
    sql: `
      SELECT 
        r.RESTAURANTID,
        r.NAME,
        r.DELIVERY_ADDRESS,
        r.CITY,
        r.DELIVER_WINDOW
      FROM RESTAURANT r
      WHERE r.RESTAURANTID NOT IN (
        SELECT DISTINCT o.RESTAURANTID
        FROM ORDERS o
        WHERE o.ORDER_DATE >= DATEADD(MONTH, -1, GETDATE())
      )
      ORDER BY r.NAME
    `,
    columns: ['RESTAURANTID', 'NAME', 'DELIVERY_ADDRESS', 'CITY', 'DELIVER_WINDOW']
  },
  'restaurant-batches-last-month': {
    name: 'Harvest Batches per Restaurant',
    description: 'Harvest batches delivered to each restaurant last month',
    sql: `
      SELECT 
        r.NAME as RESTAURANT_NAME,
        r.DELIVERY_ADDRESS,
        f.FARM_NAME____ as FARM_NAME,
        hb.BATCHID,
        hb.HARVEST_DATE,
        hb.AVAILABLE_QTY,
        hb.UNIT_PRICE,
        ct.CROPCATEGORY as CROP_TYPE,
        ol.QUANTITY as ORDERED_QTY,
        ol.QUANTITY * hb.UNIT_PRICE as LINE_TOTAL
      FROM ORDER_LINE ol
      INNER JOIN ORDERS o ON ol.RESTAURANTID = o.RESTAURANTID AND ol.ORDERID = o.ORDERID
      INNER JOIN RESTAURANT r ON ol.RESTAURANTID = r.RESTAURANTID
      INNER JOIN HARVEST_BATCH hb ON ol.FARMID = hb.FARMID AND ol.BATCHID = hb.BATCHID
      INNER JOIN FARM f ON hb.FARMID = f.FARMID
      INNER JOIN CROP_TYPE ct ON hb.CROPTYPEID = ct.CROPTYPEID
      WHERE o.ORDER_DATE >= DATEADD(MONTH, -1, GETDATE())
      ORDER BY r.NAME, hb.HARVEST_DATE
    `,
    columns: ['RESTAURANT_NAME', 'DELIVERY_ADDRESS', 'FARM_NAME', 'BATCHID', 'HARVEST_DATE', 'AVAILABLE_QTY', 'UNIT_PRICE', 'CROP_TYPE', 'ORDERED_QTY', 'LINE_TOTAL']
  },
  'farm-revenue': {
    name: 'Farm Revenue',
    description: 'Total revenue generated from each farm\'s sold batches',
    sql: `
      SELECT 
        f.FARMID,
        f.FARM_NAME____ as FARM_NAME,
        f.LOCATION,
        f.CITY,
        SUM(ol.QUANTITY * hb.UNIT_PRICE) as TOTAL_REVENUE,
        COUNT(DISTINCT ol.ORDERID) as TOTAL_ORDERS,
        COUNT(DISTINCT hb.BATCHID) as BATCHES_SOLD
      FROM FARM f
      INNER JOIN HARVEST_BATCH hb ON f.FARMID = hb.FARMID
      INNER JOIN ORDER_LINE ol ON hb.FARMID = ol.FARMID AND hb.BATCHID = ol.BATCHID
      GROUP BY f.FARMID, f.FARM_NAME____, f.LOCATION, f.CITY
      ORDER BY TOTAL_REVENUE DESC
    `,
    columns: ['FARMID', 'FARM_NAME', 'LOCATION', 'CITY', 'TOTAL_REVENUE', 'TOTAL_ORDERS', 'BATCHES_SOLD']
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryName = searchParams.get('name');
    
    if (queryName && joinQueries[queryName]) {
      const result = await query(joinQueries[queryName].sql);
      return NextResponse.json({
        queryName,
        queryData: joinQueries[queryName],
        data: result.recordset
      });
    }
    
    return NextResponse.json(Object.keys(joinQueries).map(key => ({
      key,
      name: joinQueries[key].name,
      description: joinQueries[key].description,
      columnCount: joinQueries[key].columns.length
    })));
  } catch (error) {
    console.error('Error executing join query:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}