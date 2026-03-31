import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import type { TripRecord } from '@/types/driver.types';

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
  statusAssigned: {
    color: '#1DAFA1',
    fontFamily: 'Helvetica-Bold',
  },
  statusInProgress: {
    color: '#F6921E',
    fontFamily: 'Helvetica-Bold',
  },
  statusCompleted: {
    color: '#00A63E',
    fontFamily: 'Helvetica-Bold',
  },
  statusCancelled: {
    color: '#FF0707',
    fontFamily: 'Helvetica-Bold',
  },
  routeCell: {
    flex: 2,
  },
});

export const TripPDFDocument = ({ trips }: { trips: TripRecord[] }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ziporide - Trip History Report</Text>
          <Text style={styles.date}>Generated on: {new Date().toLocaleString()}</Text>
        </View>
        <View>
          <Text style={styles.date}>Total Trips: {trips.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Trip ID</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Rider</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Driver</Text>
          <Text style={[styles.tableCell, styles.headerText, styles.routeCell]}>Route</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Amount</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Date & Time</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Status</Text>
        </View>

        {/* Table Rows */}
        {trips.map((trip) => (
          <View style={styles.tableRow} key={trip.id}>
            <Text style={styles.tableCell}>{trip.id}</Text>
            <Text style={styles.tableCell}>{trip.rider.name}</Text>
            <Text style={styles.tableCell}>{trip.driver.name}</Text>
            <Text style={[styles.tableCell, styles.routeCell]}>
              {trip.route.pickupLocation.split(',')[0]} → {trip.route.destination.split(',')[0]}
            </Text>
            <Text style={styles.tableCell}>£{trip.amount.toFixed(2)}</Text>
            <Text style={styles.tableCell}>
              {trip.date} | {trip.time}
            </Text>
            <Text
              style={[
                styles.tableCell,
                trip.status === 'Assigned'
                  ? styles.statusAssigned
                  : trip.status === 'In Progress'
                    ? styles.statusInProgress
                    : trip.status === 'Completed'
                      ? styles.statusCompleted
                      : trip.status === 'Cancelled'
                        ? styles.statusCancelled
                        : {},
              ]}
            >
              {trip.status}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default TripPDFDocument;
