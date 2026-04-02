import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import type { Rider } from '@/types/rider.types';

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

export const RiderPDFDocument = ({ riders }: { riders: Rider[] }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ziporide - Rider List Report</Text>
          <Text style={styles.date}>Generated on: {new Date().toLocaleString()}</Text>
        </View>
        <View>
          <Text style={styles.date}>Total Riders: {riders.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Rider ID</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Name</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Email</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Phone</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Total Trips</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Total Spent</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Rating</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Status</Text>
        </View>

        {/* Table Rows */}
        {riders.map((rider) => (
          <View style={styles.tableRow} key={rider.id}>
            <Text style={styles.tableCell}>{rider.id}</Text>
            <Text style={styles.tableCell}>{rider.name}</Text>
            <Text style={styles.tableCell}>{rider.email || '-'}</Text>
            <Text style={styles.tableCell}>
              {rider.countryCode || ''} {rider.phone}
            </Text>
            <Text style={styles.tableCell}>{rider.totalTrips || 0}</Text>
            <Text style={styles.tableCell}>£{(rider.totalSpent || 0).toFixed(2)}</Text>
            <Text style={styles.tableCell}>{(rider.rating || 0).toFixed(1)}</Text>
            <Text
              style={[
                styles.tableCell,
                rider.status?.toLowerCase() === 'active'
                  ? styles.statusActive
                  : styles.statusSuspended,
              ]}
            >
              {rider.status || 'Active'}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default RiderPDFDocument;
