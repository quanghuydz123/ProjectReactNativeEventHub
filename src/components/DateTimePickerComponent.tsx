import { Button, Text, View } from "react-native"
import React, { useRef, useState } from "react"
import DatePicker from "react-native-date-picker"
import RowComponent from "./RowComponent"
import TextComponent from "./TextComponent"
import { ArrowDown2, Calendar, Clock } from "iconsax-react-native"
import { colors } from "../constrants/color"
import { globalStyles } from "../styles/globalStyles"
import { fontFamilies } from "../constrants/fontFamilies"
import { DateTime } from "../utils/DateTime"
import SpaceComponent from "./SpaceComponent"
interface Props {
  selected?: Date,
  type: 'date' | 'time',
  onSelect: (val: any) => void,
  title?:string
}
const DateTimePickerComponent = (props: Props) => {

  const { selected, type, onSelect,title } = props
  const [isShowDatePicker, setIsShowDatePicker] = useState(false)
  const handleComfirm = (val: Date) => {
    setIsShowDatePicker(false)
    onSelect(val)
  }
  return (
    <View style={{
      flex: 1
    }}>
      {
        title && (
          <>
          <TextComponent text={title}/>
          <SpaceComponent height={8} />
          </>
        )
      }

      <RowComponent styles={[
        globalStyles.inputContainer,
      ]}
        onPress={() => setIsShowDatePicker(true)}
      >
        <TextComponent text={`${selected ? type === 'time' ? DateTime.GetTime(selected) : DateTime.GetDate(selected) : 'Chọn thời gian'}`}
          flex={1} font={fontFamilies.medium}
          styles={{
            textAlign: 'center'
          }}
        />
        {
          type === 'time' 
          ? 
          <Clock size={22} color={colors.gray} />
          :
          <Calendar size={22} color={colors.gray} />
        }
      </RowComponent>
      <DatePicker mode={type} date={new Date()} modal open={isShowDatePicker} onCancel={() => setIsShowDatePicker(false)}
        onConfirm={(val) => handleComfirm(val)}
      />
    </View>
  )
}
export default DateTimePickerComponent;