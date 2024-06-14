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
  selected: Date,
  type: 'date' | 'datetime',
  onSelect: (val: any) => void,
  title?:string,
  minimumDate?:Date,
}
const DateTimePickerComponent = (props: Props) => {

  const { selected, type, onSelect,title,minimumDate } = props
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
        <TextComponent text={`${selected ? type === 'datetime' ? DateTime.GetTime(selected) : DateTime.GetDate(selected) : 'Chọn thời gian'}`}
          flex={1} font={fontFamilies.medium}
          styles={{
            textAlign: 'center'
          }}
        />
        {
          type === 'datetime'
          ? 
          <Clock size={22} color={colors.gray} />
          :
          <Calendar size={22} color={colors.gray} />
        }
      </RowComponent>
      {/* {
        type === 'datetime' ? <DatePicker mode={type} date={minimumDate ? new Date(minimumDate) : new Date()}   modal open={isShowDatePicker} onCancel={() => setIsShowDatePicker(false)}
        onConfirm={(val) => handleComfirm(val)}
      /> :<DatePicker mode={type} date={new Date(selected)}  modal open={isShowDatePicker} onCancel={() => setIsShowDatePicker(false)}
      onConfirm={(val) => handleComfirm(val)}
    /> 
      } */}
       <DatePicker title={title} cancelText="Hủy" confirmText="Xác nhận" mode={type} date={minimumDate ? new Date(minimumDate) : new Date(selected)} modal open={isShowDatePicker} onCancel={() => setIsShowDatePicker(false)}
        onConfirm={(val) => handleComfirm(val)}
      />
    </View>
  )
}
export default DateTimePickerComponent;