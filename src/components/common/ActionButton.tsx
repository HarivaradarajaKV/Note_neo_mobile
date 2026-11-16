import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ActionButton: React.FC<Props> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  loading,
  disabled,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: '#F1F5F9', border: '#E2E8F0', text: '#334155' };
      case 'success':
        return { bg: '#10B981', border: '#059669', text: '#FFFFFF' };
      case 'danger':
        return { bg: '#EF4444', border: '#DC2626', text: '#FFFFFF' };
      case 'outline':
        return { bg: 'transparent', border: '#3B82F6', text: '#2563EB' };
      default:
        return { bg: '#2563EB', border: '#1D4ED8', text: '#FFFFFF' };
    }
  };

  const colors = getButtonStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: colors.bg, borderColor: colors.border },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={colors.text}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: colors.text }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});

