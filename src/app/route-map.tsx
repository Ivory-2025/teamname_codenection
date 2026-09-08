import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ItineraryStop {
  id: string;
  time: string;
  title: string;
  category: string;
  operatingHours: string;
  isClash?: boolean;
  transitToNext?: {
    mode: 'subway' | 'car' | 'walk';
    label: string;
    duration: string;
    cost?: string;
  };
}

const SAMPLE_STOPS: ItineraryStop[] = [
  {
    id: '1',
    time: '09:00 AM',
    title: 'Arashiyama Bamboo Grove',
    category: 'Sightseeing',
    operatingHours: 'Open 24 hours',
    isClash: false,
    transitToNext: {
      mode: 'subway',
      label: 'Subway & Walk',
      duration: '22 min',
      cost: '¥240',
    },
  },
  {
    id: '2',
    time: '12:30 PM',
    title: 'Nishiki Market Food Crawl',
    category: 'Food & Dining',
    operatingHours: '10:00 AM – 06:00 PM',
    isClash: false,
    transitToNext: {
      mode: 'car',
      label: 'Grab / Taxi',
      duration: '14 min',
      cost: 'RM 16',
    },
  },
  {
    id: '3',
    time: '06:15 PM',
    title: 'Kinkaku-ji (Golden Pavilion)',
    category: 'Culture & Temple',
    operatingHours: '09:00 AM – 05:00 PM',
    isClash: true,
  },
];

