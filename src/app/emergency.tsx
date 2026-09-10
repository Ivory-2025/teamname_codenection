import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FacilityItem {
  id: string;
  type: 'Hospital' | 'Clinic' | 'Pharmacy';
  name: string;
  distance: string;
  address: string;
  hours: string;
  languages: string;
  phone: string;
}

const FACILITIES: FacilityItem[] = [
  {
    id: '1',
    type: 'Hospital',
    name: 'Kyoto University Hospital',
    distance: '1.4 km away',
    address: '54 Kawahara-cho, Shogoin, Sakyo-ku, Kyoto',
    hours: '24/7 Emergency Room',
    languages: 'English, Japanese',
    phone: '+81-75-751-3111',
  },
  {
    id: '2',
    type: 'Clinic',
    name: 'Gion International Medical Clinic',
    distance: '2.1 km away',
    address: '298 Gionmachi Kitagawa, Higashiyama-ku, Kyoto',
    hours: '09:00 AM – 07:00 PM',
    languages: 'English, Japanese, Chinese',
    phone: '+81-75-533-8822',
  },
  {
    id: '3',
    type: 'Pharmacy',
    name: 'Matsumoto Kiyoshi (English Support)',
    distance: '650 m away',
    address: 'Shijo-dori, Shimogyo-ku, Kyoto',
    hours: 'Open until 10:00 PM',
    languages: 'Tax-Free & Multilingual Staff',
    phone: '+81-75-255-0109',
  },
];

