import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { savePortfolio, getPortfolio, savePriceHistory, getPriceHistory, initializeStorage } from '../utils/storage';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeStorage();
        await loadPortfolio();
        await loadPriceHistory();
      } catch (error) {
        console.error('Error initializing:', error);
      }
    };
    init();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setPortfolio(data || []);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setPortfolio([]);
    }
  };

  const loadPriceHistory = async () => {
    try {
      const data = await getPriceHistory();
      setPriceHistory(data || []);
    } catch (error) {
      console.error('Error loading price history:', error);
      setPriceHistory([]);
    }
  };

  const addCoin = async (coin) => {
    try {
      const updatedPortfolio = [...portfolio, coin];
      await savePortfolio(updatedPortfolio);
      setPortfolio(updatedPortfolio);

      const historyEntry = {
        ...coin,
        type: 'add',
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [...priceHistory, historyEntry];
      await savePriceHistory(updatedHistory);
      setPriceHistory(updatedHistory);
      return true;
    } catch (error) {
      console.error('Error adding coin:', error);
      throw error;
    }
  };

  const deleteCoin = async (coinId) => {
    try {
      console.log('Deleting coin with ID:', coinId);
      const coinToDelete = portfolio.find(coin => coin.id === coinId);
      if (!coinToDelete) {
        throw new Error('Coin not found');
      }

      const updatedPortfolio = portfolio.filter(coin => coin.id !== coinId);
      await savePortfolio(updatedPortfolio);
      setPortfolio(updatedPortfolio);

      const historyEntry = {
        ...coinToDelete,
        type: 'delete',
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [...priceHistory, historyEntry];
      await savePriceHistory(updatedHistory);
      setPriceHistory(updatedHistory);
    } catch (error) {
      console.error('Error deleting coin:', error);
      throw error;
    }
  };

  const editCoin = async (coinId, updatedData) => {
    try {
      console.log('Editing coin with ID:', coinId);
      const coinIndex = portfolio.findIndex(coin => coin.id === coinId);
      if (coinIndex === -1) {
        throw new Error('Coin not found');
      }

      const updatedPortfolio = [...portfolio];
      updatedPortfolio[coinIndex] = {
        ...updatedPortfolio[coinIndex],
        ...updatedData,
        id: coinId // Ensure ID doesn't change
      };

      await savePortfolio(updatedPortfolio);
      setPortfolio(updatedPortfolio);

      const historyEntry = {
        ...updatedPortfolio[coinIndex],
        type: 'edit',
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [...priceHistory, historyEntry];
      await savePriceHistory(updatedHistory);
      setPriceHistory(updatedHistory);
    } catch (error) {
      console.error('Error editing coin:', error);
      throw error;
    }
  };

  return (
    <PortfolioContext.Provider 
      value={{ 
        portfolio, 
        priceHistory,
        addCoin,
        deleteCoin,
        editCoin
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
