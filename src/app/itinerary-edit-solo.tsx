import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CARD_HEIGHT = 112;

interface ActivityStop {
  id: string;
  time: string;
  title: string;
  category: string;
  location: string;
  rating: string;
  reviews: string;
  cost: string;
  image: string;
}

const FLIGHT_OUTBOUND = {
  airline: 'Batik Air Malaysia',
  flightNo: 'OD612',
  fromCode: 'KUL',
  fromCity: 'Kuala Lumpur',
  toCode: 'KIX',
  toCity: 'Osaka Kansai',
  departTime: '06:30 AM',
  arriveTime: '10:00 AM',
  price: 390,
  gate: '12B',
  seat: '14A',
  pnr: 'OD612-8829-KUL',
};

const FLIGHT_RETURN = {
  airline: 'Batik Air Malaysia',
  flightNo: 'OD613',
  fromCode: 'KIX',
  fromCity: 'Osaka Kansai',
  toCode: 'KUL',
  toCity: 'Kuala Lumpur',
  departTime: '07:15 PM',
  arriveTime: '11:25 PM',
  price: 420,
  gate: '4',
  seat: '14A',
  pnr: 'OD613-7712-KIX',
};

const HOTEL_DATA = {
  name: 'Traders Hotel Kuala Lumpur',
  location: 'KLCC Park View • 0.2 km from center',
  ratePerNight: 400,
  nights: 4,
  checkInTime: '02:30 PM',
  checkOutTime: '12:00 PM',
  ref: '#TRD-8841-KLCC',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
};

