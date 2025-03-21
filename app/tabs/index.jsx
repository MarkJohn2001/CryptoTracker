import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { theme, commonStyles } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomAlert from '../../components/CustomAlert';

export default function HomeScreen() {
  const { isDarkMode } = useTheme();
  const { portfolio, deleteCoin, editCoin } = usePortfolio();
  const [deletingCoinId, setDeletingCoinId] = useState(null);
  const [editingCoinId, setEditingCoinId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    symbol: '',
    quantity: '',
    price: ''
  });
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
    setSelectedCoin(coin);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!selectedCoin) return;
    
    try {
      setDeletingCoinId(selectedCoin.id);
      await deleteCoin(selectedCoin.id);
      console.log('Delete operation successful');
      setShowDeleteAlert(false);
      setAlertMessage('Delete Successfully!');
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting coin:', error);
      setAlertMessage('Failed to delete coin. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setSelectedCoin(null);
      setTimeout(() => setDeletingCoinId(null), 100);
    }
  };

  const handleEdit = (coin) => {
    setSelectedCoin(coin);
    setEditForm({
      name: coin.name,
      symbol: coin.symbol,
      quantity: coin.quantity.toString(),
      price: coin.price.toString()
    });
    setShowEditAlert(true);
  };

  const confirmEdit = async () => {
    if (!selectedCoin) return;
    
    try {
      const quantity = parseFloat(editForm.quantity);
      const price = parseFloat(editForm.price);
      const name = editForm.name.trim();
      const symbol = editForm.symbol.trim();

      if (!name) {
        throw new Error('Coin name is required');
      }

      if (!symbol) {
        throw new Error('Coin symbol is required');
      }

      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }

      if (isNaN(price) || price <= 0) {
        throw new Error('Price must be a positive number');
      }

      const updatedData = {
        ...selectedCoin,
        name,
        symbol,
        quantity,
        price,
        lastUpdated: new Date().toISOString()
      };

      await editCoin(selectedCoin.id, updatedData);
      setShowEditAlert(false);
      setAlertMessage('Coin updated successfully!');
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error editing coin:', error);
      setAlertMessage(error.message || 'Failed to edit coin. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setSelectedCoin(null);
      setEditForm({ name: '', symbol: '', quantity: '', price: '' });
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
      {showDeleteAlert && (
        <CustomAlert
          visible={showDeleteAlert}
          title="Delete Coin"
          message={`Are you sure you want to delete ${selectedCoin?.name}?`}
          buttons={[
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                setShowDeleteAlert(false);
                setSelectedCoin(null);
              }
            },
            {
              text: 'Delete',
              style: 'default',
              onPress: confirmDelete
            }
          ]}
          onDismiss={() => {
            setShowDeleteAlert(false);
            setSelectedCoin(null);
          }}
        />
      )}

      {showEditAlert && (
        <CustomAlert
          visible={showEditAlert}
          title="Edit Coin"
          message="Update coin details:"
          customContent={
            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                  placeholder="Enter coin name"
                  placeholderTextColor={theme.dark.textSecondary}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Symbol</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.symbol}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, symbol: text }))}
                  placeholder="Enter coin symbol"
                  placeholderTextColor={theme.dark.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.quantity}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, quantity: text }))}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                  placeholderTextColor={theme.dark.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Price ($)</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.price}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, price: text }))}
                  keyboardType="numeric"
                  placeholder="Enter price"
                  placeholderTextColor={theme.dark.textSecondary}
                />
              </View>
            </View>
          }
          buttons={[
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                setShowEditAlert(false);
                setSelectedCoin(null);
                setEditForm({ name: '', symbol: '', quantity: '', price: '' });
              }
            },
            {
              text: 'Save',
              style: 'default',
              onPress: confirmEdit
            }
          ]}
          onDismiss={() => {
            setShowEditAlert(false);
            setSelectedCoin(null);
            setEditForm({ name: '', symbol: '', quantity: '', price: '' });
          }}
        />
      )}
      {showSuccessAlert && (
        <CustomAlert
          visible={showSuccessAlert}
          title="Success! "
          message={alertMessage}
          buttons={[
            {
              text: 'OK',
              style: 'default',
              onPress: () => setShowSuccessAlert(false)
            }
          ]}
          onDismiss={() => setShowSuccessAlert(false)}
        />
      )}

      {showErrorAlert && (
        <CustomAlert
          visible={showErrorAlert}
          title="Error"
          message={alertMessage}
          buttons={[
            {
              text: 'OK',
              style: 'default',
              onPress: () => setShowErrorAlert(false)
            }
          ]}
          onDismiss={() => setShowErrorAlert(false)}
        />
      )}
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
  editForm: {
    width: '100%',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: theme.dark.textSecondary,
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: theme.dark.surface,
    borderWidth: 1,
    borderColor: theme.dark.border,
    borderRadius: 8,
    padding: 10,
    color: theme.dark.text,
    fontSize: 16,
  },
});
