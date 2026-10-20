import { Tabs } from "expo-router";
import { colors } from "../../src/theme/tokens";
export default function TabLayout(){return <Tabs screenOptions={{headerStyle:{backgroundColor:colors.background},headerTintColor:colors.text,tabBarActiveTintColor:colors.primary,tabBarStyle:{backgroundColor:colors.surface,borderTopColor:colors.border}}}><Tabs.Screen name="index" options={{title:"Practice"}}/><Tabs.Screen name="learn" options={{title:"Learn"}}/><Tabs.Screen name="motions" options={{title:"Motions"}}/><Tabs.Screen name="history" options={{title:"Parent"}}/></Tabs>}
