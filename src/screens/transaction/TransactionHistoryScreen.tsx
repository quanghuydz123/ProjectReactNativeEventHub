import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";

export const TransactionHistoryScreen = ()=>{
  return (
    <ContainerComponent>
        <SectionComponent>
            <TextComponent text={'TransactionHistoryScreen'}/>
        </SectionComponent>
    </ContainerComponent>
  )
}
export default TransactionHistoryScreen;