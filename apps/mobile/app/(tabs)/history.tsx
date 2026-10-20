import { Pressable, Text } from "react-native";
import { Card, Screen, ui } from "../../src/components/Screen";
import { sessionRepository } from "../../src/storage/session";
export default function Parent(){return <Screen eyebrow="PARENT AREA" title="Privacy first."><Card><Text style={ui.heading}>Local scaffold</Text><Text style={ui.body}>Account sync, live AI, payments and push reminders stay disabled until the parent controls and trusted service are configured.</Text></Card><Pressable style={ui.softButton} onPress={()=>sessionRepository.clear()}><Text style={ui.softButtonText}>Clear in-memory practice</Text></Pressable></Screen>}
