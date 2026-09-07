import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.tag}>KYOTO, JAPAN</Text>
        <Text style={styles.title}>Trip Overview</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Day 1: Arashiyama Bamboo Grove</Text>
          <Text style={styles.cardSubtitle}>09:00 AM • 4 Group Members</Text>
        </View>

        <PrimaryButton 
          title="Plan Itinerary" 
          onPress={() => console.log('Button pressed')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.four,
  },
  tag: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.4,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});