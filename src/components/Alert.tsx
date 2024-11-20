import { Alert, Button, Text, View } from "react-native"
import React from "react"
interface Props {
    title:string,
    message:string,
    onCancel?:()=>void,
    onConfirm?:()=>void
}

export const AlertComponent = (props:Props) =>
{
    const {title,message,onCancel,onConfirm} = props
    Alert.alert(title, message, [
        { text: onConfirm ? "Ok" : undefined, onPress:onConfirm },

        {
            text: onCancel ? "Cancel" : undefined,
            onPress: onCancel,
            style: 'cancel',
            
        },
    ]);
}
