import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlanScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9FB', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Plan Itinerary</Text>
    </SafeAreaView>
  );
}