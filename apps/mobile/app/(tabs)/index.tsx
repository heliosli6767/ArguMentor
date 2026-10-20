import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { Card, Screen, ui } from "../../src/components/Screen";
export default function Home(){return <Screen eyebrow="YOUR THINKING SPACE" title={"A little practice.\nA clearer voice."}><Text style={ui.body}>Learn one debate move, prepare both sides, then practise in English.</Text><Card><Text style={ui.tag}>LEVEL 1</Text><Text style={ui.heading}>Should weekends be homework-free?</Text><Text style={ui.body}>A familiar decision about learning, rest and family time.</Text><Link href="/briefing/homework" asChild><Pressable style={ui.button}><Text style={ui.buttonText}>Start today’s practice</Text></Pressable></Link></Card></Screen>}
