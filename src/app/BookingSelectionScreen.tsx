import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingSelectionScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isSolo = mode === 'solo';

  const [step, setStep] = useState<'flight' | 'hotel' | 'confirm'>('flight');
  const [selectedFlight, setSelectedFlight] = useState<any>({
    id: 'f3',
    airline: 'Batik Air OD612',
    flightNo: 'OD-612',
    time: '06:30 AM - 10:00 AM',
    duration: '3h 30m • Direct',
    price: 'RM 390',
    numericPrice: 390,
  });
  const [selectedHotel, setSelectedHotel] = useState<any>({
    id: 'h1',
    name: 'Traders Hotel Kuala Lumpur',
    rating: '4.8★',
    reviews: '2,410 reviews',
    location: 'KLCC Park View • 0.2 km from center',
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
        { user: 'Jonathan L.', rating: '★★★★★', text: 'Unbeatable views of the Petronas Twin Towers directly from the room.', time: '2 days ago' },
      ],
    },
  });
  const [activeHotelReview, setActiveHotelReview] = useState<any>(null);

  const flights = [
    { id: 'f1', airline: 'AirAsia AK380', flightNo: 'AK-380', time: '08:00 AM - 11:30 AM', duration: '3h 30m • Direct', price: 'RM 350', numericPrice: 350 },
    { id: 'f2', airline: 'Malaysia Airlines MH702', flightNo: 'MH-702', time: '02:15 PM - 05:45 PM', duration: '3h 30m • Direct', price: 'RM 520', numericPrice: 520 },
    { id: 'f3', airline: 'Batik Air OD612', flightNo: 'OD-612', time: '06:30 AM - 10:00 AM', duration: '3h 30m • Direct', price: 'RM 390', numericPrice: 390 },
  ];

  const hotels = [
    { 
      id: 'h1', 
      name: 'Traders Hotel Kuala Lumpur', 
      rating: '4.8★', 
      reviews: '2,410 reviews', 
      location: 'KLCC Park View • 0.2 km from center', 
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
          { user: 'Jonathan L.', rating: '★★★★★', text: 'Unbeatable views of the Petronas Twin Towers directly from the room.', time: '2 days ago' },
        ]
      }
    },
    { 
      id: 'h2', 
      name: 'CitizenM Bukit Bintang', 
      rating: '4.6★', 
      reviews: '1,890 reviews', 
      location: 'Bukit Bintang • Vibrant District', 
      price: 'RM 280',
      numericPrice: 280,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
      googleReviewsData: {
        starRating: '4.6 / 5.0',
        totalReviews: '1,890 Google Reviews',
        photos: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
        ],
        comments: [
          { user: 'Chloe M.', rating: '★★★★★', text: 'Super trendy rooms. Perfect central location.', time: '3 days ago' },
        ]
      }
    },
  ];

  const totalPrice = (selectedFlight?.numericPrice || 0) + (selectedHotel?.numericPrice || 0);

  const handleConfirmSelection = () => {
    Alert.alert(
      'Selection Confirmed! ✈️🏨',
      'Your flight and hotel stay have been locked into your itinerary. You can review your day-by-day plan before completing payment.',
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
            {step === 'flight' ? 'Step 1: Select Flight' : step === 'hotel' ? 'Step 2: Select Hotel Stay' : 'Step 3: Confirm Selection'}
          </Text>
          <Text style={styles.headerSub}>
            {isSolo ? 'Solo Booking • Personal Vault Sync' : 'Group Booking • Group Vault Sync'}
          </Text>
        </View>
        <View style={styles.stepIndicatorBadge}>
          <Text style={styles.stepIndicatorText}>{step === 'flight' ? '1/3' : step === 'hotel' ? '2/3' : '3/3'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 'flight' ? (
          <View>
            <Text style={styles.sectionInstruction}>Choose your preferred airline schedule:</Text>
            {flights.map((flight) => (
              <TouchableOpacity 
                key={flight.id} 
                style={[styles.flightCard, selectedFlight?.id === flight.id && styles.selectedCard]}
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

                <View style={styles.flightDetailsRow}>
                  <View>
                    <Text style={styles.timeText}>{flight.time}</Text>
                    <Text style={styles.durationText}>{flight.duration}</Text>
                  </View>
                  <View style={styles.flightNoBox}>
                    <Text style={styles.flightNoText}>{flight.flightNo}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[styles.mainBtn, !selectedFlight && styles.disabledBtn]} 
              onPress={() => setStep('hotel')}
            >
              <Text style={styles.mainBtnText}>Proceed to Hotel Selection →</Text>
            </TouchableOpacity>
          </View>
        ) : step === 'hotel' ? (
          <View>
            <Text style={styles.sectionInstruction}>Choose accommodation (Tap Google badge to view reviews):</Text>
            {hotels.map((hotel) => (
              <TouchableOpacity 
                key={hotel.id} 
                style={[styles.hotelCardContainer, selectedHotel?.id === hotel.id && styles.selectedCard]}
                onPress={() => setSelectedHotel(hotel)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                <View style={styles.hotelContent}>
                  <View style={styles.hotelTopRow}>
                    <Text style={styles.hotelName} numberOfLines={1}>{hotel.name}</Text>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); setActiveHotelReview(hotel); }} style={styles.reviewTapPill}>
                      <Ionicons name="logo-google" size={11} color="#4285F4" />
                      <Text style={styles.reviewTapText}>{hotel.rating} Reviews</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.hotelLocation} numberOfLines={1}>📍 {hotel.location}</Text>
                  
                  <View style={styles.hotelBottomRow}>
                    <Text style={styles.reviewsText}>{hotel.reviews}</Text>
                    <Text style={styles.hotelPriceText}>{hotel.price} <Text style={styles.perPax}>/night</Text></Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[styles.mainBtn, !selectedHotel && styles.disabledBtn]} 
              onPress={() => setStep('confirm')}
            >
              <Text style={styles.mainBtnText}>Review Selection Summary →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.paymentContainer}>
            <View style={styles.paymentSummaryCard}>
              <Text style={styles.summaryTitle}>Trip Booking Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Flight:</Text>
                <Text style={styles.summaryValue}>{selectedFlight?.airline} ({selectedFlight?.price})</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Hotel:</Text>
                <Text style={styles.summaryValue}>{selectedHotel?.name} ({selectedHotel?.price})</Text>
              </View>

              <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 10, marginTop: 10 }]}>
                <Text style={[styles.summaryLabel, { fontWeight: '800', color: '#111827' }]}>Estimated Total:</Text>
                <Text style={[styles.summaryValue, { color: '#0D9488', fontWeight: '800', fontSize: 16 }]}>RM {totalPrice}</Text>
              </View>
            </View>

            <View style={styles.infoNoticeBox}>
              <Ionicons name="information-circle-outline" size={18} color="#0D9488" />
              <Text style={styles.infoNoticeText}>
                Confirming will add this hotel and flight directly into your daily schedule. You can make payment once your route is locked.
              </Text>
            </View>

            <TouchableOpacity style={styles.mainBtn} onPress={handleConfirmSelection}>
              <Text style={styles.mainBtnText}>Confirm Selection & Build Itinerary ✓</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* HOTEL REVIEWS MODAL */}
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
                  {activeHotelReview.googleReviewsData.photos.map((p: string, idx: number) => (
                    <Image key={idx} source={{ uri: p }} style={styles.galleryPhoto} />
                  ))}
                </ScrollView>

                <Text style={styles.fieldLabel}>VERIFIED GUEST COMMENTS</Text>
                {activeHotelReview.googleReviewsData.comments.map((c: any, idx: number) => (
                  <View key={idx} style={styles.commentCard}>
                    <View style={styles.commentTopRow}>
                      <Text style={styles.commentUser}>{c.user}</Text>
                      <Text style={styles.commentStars}>{c.rating}</Text>
                    </View>
                    <Text style={styles.commentText}>{c.text}</Text>
                    <Text style={styles.commentTime}>{c.time}</Text>
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
  airlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDFA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  airlineName: { fontSize: 13, fontWeight: '700', color: '#0D9488' },
  flightPriceText: { fontSize: 16, fontWeight: '800', color: '#111827' },
  perPax: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  flightDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#F3F4F6' },
  timeText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  durationText: { fontSize: 11, color: '#6B7280', marginTop: 2 },
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
  reviewsText: { fontSize: 11, color: '#9CA3AF' },
  hotelPriceText: { fontSize: 16, fontWeight: '800', color: '#0D9488' },
  selectedCard: { borderColor: '#0D9488', backgroundColor: '#F0FDFA', borderWidth: 2 },
  mainBtn: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  disabledBtn: { backgroundColor: '#9CA3AF' },
  mainBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  paymentContainer: { marginTop: 10 },
  paymentSummaryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E5E7EB' },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 13, color: '#6B7280' },
  summaryValue: { fontSize: 13, fontWeight: '700', color: '#111827' },
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