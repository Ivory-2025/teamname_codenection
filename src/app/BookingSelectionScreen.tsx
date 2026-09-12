import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HOTEL_NIGHTS = 4;

const flights = [
  {
    id: 'f1',
    airline: 'AirAsia',
    outboundFlightNo: 'AK-380',
    returnFlightNo: 'AK-381',
    outboundTime: '08:00 AM - 11:30 AM',
    returnTime: '06:10 PM - 10:00 PM',
    outboundRoute: 'KUL -> KIX',
    returnRoute: 'KIX -> KUL',
    outboundDuration: '3h 30m - Direct',
    returnDuration: '3h 50m - Direct',
    price: 'RM 710',
    numericPrice: 710,
  },
  {
    id: 'f2',
    airline: 'Malaysia Airlines',
    outboundFlightNo: 'MH-702',
    returnFlightNo: 'MH-703',
    outboundTime: '02:15 PM - 05:45 PM',
    returnTime: '08:30 PM - 12:35 AM',
    outboundRoute: 'KUL -> KIX',
    returnRoute: 'KIX -> KUL',
    outboundDuration: '3h 30m - Direct',
    returnDuration: '4h 05m - Direct',
    price: 'RM 1,060',
    numericPrice: 1060,
  },
  {
    id: 'f3',
    airline: 'Batik Air Malaysia',
    outboundFlightNo: 'OD-612',
    returnFlightNo: 'OD-613',
    outboundTime: '06:30 AM - 10:00 AM',
    returnTime: '07:15 PM - 11:25 PM',
    outboundRoute: 'KUL -> KIX',
    returnRoute: 'KIX -> KUL',
    outboundDuration: '3h 30m - Direct',
    returnDuration: '4h 10m - Direct',
    price: 'RM 810',
    numericPrice: 810,
  },
];

const hotels = [
  {
    id: 'h1',
    name: 'Traders Hotel Kuala Lumpur',
    rating: '4.8 stars',
    reviews: '2,410 reviews',
    location: 'KLCC Park View - 0.2 km from center',
    price: 'RM 400',
    numericPrice: 400,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    googleReviewsData: {
      starRating: '4.8 / 5.0',
      totalReviews: '2,410 Google Reviews',
      photos: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
      ],
      comments: [
        { user: 'Jonathan L.', rating: '5 stars', text: 'Unbeatable views of the Petronas Twin Towers directly from the room.', time: '2 days ago' },
      ],
    },
  },
  {
    id: 'h2',
    name: 'CitizenM Bukit Bintang',
    rating: '4.6 stars',
    reviews: '1,890 reviews',
    location: 'Bukit Bintang - Vibrant District',
    price: 'RM 280',
    numericPrice: 280,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
    googleReviewsData: {
      starRating: '4.6 / 5.0',
      totalReviews: '1,890 Google Reviews',
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'],
      comments: [
        { user: 'Chloe M.', rating: '5 stars', text: 'Super trendy rooms. Perfect central location.', time: '3 days ago' },
      ],
    },
  },
];

