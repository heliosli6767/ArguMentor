import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { Card, Screen, ui } from "../../src/components/Screen";
import { lessons } from "../../src/data/catalog";
export default function Learn(){return <Screen eyebrow="LEARNING HUB" title="Learn the move. Then practise it.">{lessons.map((lesson,index)=><Link key={lesson} href={{pathname:"/lesson/[lessonId]",params:{lessonId:String(index+1)}}} asChild><Pressable><Card><Text style={ui.meta}>{String(index+1).padStart(2,"0")} · 6 MIN</Text><Text style={ui.heading}>{lesson}</Text></Card></Pressable></Link>)}</Screen>}
