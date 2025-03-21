import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { theme, commonStyles } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PriceHistoryScreen() {
  const { isDarkMode } = useTheme();
  const { priceHistory } = usePortfolio();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'add':
        return {
          name: 'add-circle-outline',
          color: theme.dark.success,
          label: 'Added to Portfolio'
        };
      case 'delete':
        return {
          name: 'remove-circle-outline',
          color: theme.dark.error,
          label: 'Removed from Portfolio'
        };
      default:
        return {
          name: 'ellipse-outline',
          color: theme.dark.textSecondary,
          label: 'Unknown Action'
        };
    }
  };

  return (
    <LinearGradient
      colors={theme.dark.headerGradient}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#000000', '#1A1A1A']}
          style={styles.header}
        >
          <Text style={[styles.title, commonStyles.gradientText]}>
            Price History
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {priceHistory.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.dark.textSecondary }]}>
              No price history available yet.{'\n'}
              Add or remove coins to see their history here!
            </Text>
          ) : (
            priceHistory.map((record, index) => {
              const action = getActionIcon(record.type);
              return (
                <LinearGradient
                  key={index}
                  colors={theme.dark.cardGradient}
                  style={[styles.historyCard, commonStyles.gradientCard]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.coinInfo}>
                      <Text style={[styles.coinName, commonStyles.gradientText]}>
                        {record.name}
                      </Text>
                      <Text style={styles.coinSymbol}>
                        {record.symbol}
                      </Text>
                    </View>
                    <View style={styles.actionContainer}>
                      <Ionicons 
                        name={action.name} 
                        size={24} 
                        color={action.color}
                      />
                      <Text style={[styles.actionText, { color: action.color }]}>
                        {action.label}
                      </Text>
                    </View>
                  </View>

                  <LinearGradient
                    colors={theme.dark.surfaceGradient}
                    style={styles.detailsContainer}
                  >
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Quantity
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.dark.primary }]}>
                        {record.quantity.toFixed(8)}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Price
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.dark.primary }]}>
                        ${record.price.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Total Value
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.dark.primary }]}>
                        ${(record.price * record.quantity).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Date
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.dark.primary }]}>
                        {formatDate(record.timestamp)}
                      </Text>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              );
            })
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.dark.primary,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 24,
  },
  historyCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.dark.primary,
  },
  coinSymbol: {
    fontSize: 16,
    color: theme.dark.textSecondary,
    marginTop: 2,
  },
  actionContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.dark.border,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.dark.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
