import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { Card, Screen, ui } from "../../src/components/Screen";
import { motions } from "../../src/data/catalog";
export default function Motions(){return <Screen eyebrow="MOTION LIBRARY" title="Choose a question worth asking.">{motions.map(motion=><Link key={motion.id} href={{pathname:"/briefing/[topicId]",params:{topicId:motion.id}}} asChild><Pressable><Card><Text style={ui.tag}>LEVEL {motion.level}</Text><Text style={ui.heading}>{motion.title}</Text><Text style={ui.body}>{motion.context}</Text></Card></Pressable></Link>)}</Screen>}
