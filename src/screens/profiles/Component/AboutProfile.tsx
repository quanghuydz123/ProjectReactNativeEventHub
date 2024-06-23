import { Button, Text, View } from "react-native"
import React from "react"
import { ContainerComponent, SectionComponent, TextComponent } from "../../../components";

const AboutProfile = ()=>{
  return (
    <ContainerComponent back title="Hồ sơ người ta">
        <SectionComponent>
            <TextComponent text="about profile"/>
        </SectionComponent>
    </ContainerComponent>
  )
}
export default AboutProfile;