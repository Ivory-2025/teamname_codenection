import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const UPCOMING_TRIP = {
  title: 'Autumn in Kansai',
  destination: 'Kyoto & Osaka, Japan',
  dates: 'Oct 14 – Oct 22, 2026',
  countdown: '36 days to go',
  coverImage:
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80',
  collaborators: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  ],
  todaySchedule: [
    { time: '09:00 AM', title: 'Arashiyama Bamboo Grove', type: 'Sightseeing' },
    { time: '12:30 PM', title: 'Nishiki Market Food Crawl', type: 'Food' },
    { time: '03:00 PM', title: 'Kinkaku-ji (Golden Pavilion)', type: 'Culture' },
  ],
};

const SAVED_TRIPS = [
  {
    id: '1',
    title: 'Hokkaido Snow Drift',
    dates: 'Jan 2027 • 6 days',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=500&auto=format&fit=crop&q=80',
    placesCount: 14,
  },
  {
    id: '2',
    title: 'Seoul Cafe Hopping',
    dates: 'May 2027 • 4 days',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=500&auto=format&fit=crop&q=80',
    placesCount: 22,
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Minimal Greeting Bar */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingSub}>WELCOME BACK</Text>
            <Text style={styles.greetingTitle}>Your Journeys</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Featured / Active Trip Card (Wanderlog Style Hero) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Upcoming Trip</Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.heroCard}>
            <Image source={{ uri: UPCOMING_TRIP.coverImage }} style={styles.heroImage} />
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{UPCOMING_TRIP.countdown}</Text>
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.heroDates}>{UPCOMING_TRIP.dates}</Text>
              <Text style={styles.heroTitle}>{UPCOMING_TRIP.title}</Text>
              <Text style={styles.heroSub}>{UPCOMING_TRIP.destination}</Text>

              {/* Collaborators row & view trip action */}
              <View style={styles.heroFooter}>
                <View style={styles.collabRow}>
                  {UPCOMING_TRIP.collaborators.map((avatar, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: avatar }}
                      style={[styles.collabAvatar, { marginLeft: idx > 0 ? -8 : 0 }]}
                    />
                  ))}
                  <View style={[styles.collabAvatar, styles.collabPlus]}>
                    <Text style={styles.collabPlusText}>+2</Text>
                  </View>
                </View>

                <View style={styles.viewPlanButton}>
                  <Text style={styles.viewPlanText}>Open Itinerary</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Timeline Itinerary Preview */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Day 1 Overview</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Full Schedule</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timelineCard}>
            {UPCOMING_TRIP.todaySchedule.map((item, idx) => (
              <View key={idx} style={styles.timelineRow}>
                <View style={styles.timelineIndicator}>
                  <View style={styles.timelineDot} />
                  {idx < UPCOMING_TRIP.todaySchedule.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineDetails}>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineType}>{item.type}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Saved Plans & Past Trips (Horizontal Carousel) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Saved Itineraries</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.savedScroll}
          >
            {SAVED_TRIPS.map((trip) => (
              <TouchableOpacity key={trip.id} activeOpacity={0.85} style={styles.savedCard}>
                <Image source={{ uri: trip.image }} style={styles.savedImage} />
                <View style={styles.savedOverlay}>
                  <Text style={styles.savedPlacesBadge}>{trip.placesCount} places</Text>
                  <View>
                    <Text style={styles.savedTitle}>{trip.title}</Text>
                    <Text style={styles.savedDates}>{trip.dates}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 110, // Leaves room for the floating liquid tab bar
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  greetingSub: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '700',
    color: Colors.light.textTertiary,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.4,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.3,
    marginBottom: Spacing.two,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  heroCard: {
    borderRadius: Radius.card,
    backgroundColor: Colors.light.card,
    overflow: 'hidden',
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
  },
  heroImage: {
    width: '100%',
    height: 170,
  },
  heroBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  heroContent: {
    padding: Spacing.three,
  },
  heroDates: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  heroSub: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collabRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collabAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  collabPlus: {
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  collabPlusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  viewPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.backgroundSelected,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
  },
  viewPlanText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineCard: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    padding: Spacing.three,
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineIndicator: {
    alignItems: 'center',
    width: 18,
    marginRight: 10,
    height: 48,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.backgroundSelected,
    marginTop: 5,
  },
  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: Colors.light.border,
    marginVertical: 4,
  },
  timelineDetails: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  timelineType: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  savedScroll: {
    gap: Spacing.three,
  },
  savedCard: {
    width: width * 0.52,
    height: 180,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  savedImage: {
    width: '100%',
    height: '100%',
  },
  savedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  savedPlacesBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  savedTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  savedDates: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
});