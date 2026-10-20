import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#F3F5F8" },
          headerTintColor: "#526D8F",
          contentStyle: { backgroundColor: "#F3F5F8" },
        }}
      >
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="briefing/[topicId]" options={{title:"Pre-debate briefing"}}/>
        <Stack.Screen name="debate/[sessionId]" options={{title:"Debate studio"}}/>
        <Stack.Screen name="review/[sessionId]" options={{title:"Coach report"}}/>
        <Stack.Screen name="lesson/[lessonId]" options={{title:"Learning hub"}}/>
      </Stack>
    </>
  );
}
