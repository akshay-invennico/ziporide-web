import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import type { SupportTicket } from '@/types/support.types';

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
  statusOpen: {
    color: '#4E616A',
    fontFamily: 'Helvetica-Bold',
  },
  statusChecking: {
    color: '#1DAFA1',
    fontFamily: 'Helvetica-Bold',
  },
  statusResolved: {
    color: '#00A63E',
    fontFamily: 'Helvetica-Bold',
  },
});

export const SupportPDFDocument = ({ tickets }: { tickets: SupportTicket[] }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ziporide - Support Tickets Report</Text>
          <Text style={styles.date}>Generated on: {new Date().toLocaleString()}</Text>
        </View>
        <View>
          <Text style={styles.date}>Total Tickets: {tickets.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Ticket ID</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Cause</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Driver</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Phone</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Raised On</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Status</Text>
        </View>

        {/* Table Rows */}
        {tickets.map((ticket) => (
          <View style={styles.tableRow} key={ticket.ticketId}>
            <Text style={styles.tableCell}>{ticket.ticketId}</Text>
            <Text style={styles.tableCell}>{ticket.cause}</Text>
            <Text style={styles.tableCell}>{ticket.driver?.name || 'N/A'}</Text>
            <Text style={styles.tableCell}>{ticket.driver?.phone || 'N/A'}</Text>
            <Text style={styles.tableCell}>{new Date(ticket.createdAt).toLocaleDateString()}</Text>
            <Text
              style={[
                styles.tableCell,
                ticket.status === 'open'
                  ? styles.statusOpen
                  : ticket.status === 'checking'
                    ? styles.statusChecking
                    : styles.statusResolved,
              ]}
            >
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default SupportPDFDocument;
