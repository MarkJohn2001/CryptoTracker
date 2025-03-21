import AsyncStorage from '@react-native-async-storage/async-storage';

const PORTFOLIO_KEY = '@crypto_portfolio';
const HISTORY_KEY = '@price_history';

// Initialize storage with empty arrays if not exists
export const initializeStorage = async () => {
  try {
    const portfolio = await AsyncStorage.getItem(PORTFOLIO_KEY);
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    
    if (portfolio === null) {
      await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify([]));
    }
    if (history === null) {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
    }
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};

export const savePortfolio = async (portfolio) => {
  try {
    if (!Array.isArray(portfolio)) {
      throw new Error('Portfolio must be an array');
    }
    await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
    return true;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    throw error;
  }
};

export const getPortfolio = async () => {
  try {
    const portfolio = await AsyncStorage.getItem(PORTFOLIO_KEY);
    return portfolio ? JSON.parse(portfolio) : [];
  } catch (error) {
    console.error('Error getting portfolio:', error);
    throw error;
  }
};

export const savePriceHistory = async (history) => {
  try {
    if (!Array.isArray(history)) {
      throw new Error('History must be an array');
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving price history:', error);
    throw error;
  }
};

export const getPriceHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting price history:', error);
    throw error;
  }
};
