import React, { useEffect, useRef, useState } from 'react';
import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';
import { Badge } from 'react-native-paper';
import { Switch } from 'react-native-gesture-handler';
const EventsScreen = ({navigation,route}:any) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (

    <ContainerComponent>
      <View>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </View>
    </ContainerComponent>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventsScreen;
