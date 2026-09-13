import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const POST_WIDTH = (width - Spacing.four * 2 - Spacing.two) / 2;

interface TravelStamp {
  id: string;
  city: string;
  country: string;
  flag: string;
  date: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ClonedTrip {
  id: string;
  title: string;
  destination: string;
  stopsCount: number;
  duration: string;
  author: string;
  image: string;
}

const STATS = [
  { label: 'Trips', count: '8' },
  { label: 'Countries', count: '5' },
  { label: 'Cities', count: '14' },
  { label: 'Stamps', count: '12' },
];

const PASSPORT_STAMPS: TravelStamp[] = [
  {
    id: 's1',
    city: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    date: 'Oct 2026',
    color: '#0D9488',
    icon: 'leaf',
  },
  {
    id: 's2',
    city: 'Osaka',
    country: 'Japan',
    flag: '🇯🇵',
    date: 'Oct 2026',
    color: '#E11D48',
    icon: 'restaurant',
  },
  {
    id: 's3',
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    date: 'May 2026',
    color: '#2563EB',
    icon: 'flash',
  },
  {
    id: 's4',
    city: 'Nara',
    country: 'Japan',
    flag: '🇯🇵',
    date: 'Oct 2026',
    color: '#D97706',
    icon: 'paw',
  },
];

const CLONED_TRIPS: ClonedTrip[] = [
  {
    id: 'c1',
    title: 'Autumn in Kansai (5-Day Route)',
    destination: 'Kyoto & Osaka',
    stopsCount: 12,
    duration: '5 Days',
    author: 'Self Plan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500',
  },
  {
    id: 'c2',
    title: 'Secret rooftop cafes in Shibuya',
    destination: 'Tokyo, Japan',
    stopsCount: 8,
    duration: '3 Days',
    author: 'Elena K.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500',
  },
];

const MY_POSTS = [
  {
    id: '1',
    title: 'Hidden matcha spots in Gion you must visit 🍵',
    likes: 1240,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: '48 Hours in Osaka: Night food & Dotonbori',
    likes: 890,
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    title: 'Fushimi Inari early morning route guide',
    likes: 2150,
    image: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    title: 'Arashiyama Bamboo Grove photography tips',
    likes: 670,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=80',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'cloned' | 'passport'>('posts');

  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState('Ivory');
  const [userHandle, setUserHandle] = useState('@ivory_journeys');
  const [userBio, setUserBio] = useState('Exploring Japan cafes, historic shrines & urban architecture ✈️📍');

  // Travel Stats Modal
  const [showStatsModal, setShowStatsModal] = useState(false);

  const handleSaveProfile = () => {
    setShowEditModal(false);
    Alert.alert('Profile Saved ✅', 'Your public traveler persona has been updated.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header Actions */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => Alert.alert('Share Profile 🔗', `Profile link copied: app.escape.io/${userHandle}`)}
            >
              <Ionicons name="share-outline" size={19} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => setShowStatsModal(true)}
            >
              <Ionicons name="stats-chart-outline" size={18} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Card */}
        <View style={styles.profileHero}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.proPillBadge}>
              <Text style={styles.proPillText}>EXPLORER</Text>
            </View>
          </View>

          <View style={styles.identity}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userHandle}>{userHandle}</Text>
            <Text style={styles.userBio}>{userBio}</Text>
            
            {/* Travel DNA Vibe Chips */}
            <View style={styles.vibeChipsRow}>
              <View style={styles.vibeChip}><Text style={styles.vibeChipText}>#SoloExplorer</Text></View>
              <View style={styles.vibeChip}><Text style={styles.vibeChipText}>#CafeHopper</Text></View>
              <View style={styles.vibeChip}><Text style={styles.vibeChipText}>#HalalEats</Text></View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="pencil" size={14} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.secondaryButton}
            onPress={() => setShowStatsModal(true)}
          >
            <Ionicons name="sparkles-outline" size={15} color={Colors.light.text} />
            <Text style={styles.secondaryButtonText}>Travel DNA</Text>
          </TouchableOpacity>
        </View>