export default function RouteMapScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [beaconVisible, setBeaconVisible] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800);

  useEffect(() => {
    if (!beaconVisible) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [beaconVisible]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.circleButton}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Interactive Route Map</Text>
        </View>

        <TouchableOpacity
          onPress={() => setBeaconVisible(true)}
          style={styles.beaconButton}
          activeOpacity={0.85}
        >
          <Ionicons name="radio" size={13} color="#B45309" />
          <Text style={styles.beaconButtonText}>Beacon</Text>
        </TouchableOpacity>
      </View>

      {/* Day Selector Bar */}
      <View style={styles.daySelectorBar}>
        {[1, 2, 3].map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
          >
            <Text style={[styles.dayChipText, selectedDay === day && styles.dayChipTextActive]}>
              Day {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Map Blueprint Container */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeaderRow}>
            <View style={styles.routePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.routePillText}>Day {selectedDay} Vector Route</Text>
            </View>
            <Text style={styles.mapPaceText}>Pacing: Steady</Text>
          </View>

          {/* Connected Waypoints Visualizer */}
          <View style={styles.routeVisual}>
            <View style={styles.routeNode}>
              <View style={styles.pinBubble}>
                <Text style={styles.pinNumber}>1</Text>
              </View>
              <Text style={styles.pinLabel} numberOfLines={1}>Arashiyama</Text>
            </View>

            <View style={styles.routeVector}>
              <Ionicons name="train" size={13} color="#0D9488" />
              <Text style={styles.vectorTime}>22m</Text>
            </View>

            <View style={styles.routeNode}>
              <View style={styles.pinBubble}>
                <Text style={styles.pinNumber}>2</Text>
              </View>
              <Text style={styles.pinLabel} numberOfLines={1}>Nishiki</Text>
            </View>

            <View style={styles.routeVector}>
              <Ionicons name="car" size={13} color="#0D9488" />
              <Text style={styles.vectorTime}>14m</Text>
            </View>

            <View style={styles.routeNode}>
              <View style={[styles.pinBubble, styles.pinBubbleClash]}>
                <Text style={styles.pinNumber}>3</Text>
              </View>
              <Text style={[styles.pinLabel, styles.pinLabelClash]} numberOfLines={1}>Kinkaku-ji</Text>
            </View>
          </View>

          <View style={styles.mapFooterRow}>
            <Text style={styles.transitTotalText}>Total Transit: ~36 mins</Text>
            <View style={styles.liveSyncBadge}>
              <Ionicons name="compass-outline" size={12} color="#94A3B8" />
              <Text style={styles.liveSyncText}>Live Transit Sync</Text>
            </View>
          </View>
        </View>

        {/* Schedule Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionHeader}>Day {selectedDay} Schedule</Text>

          {SAMPLE_STOPS.map((stop, index) => (
            <View key={stop.id}>
              {/* Activity Stop Card */}
              <View style={[styles.stopCard, stop.isClash && styles.stopCardClash]}>
                <View style={styles.stopHeader}>
                  <View style={styles.stopHeaderLeft}>
                    <View style={[styles.stopBadge, stop.isClash && styles.stopBadgeClash]}>
                      <Text style={styles.stopBadgeText}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.stopTime, stop.isClash && styles.stopTimeClash]}>
                      {stop.time}
                    </Text>
                  </View>

                  {stop.isClash ? (
                    <View style={styles.clashBadge}>
                      <Ionicons name="alert-circle" size={11} color="#DC2626" />
                      <Text style={styles.clashBadgeText}>Closed at Arrival</Text>
                    </View>
                  ) : (
                    <Text style={styles.categoryBadge}>{stop.category}</Text>
                  )}
                </View>

                <Text style={[styles.stopTitle, stop.isClash && styles.stopTitleClash]}>
                  {stop.title}
                </Text>

                <View style={styles.stopMetaRow}>
                  <Text style={styles.stopCategoryText}>{stop.category}</Text>
                  <Text style={[styles.hoursText, stop.isClash && styles.hoursTextClash]}>
                    Hours: {stop.operatingHours}
                  </Text>
                </View>

                {stop.isClash && (
                  <TouchableOpacity style={styles.swapButton} activeOpacity={0.8}>
                    <Ionicons name="swap-horizontal" size={13} color="#FFFFFF" />
                    <Text style={styles.swapButtonText}>Swap with Open Alternative</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Transit Chip Buffer */}
              {stop.transitToNext && (
                <View style={styles.transitBuffer}>
                  <View style={styles.transitLine} />
                  <View style={styles.transitChip}>
                    <Ionicons
                      name={stop.transitToNext.mode === 'subway' ? 'train-outline' : 'car-outline'}
                      size={13}
                      color="#374151"
                    />
                    <Text style={styles.transitDuration}>{stop.transitToNext.duration}</Text>
                    <Text style={styles.transitDot}>•</Text>
                    <Text style={styles.transitLabel}>{stop.transitToNext.label}</Text>
                    {stop.transitToNext.cost && (
                      <>
                        <Text style={styles.transitDot}>•</Text>
                        <Text style={styles.transitCost}>{stop.transitToNext.cost}</Text>
                      </>
                    )}
                  </View>
                  <View style={styles.transitLine} />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Regroup Beacon Modal Sheet */}
      <Modal
        visible={beaconVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBeaconVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.beaconSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.beaconTitleRow}>
              <View>
                <Text style={styles.beaconSheetHeading}>📍 Regroup Beacon</Text>
                <Text style={styles.beaconSheetSub}>Radar active for current group</Text>
              </View>
              <View style={styles.radarPill}>
                <Text style={styles.radarPillText}>RADAR ACTIVE</Text>
              </View>
            </View>

            <View style={styles.meetupCard}>
              <Text style={styles.meetupLabel}>DESIGNATED MEETUP PIN</Text>
              <Text style={styles.meetupTitle}>⛩️ Hachiko Statue / Main Gate</Text>
              <Text style={styles.meetupDistance}>120m away from your location</Text>
            </View>

            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>TIME REMAINING TO MEET</Text>
              <Text style={styles.timerDigits}>{formatTimer(timeLeftSeconds)}</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Companions Nearby:</Text>
              <Text style={styles.statusValue}>3 of 4 Checked In</Text>
            </View>

            <TouchableOpacity
              onPress={() => setBeaconVisible(false)}
              style={styles.closeBeaconButton}
              activeOpacity={0.8}
            >
              <Text style={styles.closeBeaconText}>Close Beacon Overlay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  beaconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  beaconButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  daySelectorBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  dayChipActive: {
    backgroundColor: '#0D9488',
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mapCard: {
    margin: 16,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  routePillText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  mapPaceText: {
    color: '#2DD4BF',
    fontSize: 11,
    fontWeight: '700',
  },
  routeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 22,
    paddingHorizontal: 6,
  },
  routeNode: {
    alignItems: 'center',
    width: 72,
  },
  pinBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pinBubbleClash: {
    backgroundColor: '#EF4444',
  },
  pinNumber: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  pinLabel: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  pinLabelClash: {
    color: '#FCA5A5',
  },
  routeVector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  vectorTime: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
  },
  mapFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  transitTotalText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  liveSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveSyncText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  timelineSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  stopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stopCardClash: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stopHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBadgeClash: {
    backgroundColor: '#DC2626',
  },
  stopBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stopTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  stopTimeClash: {
    color: '#DC2626',
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  clashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  clashBadgeText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  stopTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stopTitleClash: {
    color: '#991B1B',
  },
  stopMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  stopCategoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  hoursText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  hoursTextClash: {
    color: '#DC2626',
    fontWeight: '700',
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 10,
  },
  swapButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  transitBuffer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  transitLine: {
    width: 2,
    height: 12,
    backgroundColor: '#D1D5DB',
  },
  transitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  transitDuration: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  transitDot: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  transitLabel: {
    fontSize: 11,
    color: '#4B5563',
  },
  transitCost: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  beaconSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 34,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  beaconTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  beaconSheetHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  beaconSheetSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  radarPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  radarPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  meetupCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  meetupLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  meetupDistance: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 2,
  },
  timerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  timerLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  timerDigits: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginVertical: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  closeBeaconButton: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeBeaconText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});