export default function BookingSelectionScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isSolo = mode === 'solo';

  const [step, setStep] = useState<'flight' | 'hotel' | 'confirm'>('flight');
  const [selectedFlight, setSelectedFlight] = useState(flights[2]);
  const [selectedHotel, setSelectedHotel] = useState(hotels[0]);
  const [activeHotelReview, setActiveHotelReview] = useState<(typeof hotels)[number] | null>(null);

  const hotelTotal = selectedHotel.numericPrice * HOTEL_NIGHTS;
  const totalPrice = selectedFlight.numericPrice + hotelTotal;

  const handleConfirmSelection = () => {
    Alert.alert(
      'Selection Confirmed',
      'Your round-trip flight and hotel stay have been locked into your itinerary. You can review your day-by-day plan before completing payment.',
      [
        {
          text: 'View Itinerary',
          onPress: () => {
            if (isSolo) {
              router.push('/itinerary-edit-solo' as any);
            } else {
              router.push('/plan-group' as any);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'confirm') setStep('hotel');
            else if (step === 'hotel') setStep('flight');
            else router.back();
          }}
          style={styles.backCircleBtn}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {step === 'flight' ? 'Step 1: Select Round-Trip Flight' : step === 'hotel' ? 'Step 2: Select Hotel Stay' : 'Step 3: Confirm Selection'}
          </Text>
          <Text style={styles.headerSub}>
            {isSolo ? 'Solo Booking - Personal Vault Sync' : 'Group Booking - Group Vault Sync'}
          </Text>
        </View>
        <View style={styles.stepIndicatorBadge}>
          <Text style={styles.stepIndicatorText}>{step === 'flight' ? '1/3' : step === 'hotel' ? '2/3' : '3/3'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 'flight' ? (
          <View>
            <Text style={styles.sectionInstruction}>Choose your preferred round-trip flight package:</Text>
            {flights.map((flight) => (
              <TouchableOpacity
                key={flight.id}
                style={[styles.flightCard, selectedFlight.id === flight.id && styles.selectedCard]}
                onPress={() => setSelectedFlight(flight)}
                activeOpacity={0.9}
              >
                <View style={styles.flightTopRow}>
                  <View style={styles.airlineBadge}>
                    <Ionicons name="airplane" size={16} color="#0D9488" />
                    <Text style={styles.airlineName}>{flight.airline}</Text>
                  </View>
                  <Text style={styles.flightPriceText}>{flight.price} <Text style={styles.perPax}>/pax</Text></Text>
                </View>

                <FlightLeg
                  label="Outbound"
                  icon="trail-sign-outline"
                  route={flight.outboundRoute}
                  time={flight.outboundTime}
                  duration={flight.outboundDuration}
                  flightNo={flight.outboundFlightNo}
                />
                <FlightLeg
                  label="Return"
                  icon="return-up-back-outline"
                  route={flight.returnRoute}
                  time={flight.returnTime}
                  duration={flight.returnDuration}
                  flightNo={flight.returnFlightNo}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.mainBtn} onPress={() => setStep('hotel')}>
              <Text style={styles.mainBtnText}>Proceed to Hotel Selection</Text>
            </TouchableOpacity>
          </View>
        ) : step === 'hotel' ? (
          <View>
            <Text style={styles.sectionInstruction}>Choose accommodation for {HOTEL_NIGHTS} nights:</Text>
            {hotels.map((hotel) => (
              <TouchableOpacity
                key={hotel.id}
                style={[styles.hotelCardContainer, selectedHotel.id === hotel.id && styles.selectedCard]}
                onPress={() => setSelectedHotel(hotel)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                <View style={styles.hotelContent}>
                  <View style={styles.hotelTopRow}>
                    <Text style={styles.hotelName} numberOfLines={1}>{hotel.name}</Text>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); setActiveHotelReview(hotel); }} style={styles.reviewTapPill}>
                      <Ionicons name="logo-google" size={11} color="#4285F4" />
                      <Text style={styles.reviewTapText}>{hotel.rating}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.hotelLocation} numberOfLines={1}>{hotel.location}</Text>

                  <View style={styles.hotelBottomRow}>
                    <Text style={styles.reviewsText}>{hotel.reviews}</Text>
                    <View style={styles.hotelPriceBox}>
                      <Text style={styles.hotelPriceText}>{hotel.price} <Text style={styles.perPax}>/night</Text></Text>
                      <Text style={styles.hotelTotalText}>x {HOTEL_NIGHTS} nights = RM {hotel.numericPrice * HOTEL_NIGHTS}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.mainBtn} onPress={() => setStep('confirm')}>
              <Text style={styles.mainBtnText}>Review Selection Summary</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.paymentContainer}>
            <View style={styles.paymentSummaryCard}>
              <Text style={styles.summaryTitle}>Trip Booking Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Round-trip flight:</Text>
                <Text style={styles.summaryValue}>{selectedFlight.airline} ({selectedFlight.price})</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Outbound:</Text>
                <Text style={styles.summaryValue}>{selectedFlight.outboundFlightNo} {selectedFlight.outboundRoute}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Return:</Text>
                <Text style={styles.summaryValue}>{selectedFlight.returnFlightNo} {selectedFlight.returnRoute}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Hotel:</Text>
                <Text style={styles.summaryValue}>{selectedHotel.name}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Hotel nights:</Text>
                <Text style={styles.summaryValue}>RM {selectedHotel.numericPrice} x {HOTEL_NIGHTS} = RM {hotelTotal}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Estimated Total:</Text>
                <Text style={styles.totalValue}>RM {totalPrice}</Text>
              </View>
            </View>

            <View style={styles.infoNoticeBox}>
              <Ionicons name="information-circle-outline" size={18} color="#0D9488" />
              <Text style={styles.infoNoticeText}>
                Confirming will add both flight legs and the full hotel stay directly into your daily schedule.
              </Text>
            </View>

            <TouchableOpacity style={styles.mainBtn} onPress={handleConfirmSelection}>
              <Text style={styles.mainBtnText}>Confirm Selection & Build Itinerary</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={!!activeHotelReview} transparent animationType="slide" onRequestClose={() => setActiveHotelReview(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetLarge}>
            <View style={styles.sheetHandle} />
            {activeHotelReview && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle} numberOfLines={1}>{activeHotelReview.name}</Text>
                  <TouchableOpacity onPress={() => setActiveHotelReview(null)} style={styles.circleCloseBtn}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <Image source={{ uri: activeHotelReview.image }} style={styles.reviewModalImage} />

                <View style={styles.googleRatingBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="logo-google" size={18} color="#4285F4" />
                    <Text style={styles.googleRatingText}>{activeHotelReview.googleReviewsData.starRating}</Text>
                  </View>
                  <Text style={styles.reviewCountText}>{activeHotelReview.googleReviewsData.totalReviews}</Text>
                </View>

                <Text style={styles.fieldLabel}>VISITOR PHOTO GALLERY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
                  {activeHotelReview.googleReviewsData.photos.map((photo, idx) => (
                    <Image key={idx} source={{ uri: photo }} style={styles.galleryPhoto} />
                  ))}
                </ScrollView>

                <Text style={styles.fieldLabel}>VERIFIED GUEST COMMENTS</Text>
                {activeHotelReview.googleReviewsData.comments.map((comment, idx) => (
                  <View key={idx} style={styles.commentCard}>
                    <View style={styles.commentTopRow}>
                      <Text style={styles.commentUser}>{comment.user}</Text>
                      <Text style={styles.commentStars}>{comment.rating}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                ))}

                <TouchableOpacity
                  style={[styles.modalSaveBtn, { marginTop: 16 }]}
                  onPress={() => {
                    setSelectedHotel(activeHotelReview);
                    setActiveHotelReview(null);
                  }}
                >
                  <Text style={styles.modalSaveBtnText}>Select This Hotel & Continue</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function FlightLeg({
  label,
  icon,
  route,
  time,
  duration,
  flightNo,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  time: string;
  duration: string;
  flightNo: string;
}) {
  return (
    <View style={styles.flightLegRow}>
      <View style={styles.flightLegLabel}>
        <Ionicons name={icon} size={13} color="#0D9488" />
        <Text style={styles.flightLegLabelText}>{label}</Text>
      </View>
      <View style={styles.flightLegDetails}>
        <Text style={styles.timeText}>{route}</Text>
        <Text style={styles.durationText}>{time} - {duration}</Text>
      </View>
      <View style={styles.flightNoBox}>
        <Text style={styles.flightNoText}>{flightNo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  backCircleBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  headerTitleBox: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  headerSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  stepIndicatorBadge: { backgroundColor: '#CCFBF1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  stepIndicatorText: { fontSize: 11, fontWeight: '800', color: '#0D9488' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  sectionInstruction: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 14, marginTop: 4 },
  flightCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  flightTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  airlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDFA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, flexShrink: 1, marginRight: 8 },
  airlineName: { fontSize: 13, fontWeight: '700', color: '#0D9488' },
  flightPriceText: { fontSize: 16, fontWeight: '800', color: '#111827' },
  perPax: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  flightLegRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#F3F4F6', marginTop: 8 },
  flightLegLabel: { width: 78, flexDirection: 'row', alignItems: 'center', gap: 4 },
  flightLegLabelText: { fontSize: 10.5, fontWeight: '800', color: '#0D9488' },
  flightLegDetails: { flex: 1 },
  timeText: { fontSize: 13.5, fontWeight: '700', color: '#111827' },
  durationText: { fontSize: 10.5, color: '#6B7280', marginTop: 2 },
  flightNoBox: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  flightNoText: { fontSize: 11, fontWeight: '700', color: '#4B5563' },
  hotelCardContainer: { backgroundColor: '#FFFFFF', borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  hotelImage: { width: '100%', height: 150, backgroundColor: '#E5E7EB' },
  hotelContent: { padding: 14 },
  hotelTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  hotelName: { fontSize: 15, fontWeight: '800', color: '#111827', flex: 1, marginRight: 8 },
  reviewTapPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE' },
  reviewTapText: { fontSize: 11, fontWeight: '800', color: '#1D4ED8' },
  hotelLocation: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  hotelBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#F3F4F6' },
  reviewsText: { fontSize: 11, color: '#9CA3AF', flex: 1 },
  hotelPriceBox: { alignItems: 'flex-end' },
  hotelPriceText: { fontSize: 16, fontWeight: '800', color: '#0D9488' },
  hotelTotalText: { fontSize: 10.5, color: '#B45309', fontWeight: '800', marginTop: 2 },
  selectedCard: { borderColor: '#0D9488', backgroundColor: '#F0FDFA', borderWidth: 2 },
  mainBtn: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  mainBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  paymentContainer: { marginTop: 10 },
  paymentSummaryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E5E7EB' },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 6 },
  summaryLabel: { fontSize: 13, color: '#6B7280' },
  summaryValue: { fontSize: 13, fontWeight: '700', color: '#111827', flex: 1, textAlign: 'right' },
  totalRow: { borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 10, marginTop: 10 },
  totalLabel: { fontSize: 13, fontWeight: '800', color: '#111827' },
  totalValue: { color: '#0D9488', fontWeight: '800', fontSize: 16 },
  infoNoticeBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDFA', borderWidth: 1, borderColor: '#CCFBF1', padding: 12, borderRadius: 12, marginTop: 14 },
  infoNoticeText: { fontSize: 12, color: '#0F766E', flex: 1, lineHeight: 16 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  modalSheetLarge: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: '80%' },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 14 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111827', flex: 1, marginRight: 10 },
  circleCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  reviewModalImage: { width: '100%', height: 180, borderRadius: 14, marginBottom: 14, backgroundColor: '#E5E7EB' },
  googleRatingBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  googleRatingText: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  reviewCountText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginTop: 4, marginBottom: 6 },
  galleryPhoto: { width: 100, height: 75, borderRadius: 10, backgroundColor: '#E5E7EB' },
  commentCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  commentTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentUser: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  commentStars: { fontSize: 11, color: '#F59E0B' },
  commentText: { fontSize: 12, color: '#475569', lineHeight: 16 },
  commentTime: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
  modalSaveBtn: { backgroundColor: '#111827', height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modalSaveBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
