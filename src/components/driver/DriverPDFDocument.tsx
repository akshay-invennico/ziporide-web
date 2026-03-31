import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import type { Driver } from '@/types/driver.types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#1DAFA1',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#1DAFA1',
    fontFamily: 'Helvetica-Bold',
  },
  date: {
    fontSize: 10,
    color: '#4E616A',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DFE6E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DFE6E5',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F8FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#DFE6E5',
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    flex: 1,
    color: '#4E616A',
  },
  headerText: {
    fontFamily: 'Helvetica-Bold',
    color: '#14B8A6',
    fontSize: 10,
  },
  statusActive: {
    color: '#00A63E',
    fontFamily: 'Helvetica-Bold',
  },
  statusSuspended: {
    color: '#FF0707',
    fontFamily: 'Helvetica-Bold',
  },
});

export const DriverPDFDocument = ({ drivers }: { drivers: Driver[] }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ziporide - Driver List Report</Text>
          <Text style={styles.date}>Generated on: {new Date().toLocaleString()}</Text>
        </View>
        <View>
          <Text style={styles.date}>Total Drivers: {drivers.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Driver ID</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Name</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Email</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Phone</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Total Trips</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Total Earnings</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Rating</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Status</Text>
        </View>

        {/* Table Rows */}
        {drivers.map((driver) => (
          <View style={styles.tableRow} key={driver.id}>
            <Text style={styles.tableCell}>{driver.id}</Text>
            <Text style={styles.tableCell}>{driver.name || driver.driverName}</Text>
            <Text style={styles.tableCell}>{driver.email || '-'}</Text>
            <Text style={styles.tableCell}>{driver.phone}</Text>
            <Text style={styles.tableCell}>{driver.totalTrips || 0}</Text>
            <Text style={styles.tableCell}>
              £{(driver.totalEarnings || driver.totalEarned || 0).toFixed(2)}
            </Text>
            <Text style={styles.tableCell}>
              {(driver.avgRating || driver.rating || 0).toFixed(1)}
            </Text>
            <Text
              style={[
                styles.tableCell,
                driver.status?.toLowerCase() === 'approved' ||
                driver.status?.toLowerCase() === 'active'
                  ? styles.statusActive
                  : styles.statusSuspended,
              ]}
            >
              {driver.status || 'Active'}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default DriverPDFDocument;
