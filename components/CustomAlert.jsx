import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, commonStyles } from '../constants/theme';

const CustomAlert = ({ visible, title, message, buttons, onDismiss, customContent }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity activeOpacity={1}>
            <LinearGradient
              colors={theme.dark.cardGradient}
              style={[styles.modalView, commonStyles.gradientCard]}
            >
              <Text style={[styles.title, commonStyles.gradientText]}>
                {title}
              </Text>
              {message && (
                <Text style={styles.message}>
                  {message}
                </Text>
              )}
              {customContent}
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.buttonWrapper,
                      index < buttons.length - 1 && styles.buttonMargin
                    ]}
                    onPress={button.onPress}
                  >
                    <LinearGradient
                      colors={
                        button.style === 'cancel'
                          ? ['#333333', '#1A1A1A']
                          : theme.dark.primaryGradient
                      }
                      style={[styles.button, commonStyles.gradientButton]}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          button.style === 'cancel' && styles.cancelButtonText
                        ]}
                      >
                        {button.text}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    width: Dimensions.get('window').width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.dark.border,
  },
  title: {
    fontSize: 20,
    color: theme.dark.primary,
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: theme.dark.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  buttonMargin: {
    marginRight: 10,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: theme.dark.textSecondary,
  },
});

export default CustomAlert;
