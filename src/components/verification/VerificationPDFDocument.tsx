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
  statusPending: {
    color: '#F6921E',
    fontFamily: 'Helvetica-Bold',
  },
  statusApproved: {
    color: '#00A63E',
    fontFamily: 'Helvetica-Bold',
  },
  statusRejected: {
    color: '#FF0707',
    fontFamily: 'Helvetica-Bold',
  },
});

export const VerificationPDFDocument = ({ drivers }: { drivers: Driver[] }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ziporide - Driver Verification Report</Text>
          <Text style={styles.date}>Generated on: {new Date().toLocaleString()}</Text>
        </View>
        <View>
          <Text style={styles.date}>Total Requests: {drivers.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Driver ID</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Name</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Email</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Phone</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Applied On</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Status</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Reason</Text>
        </View>

        {/* Table Rows */}
        {drivers.map((driver) => (
          <View style={styles.tableRow} key={driver.id}>
            <Text style={styles.tableCell}>{driver.id}</Text>
            <Text style={styles.tableCell}>{driver.driverName || driver.name || 'Unknown'}</Text>
            <Text style={styles.tableCell}>{driver.email || '-'}</Text>
            <Text style={styles.tableCell}>{driver.phone}</Text>
            <Text style={styles.tableCell}>
              {driver.appliedOn || driver.createdAt
                ? new Date(driver.appliedOn || driver.createdAt!).toLocaleDateString()
                : '-'}
            </Text>
            <Text
              style={[
                styles.tableCell,
                driver.status?.toLowerCase() === 'pending'
                  ? styles.statusPending
                  : driver.status?.toLowerCase() === 'approved'
                    ? styles.statusApproved
                    : styles.statusRejected,
              ]}
            >
              {driver.status?.charAt(0).toUpperCase() + driver.status?.slice(1) || 'Pending'}
            </Text>
            <Text style={styles.tableCell}>{driver.reason || driver.rejectedReason || '-'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default VerificationPDFDocument;
