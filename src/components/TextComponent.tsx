import { Animated, Platform, StyleProp, Text, TextStyle } from "react-native";
import React, { memo } from "react";
import { colors } from "../constrants/color";
import { fontFamilies } from "../constrants/fontFamilies";
import { globalStyles } from "../styles/globalStyles";

interface Props {
  text: string | string[] | number;
  color?: string;
  size?: number;
  flex?: number;
  font?: string;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
  numberOfLine?: number;
  textAlign?: 'center' | 'left' | 'auto' | 'right' | 'justify';
  isAnimationHiden?: boolean;
  animatedValue?: any;
  paddingVertical?:number
}

const TextComponent = (props: Props) => {
  const {
    text, size, flex, font, color, styles, title,
    numberOfLine, textAlign, isAnimationHiden, animatedValue,paddingVertical
  } = props;

  const fontSizeDefault = Platform.OS === 'ios' ? 16 : 14;
  const lineHeight = size ? size + 6 : title ? 30 : Platform.OS === 'ios' ? 20 : 18;

  const textStyle = [
    globalStyles.text,
    {
      color: color ?? colors.colorText,
      flex: flex ?? 0,
      fontSize: size ?? (title ? 24 : fontSizeDefault),
      fontFamily: font ?? (title ? fontFamilies.medium : ''),
      lineHeight,
      textAlign: textAlign ?? 'left',
      paddingVertical:paddingVertical ?? paddingVertical,
      
    },
    styles
  ];

  const animatedStyle = isAnimationHiden && animatedValue ? {
    transform: [
      {
        scaleX: animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        }),
      },
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 25],
          outputRange: [0, -100],
          extrapolate: 'clamp',
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 25],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  } : {};

  const TextComponent = isAnimationHiden ? Animated.Text : Text;

  return (
    <TextComponent style={[animatedStyle, ...textStyle]} numberOfLines={numberOfLine}>
      {text}
    </TextComponent>
  );
}

export default memo(TextComponent);