        {/* Travel Summary Counter Grid */}
        <View style={styles.statsContainer}>
          {STATS.map((stat, idx) => (
            <View key={idx} style={styles.statItem}>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* 3-Segmented Tab Control (Guides vs Cloned vs Passport) */}
        <View style={styles.segmentWrapper}>
          <TouchableOpacity
            onPress={() => setActiveTab('posts')}
            style={[styles.segmentBtn, activeTab === 'posts' && styles.segmentBtnActive]}
          >
            <Ionicons
              name="grid-outline"
              size={15}
              color={activeTab === 'posts' ? Colors.light.text : Colors.light.textTertiary}
            />
            <Text style={[styles.segmentText, activeTab === 'posts' && styles.segmentTextActive]}>
              Guides
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('cloned')}
            style={[styles.segmentBtn, activeTab === 'cloned' && styles.segmentBtnActive]}
          >
            <Ionicons
              name="bookmark-outline"
              size={15}
              color={activeTab === 'cloned' ? Colors.light.text : Colors.light.textTertiary}
            />
            <Text style={[styles.segmentText, activeTab === 'cloned' && styles.segmentTextActive]}>
              Saved ({CLONED_TRIPS.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('passport')}
            style={[styles.segmentBtn, activeTab === 'passport' && styles.segmentBtnActive]}
          >
            <Ionicons
              name="medal-outline"
              size={15}
              color={activeTab === 'passport' ? Colors.light.text : Colors.light.textTertiary}
            />
            <Text style={[styles.segmentText, activeTab === 'passport' && styles.segmentTextActive]}>
              Passport
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: GUIDES */}
        {activeTab === 'posts' && (
          <View style={styles.postsGrid}>
            {MY_POSTS.map((post) => (
              <TouchableOpacity key={post.id} activeOpacity={0.88} style={styles.postCard}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
                <View style={styles.postContent}>
                  <Text numberOfLines={2} style={styles.postTitle}>
                    {post.title}
                  </Text>
                  <View style={styles.postFooter}>
                    <View style={styles.likeRow}>
                      <Ionicons name="heart" size={13} color="#EF4444" />
                      <Text style={styles.likeText}>{post.likes}</Text>
                    </View>
                    <Text style={styles.readTimeText}>4 min read</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB 2: SAVED & CLONED ITINERARIES */}
        {activeTab === 'cloned' && (
          <View style={styles.clonedListContainer}>
            {CLONED_TRIPS.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                style={styles.clonedTripCard}
                activeOpacity={0.88}
                onPress={() => router.push('/itinerary-detail' as any)}
              >
                <Image source={{ uri: trip.image }} style={styles.clonedTripImg} />
                <View style={styles.clonedTripInfo}>
                  <View style={styles.clonedTopRow}>
                    <Text style={styles.clonedDestText}>📍 {trip.destination}</Text>
                    <View style={styles.clonedDurationBadge}>
                      <Text style={styles.clonedDurationText}>{trip.duration}</Text>
                    </View>
                  </View>
                  <Text style={styles.clonedTripTitle} numberOfLines={1}>
                    {trip.title}
                  </Text>
                  <Text style={styles.clonedStopsCount}>
                    {trip.stopsCount} scheduled stops • By {trip.author}
                  </Text>
                  <View style={styles.clonedCardFooter}>
                    <Text style={styles.openPlannerLink}>Open in Planner ›</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB 3: DIGITAL PASSPORT & STAMPS */}
        {activeTab === 'passport' && (
          <View style={styles.passportContainer}>
            <View style={styles.passportCardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="earth" size={18} color="#0D9488" />
                <Text style={styles.passportCardHeading}>OFFICIAL TRAVELER STAMP BOOK</Text>
              </View>
              <Text style={styles.stampsEarnedText}>4 / 12 Unlocked</Text>
            </View>

            <View style={styles.stampsGrid}>
              {PASSPORT_STAMPS.map((stamp) => (
                <View key={stamp.id} style={[styles.stampPillCard, { borderColor: stamp.color }]}>
                  <View style={[styles.stampIconCircle, { backgroundColor: stamp.color }]}>
                    <Ionicons name={stamp.icon} size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.stampCity}>{stamp.city} {stamp.flag}</Text>
                  <Text style={styles.stampCountry}>{stamp.country}</Text>
                  <View style={styles.stampDateBadge}>
                    <Text style={[styles.stampDateText, { color: stamp.color }]}>{stamp.date}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.achievementBox}>
              <Ionicons name="trophy" size={20} color="#F59E0B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.achievementTitle}>Kansai Conqueror Tier 1</Text>
                <Text style={styles.achievementSub}>Completed 4 city itineraries across Osaka and Kyoto.</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL 1: EDIT PROFILE */}
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Profile Info</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>DISPLAY NAME</Text>
            <TextInput value={userName} onChangeText={setUserName} style={styles.modalInput} placeholder="Your name" />

            <Text style={styles.fieldLabel}>HANDLE</Text>
            <TextInput value={userHandle} onChangeText={setUserHandle} style={styles.modalInput} placeholder="@handle" />

            <Text style={styles.fieldLabel}>BIO</Text>
            <TextInput
              value={userBio}
              onChangeText={setUserBio}
              multiline
              numberOfLines={3}
              style={[styles.modalInput, { height: 75, textAlignVertical: 'top' }]}
              placeholder="Tell others what you love exploring..."
            />

            <TouchableOpacity style={styles.saveProfileBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveProfileBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: TRAVEL DNA & STATS BREAKDOWN */}
      <Modal visible={showStatsModal} transparent animationType="slide" onRequestClose={() => setShowStatsModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="sparkles" size={18} color="#0D9488" />
                <Text style={styles.modalTitle}>Travel DNA & Statistics</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStatsModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View style={styles.statsSummaryBox}>
              <View style={styles.statsSummaryRow}>
                <Text style={styles.statsSummaryLabel}>Total Distance Traveled</Text>
                <Text style={styles.statsSummaryVal}>14,820 km</Text>
              </View>
              <View style={styles.statsSummaryRow}>
                <Text style={styles.statsSummaryLabel}>Preferred Travel Style</Text>
                <Text style={[styles.statsSummaryVal, { color: '#0D9488' }]}>Culture & Culinary</Text>
              </View>
              <View style={styles.statsSummaryRow}>
                <Text style={styles.statsSummaryLabel}>Avg. Daily Walking Distance</Text>
                <Text style={styles.statsSummaryVal}>12.4 km / day</Text>
              </View>
              <View style={[styles.statsSummaryRow, { borderTopWidth: 1, borderColor: '#E2E8F0', paddingTop: 8, marginTop: 4 }]}>
                <Text style={[styles.statsSummaryLabel, { fontWeight: '800', color: '#0F172A' }]}>Community Guides Read</Text>
                <Text style={[styles.statsSummaryVal, { color: '#B45309' }]}>38 Guides</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeStatsBtn} onPress={() => setShowStatsModal(false)}>
              <Text style={styles.closeStatsBtnText}>Done</Text>
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
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.four,
    gap: 16,
    marginTop: Spacing.two,
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
  },
  proPillBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#0D9488',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proPillText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  identity: {
    flex: 1,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.light.text,
  },
  userHandle: {
    fontSize: 12.5,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  userBio: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.light.textSecondary,
  },
  vibeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  vibeChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vibeChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
  },
  primaryButton: {
    flex: 1,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: '#0D9488',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    paddingVertical: 14,
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginTop: 2,
    fontWeight: '600',
  },
  segmentWrapper: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
    padding: 4,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radius.pill,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  segmentBtnActive: {
    backgroundColor: Colors.light.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textTertiary,
  },
  segmentTextActive: {
    color: Colors.light.text,
    fontWeight: '700',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  postCard: {
    width: POST_WIDTH,
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
    marginBottom: Spacing.two,
  },
  postImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#E2E8F0',
  },
  postContent: {
    padding: 8,
  },
  postTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 16,
  },
  postFooter: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  readTimeText: {
    fontSize: 10,
    color: '#94A3B8',
  },

  /* Cloned List */
  clonedListContainer: {
    paddingHorizontal: Spacing.four,
    gap: 12,
  },
  clonedTripCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    gap: 12,
    alignItems: 'center',
  },
  clonedTripImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  clonedTripInfo: {
    flex: 1,
  },
  clonedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  clonedDestText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
  },
  clonedDurationBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  clonedDurationText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  clonedTripTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  clonedStopsCount: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  clonedCardFooter: {
    marginTop: 4,
  },
  openPlannerLink: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
  },

  /* Passport Stamp Book */
  passportContainer: {
    marginHorizontal: Spacing.four,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  passportCardHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.6,
  },
  stampsEarnedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  stampPillCard: {
    width: (width - 32 - 32 - 10) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  stampIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stampCity: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  stampCountry: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  stampDateBadge: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CBD5E1',
  },
  stampDateText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  achievementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFDF7',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginTop: 14,
  },
  achievementTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#92400E',
  },
  achievementSub: {
    fontSize: 10.5,
    color: '#B45309',
    marginTop: 1,
  },

  /* Modals */
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
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
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  circleCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveProfileBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 18,
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statsSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
    gap: 8,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  statsSummaryLabel: {
    fontSize: 12,
    color: '#475569',
  },
  statsSummaryVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeStatsBtn: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  closeStatsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});