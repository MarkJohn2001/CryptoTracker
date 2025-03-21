import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { theme, commonStyles } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { isDarkMode } = useTheme();
  const { portfolio, deleteCoin, editCoin } = usePortfolio();
  const [deletingCoinId, setDeletingCoinId] = useState(null);
  const [editingCoinId, setEditingCoinId] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: '', price: '' });

  const calculateTotalValue = () => {
    return portfolio.reduce((total, coin) => {
      return total + (coin.price * coin.quantity);
    }, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(value);
  };

  const handleDelete = async (coin) => {
    if (!coin || !coin.id || deletingCoinId) return;
    
    try {
      setDeletingCoinId(coin.id);
      await deleteCoin(coin.id);
      console.log('Delete operation successful');
      Alert.alert('Success! 🎉', 'Delete Successfully!');
    } catch (error) {
      console.error('Error deleting coin:', error);
      Alert.alert('Error', 'Failed to delete coin. Please try again.');
    } finally {
      setTimeout(() => setDeletingCoinId(null), 100);
    }
  };

  const handleEdit = (coin) => {
    setEditingCoinId(coin.id);
    setEditForm({
      quantity: coin.quantity.toString(),
      price: coin.price.toString()
    });

    Alert.alert(
      'Edit Coin',
      'Update coin details:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setEditingCoinId(null);
            setEditForm({ quantity: '', price: '' });
          }
        },
        {
          text: 'Save',
          style: 'default',
          onPress: async () => {
            try {
              const updatedData = {
                quantity: parseFloat(editForm.quantity),
                price: parseFloat(editForm.price)
              };

              if (isNaN(updatedData.quantity) || isNaN(updatedData.price)) {
                throw new Error('Invalid input values');
              }

              await editCoin(coin.id, updatedData);
              Alert.alert('Success! 🎉', 'Edit Successfully!');
            } catch (error) {
              console.error('Error editing coin:', error);
              Alert.alert('Error', 'Failed to edit coin. Please try again.');
            } finally {
              setEditingCoinId(null);
              setEditForm({ quantity: '', price: '' });
            }
          }
        }
      ],
      {
        cancelable: false
      }
    );
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
            Portfolio
          </Text>
          <Text style={[styles.totalValue, commonStyles.gradientText]}>
            {formatCurrency(calculateTotalValue())}
          </Text>
        </LinearGradient>
        
        <View style={styles.content}>
          {portfolio.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.dark.textSecondary }]}>
              No coins in your portfolio yet.{'\n'}
              Add your first coin to get started!
            </Text>
          ) : (
            portfolio.map((coin) => (
              <LinearGradient
                key={coin.id}
                colors={theme.dark.cardGradient}
                style={[styles.coinCard, commonStyles.gradientCard]}
              >
                <View style={styles.coinHeader}>
                  <View style={styles.coinInfo}>
                    <Text style={[styles.coinName, commonStyles.gradientText]}>
                      {coin.name}
                    </Text>
                    <Text style={styles.coinSymbol}>
                      {coin.symbol}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => handleEdit(coin)}
                      disabled={editingCoinId === coin.id}
                      style={styles.editButton}
                    >
                      {editingCoinId === coin.id ? (
                        <ActivityIndicator 
                          size="small" 
                          color={theme.dark.primary}
                        />
                      ) : (
                        <Ionicons 
                          name="pencil" 
                          size={20} 
                          color={theme.dark.primary}
                        />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(coin)}
                      disabled={deletingCoinId === coin.id}
                      style={styles.deleteButton}
                    >
                      {deletingCoinId === coin.id ? (
                        <ActivityIndicator 
                          size="small" 
                          color={theme.dark.error}
                        />
                      ) : (
                        <Ionicons 
                          name="trash-outline" 
                          size={20} 
                          color={theme.dark.error}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.coinDetails}>
                  <LinearGradient
                    colors={theme.dark.surfaceGradient}
                    style={styles.detailRow}
                  >
                    <Text style={styles.detailLabel}>
                      Quantity
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.dark.primary }]}>
                      {formatNumber(coin.quantity)}
                    </Text>
                  </LinearGradient>
                  
                  <LinearGradient
                    colors={theme.dark.surfaceGradient}
                    style={styles.detailRow}
                  >
                    <Text style={styles.detailLabel}>
                      Price
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.dark.primary }]}>
                      {formatCurrency(coin.price)}
                    </Text>
                  </LinearGradient>
                  
                  <LinearGradient
                    colors={theme.dark.surfaceGradient}
                    style={styles.detailRow}
                  >
                    <Text style={styles.detailLabel}>
                      Total Value
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.dark.primary }]}>
                      {formatCurrency(coin.price * coin.quantity)}
                    </Text>
                  </LinearGradient>
                </View>
              </LinearGradient>
            ))
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
    marginBottom: 8,
    color: theme.dark.primary,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.dark.primary,
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
  coinCard: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontWeight: '500',
    marginTop: 2,
    color: theme.dark.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1
  },
  coinDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
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