export default function ItineraryEditSoloScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    'flight-outbound' | 'flight-return' | 'hotel-checkin' | 'hotel-checkout' | null
  >(null);

  const [editingTimeStopId, setEditingTimeStopId] = useState<string | null>(null);
  const [newTimeInput, setNewTimeInput] = useState('');

  const [stopsByDay, setStopsByDay] = useState<Record<number, ActivityStop[]>>({
    1: [
      { id: '1', time: '11:45 AM', title: 'Solo Coffee & Matcha Roast', category: 'Cafe', location: 'Nakagyo Ward, Kyoto', rating: '4.6★', reviews: '4.2k', cost: '¥850', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { id: '2', time: '03:30 PM', title: 'Kiyomizu-dera Early Walk', category: 'Sightseeing', location: 'Higashiyama Ward, Kyoto', rating: '4.8★', reviews: '41k', cost: '¥400', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
    ],
    2: [
      { id: '3', time: '09:00 AM', title: 'Fushimi Inari Torii Trail', category: 'Culture', location: 'Fushimi Ward, Kyoto', rating: '4.9★', reviews: '55k', cost: 'Free', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400' },
      { id: '4', time: '02:00 PM', title: 'Philosopher’s Path Walk', category: 'Nature', location: 'Northern Higashiyama', rating: '4.7★', reviews: '14k', cost: 'Free', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
    ],
    3: [
      { id: '5', time: '10:00 AM', title: 'Nara Deer Park Feeding', category: 'Wildlife', location: 'Nara Central', rating: '4.7★', reviews: '39k', cost: '¥200', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
      { id: '6', time: '02:30 PM', title: 'Todai-ji Great Buddha', category: 'World Heritage', location: 'Nara Park', rating: '4.8★', reviews: '34k', cost: '¥600', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
    ],
    4: [
      { id: '7', time: '10:30 AM', title: 'Osaka Castle & Moat Stroll', category: 'History', location: 'Chuo Ward, Osaka', rating: '4.5★', reviews: '62k', cost: '¥600', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400' },
      { id: '8', time: '05:00 PM', title: 'Dotonbori Street Food Hunt', category: 'Food', location: 'Namba, Osaka', rating: '4.6★', reviews: '74k', cost: '¥1,500', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
    ],
    5: [
      { id: '9', time: '01:00 PM', title: 'Rinku Seaside Outlets', category: 'Shopping', location: 'Rinku Town, Osaka Bay', rating: '4.2★', reviews: '17k', cost: 'Free', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
    ],
  });

  const currentStops = stopsByDay[selectedDay] || [];
  const flightTotal = FLIGHT_OUTBOUND.price + FLIGHT_RETURN.price;
  const hotelTotal = HOTEL_DATA.ratePerNight * HOTEL_DATA.nights;
  const grandTotal = flightTotal + hotelTotal;

  const handleSwap = (fromIdx: number, toIdx: number) => {
    const updated = [...currentStops];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setStopsByDay((prev) => ({ ...prev, [selectedDay]: updated }));
  };

  const handleSaveEditedTime = () => {
    if (!editingTimeStopId || !newTimeInput.trim()) return;
    setStopsByDay((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((s) =>
        s.id === editingTimeStopId ? { ...s, time: newTimeInput.trim() } : s
      ),
    }));
    setEditingTimeStopId(null);
    setNewTimeInput('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.topBarTitle}>Solo Itinerary Studio</Text>
          <Text style={styles.topBarSub}>5-Day Trip Plan • Round-Trip & Hotel Connected</Text>
        </View>
        <View style={styles.soloBadge}>
          <Text style={styles.soloBadgeText}>SOLO TRIP</Text>
        </View>
      </View>

      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {[1, 2, 3, 4, 5].map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setSelectedDay(d)}
              style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
            >
              <Text style={[styles.dayChipText, selectedDay === d && styles.dayChipTextActive]}>
                Day {d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedDay === 1 && (
          <View style={styles.bookingColumn}>
            <Text style={styles.bookingColumnTitle}>DAY 1 TRANSIT & LODGING (CHECK-IN)</Text>

            <TouchableOpacity
              style={styles.flightCard}
              activeOpacity={0.88}
              onPress={() => setSelectedVoucher('flight-outbound')}
            >
              <View style={styles.bookingCardHeader}>
                <View style={styles.typeBadge}>
                  <Ionicons name="airplane" size={12} color="#0D9488" />
                  <Text style={styles.typeBadgeText}>OUTBOUND FLIGHT</Text>
                </View>
                <Text style={styles.passLinkText}>View Boarding Pass ›</Text>
              </View>
              <View style={styles.flightDetailsRow}>
                <View>
                  <Text style={styles.codeText}>{FLIGHT_OUTBOUND.fromCode}</Text>
                  <Text style={styles.timeText}>{FLIGHT_OUTBOUND.departTime}</Text>
                </View>
                <View style={styles.flightMid}>
                  <Text style={styles.flightNumText}>
                    {FLIGHT_OUTBOUND.airline} {FLIGHT_OUTBOUND.flightNo}
                  </Text>
                  <Text style={styles.flightDurationText}>Direct • 3h 30m</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.codeText}>{FLIGHT_OUTBOUND.toCode}</Text>
                  <Text style={styles.timeText}>{FLIGHT_OUTBOUND.arriveTime}</Text>
                </View>
              </View>
              <Text style={styles.footerNote}>
                Gate {FLIGHT_OUTBOUND.gate} • Seat {FLIGHT_OUTBOUND.seat} • {FLIGHT_OUTBOUND.terminal}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hotelCard}
              activeOpacity={0.88}
              onPress={() => setSelectedVoucher('hotel-checkin')}
            >
              <View style={styles.bookingCardHeader}>
                <View style={[styles.typeBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="bed" size={12} color="#B45309" />
                  <Text style={[styles.typeBadgeText, { color: '#B45309' }]}>HOTEL CHECK-IN</Text>
                </View>
                <Text style={[styles.passLinkText, { color: '#B45309' }]}>Check-In Voucher ›</Text>
              </View>
              <View style={styles.hotelContent}>
                <Image source={{ uri: HOTEL_DATA.image }} style={styles.hotelThumb} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.hotelName} numberOfLines={1}>{HOTEL_DATA.name}</Text>
                  <Text style={styles.hotelSub} numberOfLines={1}>{HOTEL_DATA.location}</Text>
                  <Text style={styles.hotelRatePill}>
                    RM {HOTEL_DATA.ratePerNight} × {HOTEL_DATA.nights} nights = RM {hotelTotal}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {selectedDay === 5 && (
          <View style={styles.bookingColumn}>
            <Text style={styles.bookingColumnTitle}>DAY 5 DEPARTURE & LODGING (CHECK-OUT)</Text>

            <TouchableOpacity
              style={styles.hotelCard}
              activeOpacity={0.88}
              onPress={() => setSelectedVoucher('hotel-checkout')}
            >
              <View style={styles.bookingCardHeader}>
                <View style={[styles.typeBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="bed" size={12} color="#B45309" />
                  <Text style={[styles.typeBadgeText, { color: '#B45309' }]}>HOTEL CHECK-OUT</Text>
                </View>
                <Text style={[styles.passLinkText, { color: '#B45309' }]}>Check-Out Notice ›</Text>
              </View>
              <View style={styles.hotelContent}>
                <Image source={{ uri: HOTEL_DATA.image }} style={styles.hotelThumb} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.hotelName} numberOfLines={1}>{HOTEL_DATA.name}</Text>
                  <Text style={styles.hotelSub}>Latest check-out by {HOTEL_DATA.checkOutTime}</Text>
                  <Text style={[styles.hotelRatePill, { backgroundColor: '#E0F2FE', color: '#0369A1' }]}>
                    Stay Completed • Paid RM {hotelTotal}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flightCard}
              activeOpacity={0.88}
              onPress={() => setSelectedVoucher('flight-return')}
            >
              <View style={styles.bookingCardHeader}>
                <View style={styles.typeBadge}>
                  <Ionicons name="airplane" size={12} color="#0D9488" />
                  <Text style={styles.typeBadgeText}>RETURN FLIGHT</Text>
                </View>
                <Text style={styles.passLinkText}>View Boarding Pass ›</Text>
              </View>
              <View style={styles.flightDetailsRow}>
                <View>
                  <Text style={styles.codeText}>{FLIGHT_RETURN.fromCode}</Text>
                  <Text style={styles.timeText}>{FLIGHT_RETURN.departTime}</Text>
                </View>
                <View style={styles.flightMid}>
                  <Text style={styles.flightNumText}>
                    {FLIGHT_RETURN.airline} {FLIGHT_RETURN.flightNo}
                  </Text>
                  <Text style={styles.flightDurationText}>Direct • 4h 10m</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.codeText}>{FLIGHT_RETURN.toCode}</Text>
                  <Text style={styles.timeText}>{FLIGHT_RETURN.arriveTime}</Text>
                </View>
              </View>
              <Text style={styles.footerNote}>
                Gate {FLIGHT_RETURN.gate} • Seat {FLIGHT_RETURN.seat} • {FLIGHT_RETURN.terminal}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.timelineDayTitle}>Day {selectedDay} Itinerary Plan</Text>
          <Text style={styles.sectionHint}>Drag cards to re-order • Tap time pill to change time</Text>
        </View>

        <View style={styles.stopsList}>
          {currentStops.map((stop, index) => (
            <InteractiveSoloDragCard
              key={stop.id}
              item={stop}
              index={index}
              totalItems={currentStops.length}
              onSwap={handleSwap}
              onPressTime={() => {
                setEditingTimeStopId(stop.id);
                setNewTimeInput(stop.time);
              }}
              setScrollEnabled={setScrollEnabled}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.lockBtn}
          activeOpacity={0.88}
          onPress={() => setShowPaymentModal(true)}
        >
          <Ionicons name="card" size={16} color="#FFFFFF" />
          <Text style={styles.lockBtnText}>Finalize Booking & Review Total 💳</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Trip Booking Total Calculation</Text>

            <View style={styles.checkoutBreakdown}>
              <Text style={styles.breakdownHeader}>ROUND-TRIP FLIGHT TICKETS</Text>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>🛫 Outbound (KUL ➔ KIX):</Text>
                <Text style={styles.checkoutItemPrice}>RM {FLIGHT_OUTBOUND.price}</Text>
              </View>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>🛬 Return (KIX ➔ KUL):</Text>
                <Text style={styles.checkoutItemPrice}>RM {FLIGHT_RETURN.price}</Text>
              </View>

              <Text style={[styles.breakdownHeader, { marginTop: 12 }]}>HOTEL ACCOMMODATION</Text>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>🏨 {HOTEL_DATA.name}</Text>
                <Text style={styles.checkoutItemPrice}>RM {HOTEL_DATA.ratePerNight} / night</Text>
              </View>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>Duration Multiplier:</Text>
                <Text style={styles.checkoutItemPrice}>× {HOTEL_DATA.nights} nights</Text>
              </View>
              <View style={styles.checkoutRow}>
                <Text style={[styles.checkoutItemName, { fontWeight: '700' }]}>Lodging Total:</Text>
                <Text style={[styles.checkoutItemPrice, { fontWeight: '800', color: '#B45309' }]}>
                  RM {hotelTotal}
                </Text>
              </View>

              <View
                style={[
                  styles.checkoutRow,
                  { borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 8, marginTop: 10 },
                ]}
              >
                <Text style={{ fontWeight: '800', fontSize: 14, color: '#111827' }}>Total Trip Cost Due:</Text>
                <Text style={{ fontWeight: '900', fontSize: 18, color: '#0D9488' }}>RM {grandTotal}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.confirmPayBtn}
              activeOpacity={0.88}
              onPress={() => {
                setShowPaymentModal(false);
                Alert.alert(
                  'Payment Complete 🎉',
                  `RM ${grandTotal} settled. Passes and hotel vouchers ready.`
                );
              }}
            >
              <Text style={styles.confirmPayBtnText}>Pay RM {grandTotal} Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!selectedVoucher}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedVoucher(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>
              {selectedVoucher?.includes('flight')
                ? 'Digital Boarding Pass'
                : 'Hotel Reservation Document'}
            </Text>

            {selectedVoucher?.includes('flight') ? (
              <View style={styles.passBox}>
                <Text style={styles.passHeaderTitle}>
                  {selectedVoucher === 'flight-outbound'
                    ? FLIGHT_OUTBOUND.airline
                    : FLIGHT_RETURN.airline}
                </Text>
                <Text style={styles.passHeaderSub}>
                  PNR: {selectedVoucher === 'flight-outbound' ? FLIGHT_OUTBOUND.pnr : FLIGHT_RETURN.pnr}
                </Text>
                <View style={styles.qrMock}>
                  <Ionicons name="qr-code" size={110} color="#1F2937" />
                </View>
              </View>
            ) : (
              <View style={[styles.passBox, { borderColor: '#FDE68A' }]}>
                <Text style={[styles.passHeaderTitle, { color: '#B45309' }]}>{HOTEL_DATA.name}</Text>
                <Text style={styles.passHeaderSub}>
                  Ref: {HOTEL_DATA.ref} • {HOTEL_DATA.nights} Nights
                </Text>
                <View style={styles.qrMock}>
                  <Ionicons name="barcode" size={90} color="#1F2937" />
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              activeOpacity={0.88}
              onPress={() => setSelectedVoucher(null)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!editingTimeStopId}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingTimeStopId(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Change Visit Time Slot</Text>
            <View style={styles.presetRow}>
              {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setNewTimeInput(p)}
                  style={[styles.presetPill, newTimeInput === p && styles.presetPillActive]}
                >
                  <Text style={[styles.presetText, newTimeInput === p && styles.presetTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={newTimeInput}
              onChangeText={setNewTimeInput}
              placeholder="e.g. 02:30 PM"
              style={styles.timeInput}
            />
            <TouchableOpacity
              style={styles.saveBtn}
              activeOpacity={0.88}
              onPress={handleSaveEditedTime}
            >
              <Text style={styles.saveBtnText}>Save Time</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function InteractiveSoloDragCard({
  item,
  index,
  totalItems,
  onSwap,
  onPressTime,
  setScrollEnabled,
}: {
  item: ActivityStop;
  index: number;
  totalItems: number;
  onSwap: (from: number, to: number) => void;
  onPressTime: () => void;
  setScrollEnabled: (enabled: boolean) => void;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const currentDisplacement = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderGrant: () => {
        setScrollEnabled(false);
        Animated.spring(scale, { toValue: 1.02, friction: 5, useNativeDriver: false }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: 0, y: gestureState.dy });
        const targetStep = Math.round(gestureState.dy / CARD_HEIGHT);
        if (targetStep !== currentDisplacement.current) {
          const targetIndex = index + targetStep;
          if (targetIndex >= 0 && targetIndex < totalItems) {
            currentDisplacement.current = targetStep;
          }
        }
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
        const targetStep = currentDisplacement.current;
        const targetIndex = index + targetStep;
        if (targetStep !== 0 && targetIndex >= 0 && targetIndex < totalItems) {
          onSwap(index, targetIndex);
        }
        currentDisplacement.current = 0;
        Animated.parallel([
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }),
          Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.stopCardWrapper,
        { transform: [{ translateY: pan.y }, { scale }] },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.stopCard}>
        <Image source={{ uri: item.image }} style={styles.stopThumbnail} />
        <View style={styles.stopBody}>
          <View style={styles.stopTopRow}>
            <TouchableOpacity onPress={onPressTime} style={styles.stopTimeBadge}>
              <Text style={styles.stopTimeBadgeText}>{item.time} ✎</Text>
            </TouchableOpacity>
            <Text style={styles.stopCategoryText}>{item.category}</Text>
          </View>
          <Text style={styles.stopTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.stopLocation} numberOfLines={1}>
            📍 {item.location} • <Text style={{ color: '#F59E0B' }}>{item.rating}</Text>
          </Text>
        </View>
        <View style={styles.dragIndicator}>
          <Ionicons name="reorder-two-outline" size={20} color="#9CA3AF" />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
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
  titleBox: { flex: 1, marginLeft: 12 },
  topBarTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  topBarSub: { fontSize: 11, color: '#6B7280' },
  soloBadge: { backgroundColor: '#E0E7FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  soloBadgeText: { fontSize: 10, fontWeight: '800', color: '#4338CA' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  dayScroll: { gap: 8, marginBottom: 14 },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayChipActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  dayChipText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  dayChipTextActive: { color: '#FFFFFF' },

  bookingColumn: { marginBottom: 16 },
  bookingColumnTitle: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginBottom: 8 },
  flightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    marginBottom: 10,
  },
  hotelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    marginBottom: 10,
  },
  bookingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: { fontSize: 9.5, fontWeight: '800', color: '#0D9488' },
  passLinkText: { fontSize: 11, fontWeight: '800', color: '#0D9488' },
  flightDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  codeText: { fontSize: 18, fontWeight: '900', color: '#111827' },
  timeText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  flightMid: { alignItems: 'center', flex: 1 },
  flightNumText: { fontSize: 11, fontWeight: '700', color: '#111827' },
  flightDurationText: { fontSize: 9.5, color: '#6B7280' },
  footerNote: {
    fontSize: 10,
    color: '#6B7280',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3F4F6',
    paddingTop: 6,
    marginTop: 6,
  },
  hotelContent: { flexDirection: 'row', alignItems: 'center' },
  hotelThumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#E5E7EB' },
  hotelName: { fontSize: 13, fontWeight: '800', color: '#111827' },
  hotelSub: { fontSize: 10.5, color: '#6B7280', marginTop: 1 },
  hotelRatePill: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    backgroundColor: '#F0FDFA',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },

  sectionHeaderRow: { marginBottom: 10 },
  timelineDayTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  sectionHint: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  stopsList: { gap: 8, marginBottom: 16 },
  stopCardWrapper: { height: CARD_HEIGHT },
  stopCard: {
    height: CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  stopThumbnail: { width: 88, height: '100%', backgroundColor: '#E5E7EB' },
  stopBody: { flex: 1, padding: 12 },
  stopTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  stopTimeBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  stopTimeBadgeText: { fontSize: 10, fontWeight: '800', color: '#0D9488' },
  stopCategoryText: { fontSize: 9, color: '#6B7280' },
  stopTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginTop: 2 },
  stopLocation: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  dragIndicator: { paddingHorizontal: 12 },

  lockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0D9488',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  lockBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  checkoutBreakdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  breakdownHeader: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginBottom: 4 },
  checkoutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  checkoutItemName: { fontSize: 12.5, color: '#4B5563' },
  checkoutItemPrice: { fontSize: 12.5, fontWeight: '700', color: '#111827' },
  confirmPayBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmPayBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  passBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    marginVertical: 10,
  },
  passHeaderTitle: { fontSize: 15, fontWeight: '800', color: '#0D9488' },
  passHeaderSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  qrMock: { alignItems: 'center', marginVertical: 12 },
  closeBtn: { backgroundColor: '#111827', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },

  presetRow: { flexDirection: 'row', gap: 6, marginVertical: 10 },
  presetPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  presetPillActive: { backgroundColor: '#0D9488' },
  presetText: { fontSize: 10.5, fontWeight: '700', color: '#4B5563' },
  presetTextActive: { color: '#FFFFFF' },
  timeInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  saveBtn: { backgroundColor: '#0D9488', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});