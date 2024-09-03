import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../components";
import QRCode from "react-native-qrcode-svg";

export const TransactionHistoryScreen = ()=>{
  return (
    <ContainerComponent back title={"Lịch sử giao dịch"}>
        <SectionComponent>
        <QRCode
          value={JSON.stringify({
            idEvent:'666b0dcfedb7fe46ae8ecdd9',
            type:"event"
          })}
          size={200}
        />
        </SectionComponent>
    </ContainerComponent>
  )
}
export default TransactionHistoryScreen;