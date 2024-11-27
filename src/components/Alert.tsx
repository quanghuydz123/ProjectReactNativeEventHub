import { Alert, Button, Text, View } from "react-native"
import React from "react"
interface Props {
    title:string,
    message:string,
    onCancel?:()=>void,
    onConfirm?:()=>void
}

export const AlertComponent = (props: Props) => {
    const { title, message, onCancel, onConfirm } = props;

    const buttons = [];
    if (onConfirm) {
        buttons.push({ text: "Ok", onPress: onConfirm });
    }
    if (onCancel) {
        buttons.push({
            text: "Cancel",
            onPress: onCancel,
        });
    }

    Alert.alert(title, message, buttons);
};
