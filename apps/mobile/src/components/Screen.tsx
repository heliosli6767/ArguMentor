import type { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme/tokens";

export function Screen({children,title,eyebrow,footer}:{children:ReactNode;title:string;eyebrow?:string;footer?:ReactNode}){
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>{eyebrow&&<Text style={styles.eyebrow}>{eyebrow}</Text>}<Text style={styles.title}>{title}</Text>{children}{footer&&<View style={styles.footer}>{footer}</View>}</ScrollView></SafeAreaView>;
}
export function Card({children}:PropsWithChildren){return <View style={styles.card}>{children}</View>}
export const ui=StyleSheet.create({heading:{fontSize:18,fontWeight:"600",color:colors.text},body:{fontSize:15,lineHeight:23,color:colors.muted},meta:{fontSize:12,lineHeight:18,color:"#91A0B2"},button:{backgroundColor:colors.primary,paddingVertical:14,paddingHorizontal:18,borderRadius:12,alignItems:"center"},buttonText:{color:"white",fontSize:15,fontWeight:"600"},softButton:{backgroundColor:colors.surfaceSoft,paddingVertical:13,paddingHorizontal:16,borderRadius:12,alignItems:"center"},softButtonText:{color:colors.text,fontSize:14,fontWeight:"600"},tag:{alignSelf:"flex-start",fontSize:11,color:"#7892B3",backgroundColor:colors.surfaceSoft,paddingHorizontal:9,paddingVertical:5,borderRadius:7}});
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:spacing.lg,gap:spacing.md},eyebrow:{fontSize:11,letterSpacing:1.3,color:"#879AB2"},title:{fontSize:36,lineHeight:41,fontWeight:"600",letterSpacing:-1.2,color:colors.text,marginBottom:4},card:{backgroundColor:colors.surface,borderColor:colors.border,borderWidth:1,borderRadius:18,padding:20,gap:10},footer:{marginTop:10}});
