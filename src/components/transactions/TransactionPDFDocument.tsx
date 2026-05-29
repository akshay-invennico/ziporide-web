import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import type { Transaction } from '@/types/transaction.types';

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
  amountPositive: {
    color: '#00A63E',
    fontFamily: 'Helvetica-Bold',
  },
  amountNegative: {
    color: '#FF0707',
    fontFamily: 'Helvetica-Bold',
  },
});

export const TransactionPDFDocument = ({ transactions }: { transactions: Transaction[] }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Zipo - Transaction Report</Text>
          <Text style={styles.date}>Generated on: {new Date().toLocaleString()}</Text>
        </View>
        <View>
          <Text style={styles.date}>Total Transactions: {transactions.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Transaction ID</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Type</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Amount</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Date & Time</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Status</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Driver</Text>
        </View>

        {/* Table Rows */}
        {transactions.map((txn) => {
          const isPositive =
            [
              'Ride Payment',
              'Subscription Payment',
              'Cancellation Fee',
              'No-Show Fee',
              'Driver Incentive',
            ].includes(txn.type) && txn.amount > 0;

          return (
            <View style={styles.tableRow} key={txn.id}>
              <Text style={styles.tableCell}>{txn.id}</Text>
              <Text style={styles.tableCell}>{txn.type}</Text>
              <Text
                style={[
                  styles.tableCell,
                  isPositive ? styles.amountPositive : styles.amountNegative,
                ]}
              >
                {isPositive ? '+' : '-'} £{Math.abs(txn.amount).toFixed(2)}
              </Text>
              <Text style={styles.tableCell}>
                {txn.date} | {txn.time}
              </Text>
              <Text style={styles.tableCell}>{txn.status}</Text>
              <Text style={styles.tableCell}>{txn.driver?.name || 'N/A'}</Text>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default TransactionPDFDocument;
