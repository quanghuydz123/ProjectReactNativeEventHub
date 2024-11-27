import React, { useEffect, useState } from "react"

import { CategoriesList, ContainerComponent, CricleComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TagComponent, TextComponent } from "../../components"
import { StyleSheet, Text } from "react-native";


const MapScreen = ({ navigation }: any) => {
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
          console.log("hết thời gian");
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);
  return (
    <>
    <ContainerComponent title={'Bảng đồ'} >
      <SectionComponent styles={{justifyContent:'center',alignItems:'center',backgroundColor:'red'}}>
      <Text style={styles.timerText}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      </SectionComponent>
    </ContainerComponent>
  </>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapScreen;