import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { Card, Screen, ui } from "../../src/components/Screen";
import { lessons } from "../../src/data/catalog";
export default function Lesson(){const {lessonId}=useLocalSearchParams<{lessonId:string}>();const lesson=lessons[Math.max(0,Number(lessonId)-1)]||lessons[0];return <Screen eyebrow={`LESSON ${lessonId||1} · 6 MIN`} title={lesson}><Card><Text style={ui.heading}>The big idea</Text><Text style={ui.body}>A debate move is useful only when the listener can see how one sentence connects to the next.</Text></Card><Card><Text style={ui.meta}>WHAT GOOD LOOKS LIKE</Text><Text style={ui.body}>I think … because … For example, imagine … This matters because …</Text></Card><Card><Text style={ui.meta}>MINI DRILL</Text><Text style={ui.body}>Build one four-sentence argument in ninety seconds.</Text></Card></Screen>}
