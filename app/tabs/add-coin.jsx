import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { theme, commonStyles } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import CustomAlert from '../../components/CustomAlert';

export default function AddCoinScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { addCoin } = usePortfolio();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!name || !symbol || !quantity || !price) {
      setErrorMessage('Please fill in all fields');
      setShowErrorAlert(true);
      return false;
    }

    if (isNaN(quantity) || isNaN(price)) {
      setErrorMessage('Quantity and price must be valid numbers');
      setShowErrorAlert(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isLoading) return;

    setIsLoading(true);

    try {
      const coin = {
        id: Date.now().toString(),
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        timestamp: new Date().toISOString(),
      };

      const success = await addCoin(coin);

      if (!success) {
        throw new Error('Failed to add coin');
      }

      // Clear form
      setName('');
      setSymbol('');
      setQuantity('');
      setPrice('');
      setShowSuccessAlert(true);

    } catch (error) {
      console.error('Error adding coin:', error);
      setErrorMessage('Failed to add coin. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1A1A1A']}
      style={styles.container}
    >
      <LinearGradient
        colors={['#000000', '#1A1A1A']}
        style={styles.header}
      >
        <Text style={[styles.title, commonStyles.gradientText]}>
          Add New Coin
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <LinearGradient
          colors={['#000000', '#1A1A1A']}
          style={[styles.formCard, commonStyles.gradientCard]}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Coin Name</Text>
            <TextInput
              style={[styles.input, { color: theme.dark.text }]}
              placeholder="e.g. Bitcoin"
              placeholderTextColor={theme.dark.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Symbol</Text>
            <TextInput
              style={[styles.input, { color: theme.dark.text }]}
              placeholder="e.g. BTC"
              placeholderTextColor={theme.dark.textSecondary}
              value={symbol}
              onChangeText={setSymbol}
              autoCapitalize="characters"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={[styles.input, { color: theme.dark.text }]}
              placeholder="0.00"
              placeholderTextColor={theme.dark.textSecondary}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (USD)</Text>
            <TextInput
              style={[styles.input, { color: theme.dark.text }]}
              placeholder="0.00"
              placeholderTextColor={theme.dark.textSecondary}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#F7DC6F', '#F2C464']}
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.submitButtonText}>Add Coin</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {showSuccessAlert && (
        <CustomAlert
          visible={showSuccessAlert}
          title="Success! 🎉"
          message="Coin added successfully!"
          buttons={[
            {
              text: 'OK',
              style: 'default',
              onPress: () => {
                setShowSuccessAlert(false);
                router.push('/tabs');
              }
            }
          ]}
          onDismiss={() => {
            setShowSuccessAlert(false);
            router.push('/tabs');
          }}
        />
      )}

      {showErrorAlert && (
        <CustomAlert
          visible={showErrorAlert}
          title="Error"
          message={errorMessage}
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
  header: {
    padding: 16,
    paddingTop: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7DC6F',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#F7DC6F',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  submitButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
