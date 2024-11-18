import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constrants/fontFamilies';
import SpaceComponent from './SpaceComponent';
import { colors } from '../constrants/color';
interface Props {
    data:{name:string,code:number}[],
    titleButton?:string,
    title?:string,
    disabled?:boolean,
    titlePlaceholder?:string,
    valueSelected:{name:string,code:number},
    onSelect:(val:{name:string,code:string})=>void
  }

const SelectDropdownComponent = (props:Props) => {
  const [isFocus, setIsFocus] = useState(false);
  const {data,titleButton,title,disabled,titlePlaceholder = '',onSelect,valueSelected} = props
  const [transformedData ,setTransformedData] = useState<{name:string,code:string}[]>([])
  useEffect(()=>{
    if(data){
      setTransformedData(data.map(item => ({
        name: item.name,
        code: item.code.toString()
      })))
    }
  },[data])
  // const renderLabel = () => {
  //   if (value || isFocus) {
  //     return (
  //       <Text style={[styles.label, isFocus && { color: 'blue' }]}>
  //         Dropdown label
  //       </Text>
  //     );
  //   }
  //   return null;
  // };
  // console.log("valueSelected.code.toString()",typeof valueSelected.code)
  return (
    <View style={styles.container}>
      <TextComponent text={title ?? ''} size={14} font={fontFamilies.medium}/>
      <SpaceComponent height={8}/>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: colors.gray4 }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={transformedData}
        search
        disable={disabled}
        maxHeight={300}
        labelField="name"
        valueField="code"
        placeholder={!isFocus ? titleButton : titlePlaceholder}
        searchPlaceholder="Search..."
        value={valueSelected?.code?.toString() ?? '0'}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          // setValue(item.value);
          onSelect(item)
          setIsFocus(false);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.icon}
        //     color={isFocus ? 'blue' : 'black'}
        //     name="Safety"
        //     size={20}
        //   />
        // )}
      />
    </View>
  );
};

export default SelectDropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  dropdown: {
    height: 50,
    borderColor: colors.gray4,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 12,
  },
 
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
});