export default function EmergencyHubScreen() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<'All' | 'Hospital' | 'Clinic' | 'Pharmacy'>('All');

  const handleBack = () => {
    router.replace('/itinerary-detail');
  };

  const handleDial = (number: string, label: string) => {
    Alert.alert(`Emergency Call`, `Place immediate call to ${label} (${number})?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call Now',
        style: 'destructive',
        onPress: () => Linking.openURL(`tel:${number}`),
      },
    ]);
  };

  const handleTriggerSOS = () => {
    Alert.alert(
      '🚨 Trigger Distress SOS Beacon?',
      'This pings high-priority alerts with your live coordinates (Higashiyama Ward, Kyoto) to your 4 travel buddies.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Beacon Now',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Beacon Broadcasted', 'GPS beacon sent to Kenji, Chloe, and Marcus.'),
        },
      ]
    );
  };

  const filteredFacilities =
    filterType === 'All'
      ? FACILITIES
      : FACILITIES.filter((f) => f.type === filterType);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.circleBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Emergency Assistance Hub</Text>

        <View style={styles.locationPill}>
          <Text style={styles.locationPillText}>🇯🇵 Kyoto, JP</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Distress SOS Beacon Banner */}
        <TouchableOpacity
          style={styles.sosCard}
          activeOpacity={0.9}
          onPress={handleTriggerSOS}
        >
          <View style={styles.sosIconCircle}>
            <Ionicons name="warning" size={24} color="#DC2626" />
          </View>
          <View style={styles.sosTextContainer}>
            <Text style={styles.sosTitle}>GROUP DISTRESS BEACON (SOS)</Text>
            <Text style={styles.sosSub}>
              Tap to ping immediate GPS alert & high-priority notification to 4 travel members
            </Text>
          </View>
        </TouchableOpacity>

        {/* Local Emergency Services */}
        <Text style={styles.sectionHeading}>LOCAL EMERGENCY SERVICES</Text>

        {/* Police */}
        <View style={[styles.serviceCard, styles.policeBorder]}>
          <View style={styles.serviceLeft}>
            <View style={[styles.serviceIconBox, { backgroundColor: '#DC2626' }]}>
              <Ionicons name="shield" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.serviceName}>Police Emergency</Text>
              <Text style={styles.serviceAgency}>Japan National Police</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.dialPill, { backgroundColor: '#DC2626' }]}
            onPress={() => handleDial('110', 'Police Emergency')}
          >
            <Ionicons name="call" size={13} color="#FFFFFF" />
            <Text style={styles.dialPillText}>110</Text>
          </TouchableOpacity>
        </View>

        {/* Ambulance & Fire */}
        <View style={[styles.serviceCard, styles.fireBorder]}>
          <View style={styles.serviceLeft}>
            <View style={[styles.serviceIconBox, { backgroundColor: '#EA580C' }]}>
              <Ionicons name="flame" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.serviceName}>Ambulance & Fire</Text>
              <Text style={styles.serviceAgency}>Emergency Medical Dispatch</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.dialPill, { backgroundColor: '#EA580C' }]}
            onPress={() => handleDial('119', 'Ambulance & Fire')}
          >
            <Ionicons name="call" size={13} color="#FFFFFF" />
            <Text style={styles.dialPillText}>119</Text>
          </TouchableOpacity>
        </View>

        {/* Embassy */}
        <View style={[styles.serviceCard, styles.embassyBorder]}>
          <View style={styles.serviceLeft}>
            <View style={[styles.serviceIconBox, { backgroundColor: '#2563EB' }]}>
              <Ionicons name="business" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.serviceName}>Nearest Embassy</Text>
              <Text style={styles.serviceAgency}>Embassy of Malaysia, Tokyo</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.dialPill, { backgroundColor: '#2563EB' }]}
            onPress={() => handleDial('+81334763331', 'Embassy of Malaysia')}
          >
            <Ionicons name="call" size={13} color="#FFFFFF" />
            <Text style={styles.dialPillText}>+81-3-3476-3331</Text>
          </TouchableOpacity>
        </View>

        {/* Current GPS Coordinates Card */}
        <View style={styles.gpsCoordCard}>
          <Ionicons name="location" size={16} color="#0D9488" />
          <Text style={styles.gpsCoordText}>
            Your Current GPS: <Text style={styles.boldDark}>Higashiyama Ward, Kyoto (35.0037, 135.7772)</Text>
          </Text>
        </View>

        {/* Verified Nearby Facilities */}
        <Text style={styles.sectionHeading}>VERIFIED NEARBY MEDICAL FACILITIES</Text>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['All', 'Hospital', 'Clinic', 'Pharmacy'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              style={[styles.filterChip, filterType === type && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, filterType === type && styles.filterChipTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Facility Cards */}
        {filteredFacilities.map((item) => (
          <View key={item.id} style={styles.facilityCard}>
            <View style={styles.facilityTopRow}>
              <View style={styles.facilityTypeBadge}>
                <Text style={styles.facilityTypeText}>{item.type.toUpperCase()}</Text>
              </View>
              <View style={styles.facilityDistRow}>
                <Ionicons name="location-outline" size={13} color="#DC2626" />
                <Text style={styles.facilityDistText}>{item.distance}</Text>
              </View>
            </View>

            <Text style={styles.facilityName}>{item.name}</Text>
            <Text style={styles.facilityAddress}>{item.address}</Text>

            <View style={styles.facilitySpecsRow}>
              <View style={styles.specBadge}>
                <Ionicons name="time-outline" size={12} color="#0D9488" />
                <Text style={styles.specBadgeText}>{item.hours}</Text>
              </View>
              <View style={styles.specBadge}>
                <Ionicons name="chatbubbles-outline" size={12} color="#4338CA" />
                <Text style={[styles.specBadgeText, { color: '#4338CA' }]}>{item.languages}</Text>
              </View>
            </View>

            <View style={styles.facilityActionsRow}>
              <TouchableOpacity
                style={styles.callDeskBtn}
                onPress={() => handleDial(item.phone, item.name)}
              >
                <Ionicons name="call-outline" size={14} color="#111827" />
                <Text style={styles.callDeskText}>Call Desk</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.directionsBtn}
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${item.name} ${item.address}`
                    )}`
                  )
                }
              >
                <Ionicons name="navigate" size={14} color="#FFFFFF" />
                <Text style={styles.directionsText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  circleBtn: {
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
  locationPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  locationPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991B1B',
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginBottom: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  sosIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTextContainer: {
    flex: 1,
  },
  sosTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sosSub: {
    fontSize: 11,
    color: '#FEE2E2',
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 2,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  policeBorder: {
    borderColor: '#FCA5A5',
  },
  fireBorder: {
    borderColor: '#FDBA74',
  },
  embassyBorder: {
    borderColor: '#93C5FD',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  serviceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  serviceAgency: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  dialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  dialPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gpsCoordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#CCFBF1',
    borderRadius: 12,
    padding: 12,
    marginVertical: 14,
  },
  gpsCoordText: {
    fontSize: 11,
    color: '#047857',
    flex: 1,
  },
  boldDark: {
    fontWeight: '700',
    color: '#064E3B',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  facilityTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  facilityTypeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  facilityTypeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  facilityDistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  facilityDistText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  facilityName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  facilityAddress: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  facilitySpecsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  specBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  facilityActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  callDeskBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 12,
  },
  callDeskText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    borderRadius: 12,
  },
  directionsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});