import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 44) / 3;

const VIBE_TAGS = [
  { id: '1', label: '#Chill' },
  { id: '2', label: '#FastPaced' },
  { id: '3', label: '#SleepIn' },
  { id: '4', label: '#PackTheDay' },
  { id: '5', label: '#Adventure' },
  { id: '6', label: '#CafeHopping' },
  { id: '7', label: '#Culture' },
  { id: '8', label: '#Halal' },
  { id: '9', label: '#Vegetarian' },
];

interface StopItem {
  id: string;
  time: string;
  title: string;
  neighborhood: string;
  category: string;
  rating: string;
  reviews: string;
  operatingHours: string;
  isClash: boolean;
  image: string;
  gallery: string[];
  description: string;
  transitToNext?: {
    mode: 'subway' | 'car' | 'walk';
    label: string;
    duration: string;
    cost: string;
  };
}

interface JournalPhoto {
  id: string;
  uri: string;
  caption: string;
  location: string;
  date: string;
  uploadedBy: string;
  taggedMemberIds: string[];
}

interface PersonAlbum {
  id: string;
  name: string;
  avatar: string;
}

interface GroupNote {
  id: string;
  author: string;
  avatar: string;
  tag: 'Logistics' | 'Food' | 'Tickets' | 'General';
  title: string;
  content: string;
  timeAgo: string;
}

const INITIAL_NOTES: GroupNote[] = [
  {
    id: 'n1',
    author: 'Ivory (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    tag: 'Logistics',
    title: 'Packing & Logistics',
    content: 'Universal adapter, e-SIM, JR pass pickup at Kansai Airport Terminal 1 counter.',
    timeAgo: '2h ago',
  },
  {
    id: 'n2',
    author: 'Chin Jie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    tag: 'Food',
    title: 'Halal Ramen Reservation',
    content: 'Ayam-YA Karasuma doesn’t require advance reservations, but we should arrive by 6:00 PM to avoid lines.',
    timeAgo: '5h ago',
  },
];

const PEOPLE_ALBUMS: PersonAlbum[] = [
  { id: 'm1', name: 'Ivory (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  { id: 'm2', name: 'Chin Jie', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 'm3', name: 'ZhiHeng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
  { id: 'm4', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
];

const INITIAL_PHOTOS: JournalPhoto[] = [
  {
    id: 'p1',
    uri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
    caption: 'Morning stroll through the towering bamboo grove',
    location: 'Arashiyama, Kyoto',
    date: 'Oct 14, 09:30 AM',
    uploadedBy: 'Ivory (You)',
    taggedMemberIds: ['m1', 'm2'],
  },
  {
    id: 'p2',
    uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
    caption: 'Giant grilled squid skewers! 🦑',
    location: 'Nishiki Market',
    date: 'Oct 14, 01:15 PM',
    uploadedBy: 'Chin Jie',
    taggedMemberIds: ['m2', 'm3'],
  },
];

// 5 Distinct Days Itinerary Database
const ITINERARY_BY_DAY: Record<number, { title: string; subtitle: string; stops: StopItem[] }> = {
  1: {
    title: 'Arrival & Kyoto Highlights',
    subtitle: 'Flight + Lodging + 3 places • ~¥2,240',
    stops: [
      {
        id: 'd1-1',
        time: '11:45 AM',
        title: 'Arashiyama Bamboo Grove',
        neighborhood: 'Ukyo Ward, Kyoto',
        category: 'Sightseeing',
        rating: '4.6',
        reviews: '32.4k',
        operatingHours: 'Open 24 Hours',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
        gallery: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'],
        description: 'A natural forest of bamboo in Arashiyama. Walking paths cut through the towering green stalks.',
        transitToNext: { mode: 'subway', label: 'Subway & Walk', duration: '22 min', cost: 'RM 8 (¥240)' },
      },
      {
        id: 'd1-2',
        time: '01:15 PM',
        title: 'Nishiki Market Food Crawl',
        neighborhood: 'Nakagyo Ward, Kyoto',
        category: 'Food & Dining',
        rating: '4.4',
        reviews: '18.9k',
        operatingHours: '10:00 AM – 06:00 PM',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
        gallery: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'],
        description: 'Kyoto kitchen street lined with fresh seafood, skewers, and street snacks.',
        transitToNext: { mode: 'car', label: 'Grab / Taxi', duration: '14 min', cost: 'RM 14' },
      },
      {
        id: 'd1-3',
        time: '06:15 PM',
        title: 'Kinkaku-ji (Golden Pavilion)',
        neighborhood: 'Kita Ward, Kyoto',
        category: 'Culture & Temple',
        rating: '4.7',
        reviews: '45.1k',
        operatingHours: '09:00 AM – 05:00 PM',
        isClash: true,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
        gallery: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600'],
        description: 'Iconic Zen Buddhist temple adorned with pure gold leaf.',
      },
    ],
  },
  2: {
    title: 'Historic Shrines & Gion Evening',
    subtitle: '3 cultural stops • Est. 7 hrs • ~¥1,600',
    stops: [
      {
        id: 'd2-1',
        time: '08:30 AM',
        title: 'Fushimi Inari-Taisha',
        neighborhood: 'Fushimi Ward, Kyoto',
        category: 'Shinto Shrine',
        rating: '4.8',
        reviews: '55.2k',
        operatingHours: 'Open 24 Hours',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600',
        gallery: ['https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600'],
        description: 'Famous mountain path covered by over 10,000 vivid vermilion torii gates.',
        transitToNext: { mode: 'subway', label: 'Keihan Main Line', duration: '18 min', cost: '¥210' },
      },
      {
        id: 'd2-2',
        time: '12:00 PM',
        title: 'Kiyomizu-dera Wooden Terrace',
        neighborhood: 'Higashiyama Ward, Kyoto',
        category: 'Historic Temple',
        rating: '4.8',
        reviews: '41k',
        operatingHours: '06:00 AM – 06:00 PM',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
        gallery: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600'],
        description: 'Dramatic ancient temple built without nails over the hillside.',
        transitToNext: { mode: 'walk', label: 'Ninenzaka Slope', duration: '12 min', cost: 'Free' },
      },
      {
        id: 'd2-3',
        time: '04:30 PM',
        title: 'Gion District & Hanamikoji Street',
        neighborhood: 'Gion, Kyoto',
        category: 'Culture & Nightlife',
        rating: '4.5',
        reviews: '28k',
        operatingHours: 'Open 24 Hours',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
        gallery: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'],
        description: 'Traditional wooden machiya houses, geisha district, and lantern-lit alleyways.',
      },
    ],
  },
  3: {
    title: 'Nara Deer Park & Ancient Giants',
    subtitle: 'Full Day Trip • Est. 6 hrs • ~¥2,800',
    stops: [
      {
        id: 'd3-1',
        time: '09:30 AM',
        title: 'Nara Deer Park Stroll',
        neighborhood: 'Nara Park, Nara',
        category: 'Nature & Wildlife',
        rating: '4.7',
        reviews: '39.8k',
        operatingHours: 'Open 24 Hours',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
        gallery: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600'],
        description: 'Home to over 1,200 free-roaming sacred sika deer that bow for deer crackers.',
        transitToNext: { mode: 'walk', label: 'Park Path', duration: '8 min', cost: 'Free' },
      },
      {
        id: 'd3-2',
        time: '11:15 AM',
        title: 'Todai-ji Great Buddha Hall',
        neighborhood: 'Nara, Kansai',
        category: 'World Heritage',
        rating: '4.8',
        reviews: '34.2k',
        operatingHours: '07:30 AM – 05:30 PM',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
        gallery: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600'],
        description: 'One of the world’s largest wooden buildings housing the 15-meter bronze Daibutsu statue.',
        transitToNext: { mode: 'walk', label: 'Lantern Trail', duration: '15 min', cost: 'Free' },
      },
      {
        id: 'd3-3',
        time: '02:45 PM',
        title: 'Kasuga Taisha Stone Lantern Path',
        neighborhood: 'Nara, Kansai',
        category: 'Forest Shrine',
        rating: '4.6',
        reviews: '19.4k',
        operatingHours: '06:30 AM – 05:30 PM',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600',
        gallery: ['https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600'],
        description: 'Ancient moss-covered cedar forest lined with 3,000 bronze and stone lanterns.',
      },
    ],
  },
  4: {
    title: 'Osaka City Discovery & Dotonbori',
    subtitle: 'Castle + Street Eats • Est. 8 hrs • ~¥3,400',
    stops: [
      {
        id: 'd4-1',
        time: '10:00 AM',
        title: 'Osaka Castle & Moat Park',
        neighborhood: 'Chuo Ward, Osaka',
        category: 'Historic Landmark',
        rating: '4.5',
        reviews: '62k',
        operatingHours: '09:00 AM – 05:00 PM',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
        gallery: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'],
        description: 'Massive fortress reconstructed in 1931 surrounded by expansive stone moats and cherry orchards.',
        transitToNext: { mode: 'subway', label: 'Tanimachi Line', duration: '16 min', cost: '¥240' },
      },
      {
        id: 'd4-2',
        time: '02:00 PM',
        title: 'Shinsekai & Tsutenkaku Retro Tower',
        neighborhood: 'Naniwa Ward, Osaka',
        category: 'Retro District',
        rating: '4.3',
        reviews: '31k',
        operatingHours: 'Open 24 Hours',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
        gallery: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'],
        description: 'Vibrant early 20th-century retro neon district famous for piping hot Kushikatsu skewers.',
        transitToNext: { mode: 'subway', label: 'Midosuji Line', duration: '10 min', cost: '¥190' },
      },
      {
        id: 'd4-3',
        time: '06:00 PM',
        title: 'Dotonbori Neon Canal Walk',
        neighborhood: 'Namba, Osaka',
        category: 'Nightlife & Street Food',
        rating: '4.6',
        reviews: '74.5k',
        operatingHours: 'Open 24 Hours',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
        gallery: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600'],
        description: 'Electric beating heart of Osaka with the Glico Running Man sign, giant crab billboards, and takoyaki stands.',
      },
    ],
  },
  5: {
    title: 'Check-out & Return Flight Home',
    subtitle: 'Hotel Check-out + Departure Flight • Kansai Int.',
    stops: [
      {
        id: 'd5-1',
        time: '01:00 PM',
        title: 'Rinku Premium Outlets Shopping',
        neighborhood: 'Rinku Town, Osaka Bay',
        category: 'Duty Free & Shopping',
        rating: '4.2',
        reviews: '17k',
        operatingHours: '10:00 AM – 08:00 PM',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
        gallery: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'],
        description: 'Open-air seaside shopping destination located just one stop before Kansai International Airport.',
        transitToNext: { mode: 'subway', label: 'Nankai Shuttle', duration: '12 min', cost: '¥370' },
      },
      {
        id: 'd5-2',
        time: '04:30 PM',
        title: 'Kansai Airport Sky Deck & Duty Free',
        neighborhood: 'Kansai Int. Airport',
        category: 'Airport Terminal',
        rating: '4.4',
        reviews: '23k',
        operatingHours: 'Open 24 Hours',
        isClash: false,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
        gallery: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'],
        description: 'Final souvenir collection, matcha snacks, and tax-free shopping before boarding gate calls.',
      },
    ],
  },
};

export default function ItineraryDetailScreen() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState<'Itinerary' | 'Budget' | 'Notes' | 'Journal'>('Itinerary');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAlignmentModal, setShowAlignmentModal] = useState(false);
  const [alignmentSubTab, setAlignmentSubTab] = useState<'preferences' | 'benchmark'>('benchmark');
  const [selectedPlace, setSelectedPlace] = useState<StopItem | null>(null);

  // Flight & Hotel Voucher Modal States
  const [selectedVoucherType, setSelectedVoucherType] = useState<'flight-departure' | 'hotel-checkin' | 'hotel-checkout' | 'flight-return' | null>(null);

  // Notes States
  const [notesList, setNotesList] = useState<GroupNote[]>(INITIAL_NOTES);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState<'General' | 'Logistics' | 'Food' | 'Tickets'>('General');

  // Journal States
  const [photos, setPhotos] = useState<JournalPhoto[]>(INITIAL_PHOTOS);
  const [selectedAlbum, setSelectedAlbum] = useState<PersonAlbum | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<JournalPhoto | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Alignment Preferences State
  const [selectedTags, setSelectedTags] = useState<string[]>(['#CafeHopping', '#Chill']);
  const [stayBudget, setStayBudget] = useState('250');
  const [transitCap, setTransitCap] = useState('40');
  const [dailyLiving, setDailyLiving] = useState('120');

  const currentDayData = ITINERARY_BY_DAY[selectedDay] || ITINERARY_BY_DAY[1];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 5) {
        Alert.alert('Limit Reached', 'Select up to 5 vibe tags.');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: 'Join our trip on Escape: app.escape.io/join/kansai-2026',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadPhoto = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newPhoto: JournalPhoto = {
        id: Date.now().toString(),
        uri: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600',
        caption: 'Group photo in front of the torii gates! ⛩️',
        location: 'Fushimi Inari',
        date: 'Just now',
        uploadedBy: 'Ivory (You)',
        taggedMemberIds: ['m1', 'm3'],
      };

      setPhotos([newPhoto, ...photos]);
      setIsScanning(false);
      Alert.alert(
        'AI Face Recognition Complete ✨',
        'Recognized 2 faces (Ivory & ZhiHeng). Auto-indexed into their personal albums!'
      );
    }, 1400);
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      Alert.alert('Missing Info', 'Please add both a title and description.');
      return;
    }

    const newNote: GroupNote = {
      id: `note-${Date.now()}`,
      author: 'Ivory (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      tag: newNoteTag,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      timeAgo: 'Just now',
    };

    setNotesList([newNote, ...notesList]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTag('General');
    setShowNoteModal(false);
  };

  const filteredPhotos = selectedAlbum
    ? photos.filter((p) => p.taggedMemberIds.includes(selectedAlbum.id))
    : photos;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.circleButton}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>

        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.emergencyNavBtn}
            onPress={() => router.push('/emergency')}
            activeOpacity={0.85}
          >
            <Ionicons name="warning" size={13} color="#DC2626" />
            <Text style={styles.emergencyNavText}>SOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alignmentButton}
            onPress={() => setShowAlignmentModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="flash-outline" size={13} color="#4338CA" />
            <Text style={styles.alignmentButtonText}>Alignment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inviteButton}
            activeOpacity={0.85}
            onPress={() => setShowInviteModal(true)}
          >
            <Ionicons name="person-add-outline" size={13} color="#0D9488" />
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Header */}
        <View style={styles.heroCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000',
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownText}>36 DAYS TO GO</Text>
            </View>
            <View>
              <Text style={styles.heroDates}>OCT 14 – OCT 22, 2026</Text>
              <Text style={styles.heroTitle}>Autumn in Kansai</Text>
              <Text style={styles.heroLocation}>Kyoto & Osaka, Japan • 4 Travelers</Text>
            </View>
          </View>
        </View>

        {/* Section Tabs */}
        <View style={styles.tabBar}>
          {(['Itinerary', 'Budget', 'Notes', 'Journal'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: ITINERARY */}
        {activeTab === 'Itinerary' && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
              {[1, 2, 3, 4, 5].map((day) => (
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
            </ScrollView>

            <View style={styles.dayHeader}>
              <View>
                <Text style={styles.dayTitle}>Day {selectedDay} • {currentDayData.title}</Text>
                <Text style={styles.daySubtitle}>{currentDayData.subtitle}</Text>
              </View>
              <View style={styles.optimizeBadge}>
                <Ionicons name="sparkles" size={12} color="#0D9488" />
                <Text style={styles.optimizeText}>Optimized</Text>
              </View>
            </View>

            {/* DAY 1 ONLY: DEPARTURE FLIGHT & HOTEL CHECK-IN WITH BOARDING PASSES */}
            {selectedDay === 1 && (
              <View style={styles.bookingColumnContainer}>
                <Text style={styles.columnSectionTitle}>DAY 1 RESERVED BOOKINGS</Text>

                {/* Departure Flight */}
                <TouchableOpacity
                  style={styles.flightBookingCard}
                  activeOpacity={0.9}
                  onPress={() => setSelectedVoucherType('flight-departure')}
                >
                  <View style={styles.bookingCardTop}>
                    <View style={styles.bookingTypeBadge}>
                      <Ionicons name="airplane" size={13} color="#0D9488" />
                      <Text style={styles.bookingTypeText}>DEPARTURE FLIGHT</Text>
                    </View>
                    <View style={styles.passAttachedBadge}>
                      <Ionicons name="qr-code-outline" size={12} color="#0D9488" />
                      <Text style={styles.passAttachedText}>Boarding Pass</Text>
                    </View>
                  </View>

                  <View style={styles.flightRow}>
                    <View>
                      <Text style={styles.airportCode}>KUL</Text>
                      <Text style={styles.airportTime}>06:30 AM</Text>
                      <Text style={styles.airportCity}>Kuala Lumpur</Text>
                    </View>

                    <View style={styles.flightDividerBox}>
                      <Text style={styles.flightDuration}>3h 30m • Direct</Text>
                      <View style={styles.flightLine}>
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <Ionicons name="airplane" size={14} color="#0D9488" style={{ marginHorizontal: 2 }} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                      </View>
                      <Text style={styles.airlineCode}>Batik Air OD612</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.airportCode}>KIX</Text>
                      <Text style={styles.airportTime}>10:00 AM</Text>
                      <Text style={styles.airportCity}>Osaka Kansai</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooterNotice}>
                    <Text style={styles.footerNoticeText}>Gate 12B • Seat 14A • Terminal 1</Text>
                    <Text style={styles.viewPassLink}>View Pass ›</Text>
                  </View>
                </TouchableOpacity>

                {/* Hotel Check-In */}
                <TouchableOpacity
                  style={styles.hotelBookingCard}
                  activeOpacity={0.9}
                  onPress={() => setSelectedVoucherType('hotel-checkin')}
                >
                  <View style={styles.bookingCardTop}>
                    <View style={[styles.bookingTypeBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="bed" size={13} color="#B45309" />
                      <Text style={[styles.bookingTypeText, { color: '#B45309' }]}>HOTEL CHECK-IN</Text>
                    </View>
                    <View style={[styles.passAttachedBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="shield-checkmark" size={12} color="#B45309" />
                      <Text style={[styles.passAttachedText, { color: '#B45309' }]}>Check-In Voucher</Text>
                    </View>
                  </View>

                  <View style={styles.hotelContentRow}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' }}
                      style={styles.hotelThumbnail}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.hotelTitle} numberOfLines={1}>Traders Hotel Kuala Lumpur</Text>
                      <Text style={styles.hotelLocation} numberOfLines={1}>📍 KLCC Park View • 0.2 km from center</Text>
                      <View style={styles.checkinBadgeRow}>
                        <Text style={styles.checkinTag}>Check-In: 02:30 PM</Text>
                        <Text style={styles.checkinTag}>RM 400/night</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardFooterNotice}>
                    <Text style={styles.footerNoticeText}>Ref: #TRD-8841-KL • Deluxe Twin Room</Text>
                    <Text style={[styles.viewPassLink, { color: '#B45309' }]}>View Voucher ›</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* DAY 5 ONLY: HOTEL CHECK-OUT & RETURN FLIGHT DEPARTURE */}
            {selectedDay === 5 && (
              <View style={styles.bookingColumnContainer}>
                <Text style={styles.columnSectionTitle}>DAY 5 DEPARTURE BOOKINGS</Text>

                {/* Hotel Check-Out */}
                <TouchableOpacity
                  style={styles.hotelBookingCard}
                  activeOpacity={0.9}
                  onPress={() => setSelectedVoucherType('hotel-checkout')}
                >
                  <View style={styles.bookingCardTop}>
                    <View style={[styles.bookingTypeBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="bed" size={13} color="#B45309" />
                      <Text style={[styles.bookingTypeText, { color: '#B45309' }]}>HOTEL CHECK-OUT</Text>
                    </View>
                    <View style={[styles.passAttachedBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="checkmark-circle-outline" size={12} color="#B45309" />
                      <Text style={[styles.passAttachedText, { color: '#B45309' }]}>12:00 PM Check-Out</Text>
                    </View>
                  </View>

                  <View style={styles.hotelContentRow}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' }}
                      style={styles.hotelThumbnail}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.hotelTitle} numberOfLines={1}>Traders Hotel Kuala Lumpur</Text>
                      <Text style={styles.hotelLocation} numberOfLines={1}>Luggage drop available until airport transfer</Text>
                      <View style={styles.checkinBadgeRow}>
                        <Text style={styles.checkinTag}>Latest Check-Out: 12:00 PM</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardFooterNotice}>
                    <Text style={styles.footerNoticeText}>Booking Complete • Receipt Available</Text>
                    <Text style={[styles.viewPassLink, { color: '#B45309' }]}>View Folio ›</Text>
                  </View>
                </TouchableOpacity>

                {/* Return Flight */}
                <TouchableOpacity
                  style={styles.flightBookingCard}
                  activeOpacity={0.9}
                  onPress={() => setSelectedVoucherType('flight-return')}
                >
                  <View style={styles.bookingCardTop}>
                    <View style={styles.bookingTypeBadge}>
                      <Ionicons name="airplane" size={13} color="#0D9488" />
                      <Text style={styles.bookingTypeText}>RETURN FLIGHT</Text>
                    </View>
                    <View style={styles.passAttachedBadge}>
                      <Ionicons name="qr-code-outline" size={12} color="#0D9488" />
                      <Text style={styles.passAttachedText}>Boarding Pass</Text>
                    </View>
                  </View>

                  <View style={styles.flightRow}>
                    <View>
                      <Text style={styles.airportCode}>KIX</Text>
                      <Text style={styles.airportTime}>07:15 PM</Text>
                      <Text style={styles.airportCity}>Osaka Kansai</Text>
                    </View>

                    <View style={styles.flightDividerBox}>
                      <Text style={styles.flightDuration}>4h 10m • Direct</Text>
                      <View style={styles.flightLine}>
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <Ionicons name="airplane" size={14} color="#0D9488" style={{ marginHorizontal: 2 }} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                      </View>
                      <Text style={styles.airlineCode}>Batik Air OD613</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.airportCode}>KUL</Text>
                      <Text style={styles.airportTime}>11:25 PM</Text>
                      <Text style={styles.airportCity}>Kuala Lumpur</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooterNotice}>
                    <Text style={styles.footerNoticeText}>Gate 4 • Seat 14A • Terminal 1</Text>
                    <Text style={styles.viewPassLink}>View Pass ›</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* DAILY ITINERARY STOPS */}
            <View style={styles.timelineContainer}>
              <Text style={[styles.columnSectionTitle, { marginBottom: 10 }]}>SCHEDULED ACTIVITIES</Text>
              {currentDayData.stops.map((stop, index) => (
                <View key={stop.id}>
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => setSelectedPlace(stop)}
                    style={[styles.stopCard, stop.isClash && styles.stopCardClash]}
                  >
                    <Image source={{ uri: stop.image }} style={styles.stopThumbnail} />
                    <View style={styles.stopContent}>
                      <View style={styles.stopTimeRow}>
                        <View style={[styles.stopIndexBadge, stop.isClash && styles.stopIndexBadgeClash]}>
                          <Text style={styles.stopIndexText}>{index + 1}</Text>
                        </View>
                        <Text style={[styles.stopTimeText, stop.isClash && styles.stopTimeTextClash]}>
                          {stop.time}
                        </Text>
                        {stop.isClash ? (
                          <View style={styles.clashBadge}>
                            <Ionicons name="alert-circle" size={11} color="#DC2626" />
                            <Text style={styles.clashBadgeText}>Closed at Arrival</Text>
                          </View>
                        ) : (
                          <Text style={styles.stopCategoryBadge}>{stop.category}</Text>
                        )}
                      </View>

                      <Text style={[styles.stopTitle, stop.isClash && styles.stopTitleClash]} numberOfLines={1}>
                        {stop.title}
                      </Text>
                      <Text style={styles.stopNeighborhood} numberOfLines={1}>{stop.neighborhood}</Text>

                      <Text style={[styles.operatingHoursText, stop.isClash && styles.operatingHoursTextClash]}>
                        Hours: {stop.operatingHours}
                      </Text>

                      <View style={styles.stopFooter}>
                        <View style={styles.ratingBox}>
                          <Ionicons name="star" size={12} color="#F59E0B" />
                          <Text style={styles.ratingScore}>{stop.rating}</Text>
                          <Text style={styles.reviewCount}>({stop.reviews})</Text>
                        </View>
                        <Text style={styles.tapPromptText}>Tap for details ›</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {stop.transitToNext && (
                    <View style={styles.transitWrapper}>
                      <View style={styles.transitVerticalLine} />
                      <View style={styles.transitChip}>
                        <Ionicons
                          name={stop.transitToNext.mode === 'subway' ? 'train-outline' : 'car-outline'}
                          size={13}
                          color="#374151"
                        />
                        <Text style={styles.transitDuration}>{stop.transitToNext.duration}</Text>
                        <Text style={styles.transitDivider}>•</Text>
                        <Text style={styles.transitLabel}>{stop.transitToNext.label}</Text>
                        <Text style={styles.transitDivider}>•</Text>
                        <Text style={styles.transitCost}>{stop.transitToNext.cost}</Text>
                      </View>
                      <View style={styles.transitVerticalLine} />
                    </View>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addStopButton} activeOpacity={0.8}>
              <Ionicons name="add" size={18} color="#4B5563" />
              <Text style={styles.addStopText}>Add a place to Day {selectedDay}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB 2: BUDGET */}
        {activeTab === 'Budget' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.budgetOverviewCard}>
              <View style={styles.budgetHeaderRow}>
                <View>
                  <Text style={styles.budgetCardSubHeader}>OVERALL TRIP SPENDING</Text>
                  <Text style={styles.budgetTotalAmount}>RM 542.50</Text>
                </View>
                <View style={styles.groupSizePill}>
                  <Ionicons name="people" size={13} color="#0D9488" />
                  <Text style={styles.groupSizeText}>4 Members</Text>
                </View>
              </View>

              <Text style={styles.budgetFxNote}>Equivalent to ~¥17,500 across 3 shared records</Text>

              <View style={styles.equalSplitHighlightBox}>
                <View style={styles.splitIconBox}>
                  <Ionicons name="pie-chart" size={20} color="#0D9488" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.equalSplitTitle}>Split Equally (4 Ways)</Text>
                  <Text style={styles.equalSplitSubtitle}>Each member's share to date</Text>
                </View>
                <Text style={styles.equalSplitValue}>RM 135.63</Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Group Ceiling (RM 3,400)</Text>
                  <Text style={styles.progressPct}>16% Used</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '16%' }]} />
                </View>
              </View>

              <TouchableOpacity
                style={styles.openExpensesBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/expenses')}
              >
                <View style={styles.openExpensesLeft}>
                  <Ionicons name="receipt-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.openExpensesText}>Open Expense Ledger & Scanner</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 3: NOTES */}
        {activeTab === 'Notes' && (
          <View style={styles.tabContentContainer}>
            <TouchableOpacity
              style={styles.emergencyBannerCard}
              activeOpacity={0.88}
              onPress={() => router.push('/emergency')}
            >
              <View style={styles.emergencyBannerLeft}>
                <View style={styles.sosShieldIcon}>
                  <Ionicons name="shield-checkmark" size={20} color="#DC2626" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.emergencyBannerTitle}>Emergency Assistance Hub</Text>
                  <Text style={styles.emergencyBannerSub}>1-Tap 110/119 Dialers • Nearby Hospitals & SOS</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.notesHeaderRow}>
              <View>
                <Text style={styles.notesHeadingText}>SHARED TRIP NOTES</Text>
                <Text style={styles.notesSubText}>{notesList.length} reminders from members</Text>
              </View>

              <TouchableOpacity
                style={styles.dropNoteButton}
                activeOpacity={0.85}
                onPress={() => setShowNoteModal(true)}
              >
                <Ionicons name="create-outline" size={15} color="#FFFFFF" />
                <Text style={styles.dropNoteButtonText}>Drop a Note</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.notesListContainer}>
              {notesList.map((item) => (
                <View key={item.id} style={styles.noteCard}>
                  <View style={styles.noteTopRow}>
                    <View style={styles.noteAuthorBox}>
                      <Image source={{ uri: item.avatar }} style={styles.noteAuthorAvatar} />
                      <View>
                        <Text style={styles.noteAuthorName}>{item.author}</Text>
                        <Text style={styles.noteTimeText}>{item.timeAgo}</Text>
                      </View>
                    </View>

                    <View style={[styles.noteTagBadge, getTagBadgeStyle(item.tag)]}>
                      <Text style={[styles.noteTagText, getTagTextStyle(item.tag)]}>{item.tag}</Text>
                    </View>
                  </View>

                  <Text style={styles.noteCardTitle}>{item.title}</Text>
                  <Text style={styles.noteCardBody}>{item.content}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: JOURNAL */}
        {activeTab === 'Journal' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.journalActionRow}>
              <View>
                <Text style={styles.journalMainHeading}>Digital Photo Stream</Text>
                <Text style={styles.journalMainSub}>{photos.length} moments shared</Text>
              </View>
              <TouchableOpacity
                onPress={handleUploadPhoto}
                style={styles.journalUploadPill}
                activeOpacity={0.85}
              >
                <Ionicons name="camera" size={14} color="#FFFFFF" />
                <Text style={styles.journalUploadText}>Upload</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.peopleAlbumBox}>
              <View style={styles.peopleHeaderRow}>
                <Text style={styles.peopleSubLabel}>SMART FACE RECOGNITION (iOS STYLE)</Text>
                {selectedAlbum && (
                  <TouchableOpacity onPress={() => setSelectedAlbum(null)}>
                    <Text style={styles.clearFilterText}>Show All Photos</Text>
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.peopleCarousel}
              >
                {PEOPLE_ALBUMS.map((album) => {
                  const isSelected = selectedAlbum?.id === album.id;
                  const albumPhotoCount = photos.filter((p) =>
                    p.taggedMemberIds.includes(album.id)
                  ).length;

                  return (
                    <TouchableOpacity
                      key={album.id}
                      style={[styles.personCard, isSelected && styles.personCardActive]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedAlbum(isSelected ? null : album)}
                    >
                      <View style={[styles.personAvatarRing, isSelected && styles.personAvatarRingActive]}>
                        <Image source={{ uri: album.avatar }} style={styles.personAvatarImg} />
                        <View style={styles.sparkleAiBadge}>
                          <Ionicons name="sparkles" size={9} color="#FFFFFF" />
                        </View>
                      </View>
                      <Text style={[styles.personName, isSelected && styles.personNameActive]} numberOfLines={1}>
                        {album.name}
                      </Text>
                      <Text style={styles.personPhotoCount}>{albumPhotoCount} photos</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <Text style={styles.gridSectionHeader}>
              {selectedAlbum ? `Photos of ${selectedAlbum.name}` : 'Shared Trip Photos'}
            </Text>

            <View style={styles.photoGrid}>
              {filteredPhotos.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridPhotoItem}
                  activeOpacity={0.88}
                  onPress={() => setSelectedPhoto(item)}
                >
                  <Image source={{ uri: item.uri }} style={styles.gridPhotoImg} />
                  <View style={styles.tagPillBadge}>
                    <Ionicons name="people" size={10} color="#FFFFFF" />
                    <Text style={styles.tagPillBadgeText}>{item.taggedMemberIds.length}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL: DIGITAL PASSES & VOUCHERS (DAY 1 & DAY 5 ONLY) */}
      <Modal
        visible={!!selectedVoucherType}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedVoucherType(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.voucherModalSheet}>
            <View style={styles.sheetHandle} />

            {/* Departure Boarding Pass (Day 1) */}
            {selectedVoucherType === 'flight-departure' && (
              <View>
                <View style={styles.voucherHeaderRow}>
                  <View>
                    <Text style={styles.voucherMainTitle}>Departure Boarding Pass ✈️</Text>
                    <Text style={styles.voucherSubTitle}>Batik Air OD612 • KUL ➔ KIX</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedVoucherType(null)} style={styles.closeCircle}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <View style={styles.boardingPassCard}>
                  <View style={styles.passHeader}>
                    <Text style={styles.passAirline}>Batik Air Malaysia</Text>
                    <Text style={styles.passClass}>Economy • Seat 14A</Text>
                  </View>

                  <View style={styles.passBodyRow}>
                    <View>
                      <Text style={styles.passCity}>Kuala Lumpur</Text>
                      <Text style={styles.passTime}>06:30 AM</Text>
                      <Text style={styles.passDate}>Oct 14, 2026</Text>
                    </View>
                    <Ionicons name="airplane" size={24} color="#0D9488" />
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.passCity}>Osaka (KIX)</Text>
                      <Text style={styles.passTime}>10:00 AM</Text>
                      <Text style={styles.passDate}>Oct 14, 2026</Text>
                    </View>
                  </View>

                  <View style={styles.passInfoGrid}>
                    <View>
                      <Text style={styles.passMetaLabel}>GATE</Text>
                      <Text style={styles.passMetaVal}>12B</Text>
                    </View>
                    <View>
                      <Text style={styles.passMetaLabel}>TERMINAL</Text>
                      <Text style={styles.passMetaVal}>KLIA 1</Text>
                    </View>
                    <View>
                      <Text style={styles.passMetaLabel}>BOARDING</Text>
                      <Text style={styles.passMetaVal}>05:50 AM</Text>
                    </View>
                  </View>

                  <View style={styles.qrContainer}>
                    <Ionicons name="qr-code" size={110} color="#1E293B" />
                    <Text style={styles.qrBarcodeText}>PNR: OD612-8829-KUL</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Hotel Check-In Voucher (Day 1) */}
            {selectedVoucherType === 'hotel-checkin' && (
              <View>
                <View style={styles.voucherHeaderRow}>
                  <View>
                    <Text style={styles.voucherMainTitle}>Hotel Check-In Voucher 🏨</Text>
                    <Text style={styles.voucherSubTitle}>Traders Hotel Kuala Lumpur</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedVoucherType(null)} style={styles.closeCircle}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.boardingPassCard, { borderColor: '#FDE68A' }]}>
                  <View style={[styles.passHeader, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.passAirline, { color: '#B45309' }]}>Traders Hotel KL</Text>
                    <Text style={[styles.passClass, { color: '#B45309' }]}>Check-In Stop</Text>
                  </View>

                  <View style={styles.passBodyRow}>
                    <View>
                      <Text style={styles.passCity}>Check-In Time</Text>
                      <Text style={styles.passTime}>02:30 PM</Text>
                      <Text style={styles.passDate}>Oct 14, 2026</Text>
                    </View>
                    <Ionicons name="bed" size={24} color="#B45309" />
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.passCity}>Status</Text>
                      <Text style={[styles.passTime, { color: '#10B981' }]}>CONFIRMED</Text>
                      <Text style={styles.passDate}>Prepaid</Text>
                    </View>
                  </View>

                  <View style={styles.passInfoGrid}>
                    <View>
                      <Text style={styles.passMetaLabel}>ROOM TYPE</Text>
                      <Text style={styles.passMetaVal}>Deluxe Twin</Text>
                    </View>
                    <View>
                      <Text style={styles.passMetaLabel}>GUESTS</Text>
                      <Text style={styles.passMetaVal}>4 Persons</Text>
                    </View>
                    <View>
                      <Text style={styles.passMetaLabel}>DURATION</Text>
                      <Text style={styles.passMetaVal}>4 Nights</Text>
                    </View>
                  </View>

                  <View style={styles.qrContainer}>
                    <Ionicons name="barcode" size={80} color="#1E293B" />
                    <Text style={styles.qrBarcodeText}>REF: #TRD-8841-KLCC</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Hotel Check-Out Folio (Day 5) */}
            {selectedVoucherType === 'hotel-checkout' && (
              <View>
                <View style={styles.voucherHeaderRow}>
                  <View>
                    <Text style={styles.voucherMainTitle}>Hotel Check-Out Folio 🏨</Text>
                    <Text style={styles.voucherSubTitle}>Traders Hotel Kuala Lumpur • Final Day</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedVoucherType(null)} style={styles.closeCircle}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.boardingPassCard, { borderColor: '#FDE68A' }]}>
                  <View style={[styles.passHeader, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.passAirline, { color: '#B45309' }]}>Traders Hotel KL</Text>
                    <Text style={[styles.passClass, { color: '#B45309' }]}>Check-Out Notice</Text>
                  </View>

                  <View style={styles.passBodyRow}>
                    <View>
                      <Text style={styles.passCity}>Latest Check-Out</Text>
                      <Text style={styles.passTime}>12:00 PM</Text>
                      <Text style={styles.passDate}>Oct 22, 2026</Text>
                    </View>
                    <Ionicons name="exit-outline" size={24} color="#B45309" />
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.passCity}>Keycards</Text>
                      <Text style={[styles.passTime, { color: '#0D9488' }]}>Lobby Box</Text>
                      <Text style={styles.passDate}>Express Drop</Text>
                    </View>
                  </View>

                  <View style={styles.qrContainer}>
                    <Ionicons name="receipt-outline" size={60} color="#0D9488" />
                    <Text style={styles.qrBarcodeText}>Folio Settled • Deposit Returned</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Return Flight Boarding Pass (Day 5) */}
            {selectedVoucherType === 'flight-return' && (
              <View>
                <View style={styles.voucherHeaderRow}>
                  <View>
                    <Text style={styles.voucherMainTitle}>Return Boarding Pass ✈️</Text>
                    <Text style={styles.voucherSubTitle}>Batik Air OD613 • KIX ➔ KUL</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedVoucherType(null)} style={styles.closeCircle}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <View style={styles.boardingPassCard}>
                  <View style={styles.passHeader}>
                    <Text style={styles.passAirline}>Batik Air Malaysia</Text>
                    <Text style={styles.passClass}>Economy • Seat 14A</Text>
                  </View>

                  <View style={styles.passBodyRow}>
                    <View>
                      <Text style={styles.passCity}>Osaka (KIX)</Text>
                      <Text style={styles.passTime}>07:15 PM</Text>
                      <Text style={styles.passDate}>Oct 22, 2026</Text>
                    </View>
                    <Ionicons name="airplane" size={24} color="#0D9488" />
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.passCity}>Kuala Lumpur</Text>
                      <Text style={styles.passTime}>11:25 PM</Text>
                      <Text style={styles.passDate}>Oct 22, 2026</Text>
                    </View>
                  </View>

                  <View style={styles.passInfoGrid}>
                    <View>
                      <Text style={styles.passMetaLabel}>GATE</Text>
                      <Text style={styles.passMetaVal}>4</Text>
                    </View>
                    <View>
                      <Text style={styles.passMetaLabel}>TERMINAL</Text>
                      <Text style={styles.passMetaVal}>Terminal 1</Text>
                    </View>
                    <View>
                      <Text style={styles.passMetaLabel}>BOARDING</Text>
                      <Text style={styles.passMetaVal}>06:35 PM</Text>
                    </View>
                  </View>

                  <View style={styles.qrContainer}>
                    <Ionicons name="qr-code" size={110} color="#1E293B" />
                    <Text style={styles.qrBarcodeText}>PNR: OD613-7712-KIX</Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.doneBtn} onPress={() => setSelectedVoucherType(null)}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PLACE DETAIL MODAL */}
      <Modal
        visible={!!selectedPlace}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPlace(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { maxHeight: '85%' }]}>
            <View style={styles.sheetHandle} />
            {selectedPlace && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailCategory}>{selectedPlace.category.toUpperCase()}</Text>
                    <Text style={styles.detailTitle}>{selectedPlace.title}</Text>
                    <Text style={styles.detailSub}>📍 {selectedPlace.neighborhood}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedPlace(null)} style={styles.closeCircle}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionHeaderLabel}>PHOTOS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                  {selectedPlace.gallery.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={styles.detailGalleryImage} />
                  ))}
                </ScrollView>

                <Text style={styles.sectionHeaderLabel}>GOOGLE MAPS REVIEWS</Text>
                <View style={styles.detailReviewBox}>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={15} color="#F59E0B" />
                    <Text style={styles.detailScore}>{selectedPlace.rating}</Text>
                    <Text style={styles.detailCount}>({selectedPlace.reviews} reviews)</Text>
                  </View>
                  <Text style={styles.detailReviewSnippet}>
                    "A mesmerizing path through towering bamboo stalks. Best visited early morning."
                  </Text>
                  <Text style={styles.detailHours}>Operating Hours: {selectedPlace.operatingHours}</Text>
                </View>

                <Text style={styles.sectionHeaderLabel}>ABOUT THIS SPOT</Text>
                <Text style={styles.detailAbout}>{selectedPlace.description}</Text>

                <TouchableOpacity style={styles.detailDoneBtn} onPress={() => setSelectedPlace(null)}>
                  <Text style={styles.detailDoneBtnText}>Done</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function getTagBadgeStyle(tag: GroupNote['tag']) {
  switch (tag) {
    case 'Logistics':
      return { backgroundColor: '#EEF2FF' };
    case 'Food':
      return { backgroundColor: '#FEF3C7' };
    case 'Tickets':
      return { backgroundColor: '#FEE2E2' };
    default:
      return { backgroundColor: '#CCFBF1' };
  }
}

function getTagTextStyle(tag: GroupNote['tag']) {
  switch (tag) {
    case 'Logistics':
      return { color: '#4338CA' };
    case 'Food':
      return { color: '#B45309' };
    case 'Tickets':
      return { color: '#B91C1C' };
    default:
      return { color: '#0D9488' };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flexOne: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
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
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  emergencyNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyNavText: { fontSize: 11, fontWeight: '800', color: '#DC2626' },
  alignmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  alignmentButtonText: { fontSize: 11, fontWeight: '700', color: '#4338CA' },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 14,
  },
  inviteButtonText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  heroCard: {
    margin: 16,
    height: 180,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  heroImage: { width: '100%', height: '100%', opacity: 0.85 },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  countdownBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  countdownText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  heroDates: { color: '#FCD34D', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  heroLocation: { color: '#E5E7EB', fontSize: 12 },
  tabBar: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 6 },
  tabItem: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 18, backgroundColor: '#F3F4F6' },
  tabItemActive: { backgroundColor: '#111827' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },
  dayScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  dayChip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  dayChipActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  dayChipText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  dayChipTextActive: { color: '#FFFFFF' },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dayTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  daySubtitle: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  optimizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  optimizeText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },

  /* Bookings Column */
  bookingColumnContainer: { paddingHorizontal: 16, marginBottom: 16 },
  columnSectionTitle: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.6, marginBottom: 8 },
  flightBookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    marginBottom: 10,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  hotelBookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    marginBottom: 10,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bookingTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FDFA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  bookingTypeText: { fontSize: 9.5, fontWeight: '800', color: '#0D9488' },
  passAttachedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#CCFBF1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  passAttachedText: { fontSize: 10, fontWeight: '800', color: '#0D9488' },
  flightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  airportCode: { fontSize: 20, fontWeight: '900', color: '#111827' },
  airportTime: { fontSize: 12, fontWeight: '700', color: '#0D9488', marginTop: 1 },
  airportCity: { fontSize: 10, color: '#6B7280' },
  flightDividerBox: { alignItems: 'center', flex: 1, paddingHorizontal: 12 },
  flightDuration: { fontSize: 9.5, color: '#6B7280', fontWeight: '600' },
  flightLine: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#0D9488' },
  line: { flex: 1, height: 1, backgroundColor: '#CCFBF1' },
  airlineCode: { fontSize: 10, fontWeight: '700', color: '#111827' },
  cardFooterNotice: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#F3F4F6', paddingTop: 8, marginTop: 10 },
  footerNoticeText: { fontSize: 10.5, color: '#6B7280', fontWeight: '600' },
  viewPassLink: { fontSize: 11, fontWeight: '800', color: '#0D9488' },
  hotelContentRow: { flexDirection: 'row', alignItems: 'center' },
  hotelThumbnail: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#E5E7EB' },
  hotelTitle: { fontSize: 13, fontWeight: '800', color: '#111827' },
  hotelLocation: { fontSize: 10.5, color: '#6B7280', marginTop: 1 },
  checkinBadgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  checkinTag: { backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, fontSize: 9.5, fontWeight: '700', color: '#4B5563' },

  /* Itinerary Stops */
  timelineContainer: { paddingHorizontal: 16 },
  stopCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 4 },
  stopCardClash: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  stopThumbnail: { width: 88, height: '100%', backgroundColor: '#E5E7EB' },
  stopContent: { flex: 1, padding: 12 },
  stopTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  stopIndexBadge: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#0D9488', alignItems: 'center', justifyContent: 'center' },
  stopIndexBadgeClash: { backgroundColor: '#DC2626' },
  stopIndexText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  stopTimeText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  stopTimeTextClash: { color: '#DC2626' },
  stopCategoryBadge: { fontSize: 10, fontWeight: '600', color: '#6B7280', backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 'auto' },
  clashBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 'auto' },
  clashBadgeText: { color: '#DC2626', fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  stopTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  stopTitleClash: { color: '#991B1B' },
  stopNeighborhood: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  operatingHoursText: { fontSize: 11, color: '#6B7280', marginTop: 3 },
  operatingHoursTextClash: { color: '#DC2626', fontWeight: '700' },
  stopFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, marginTop: 6, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingScore: { fontSize: 11, fontWeight: '700', color: '#111827' },
  reviewCount: { fontSize: 10, color: '#9CA3AF' },
  tapPromptText: { fontSize: 10, color: '#9CA3AF' },
  transitWrapper: { alignItems: 'center', marginVertical: 3 },
  transitVerticalLine: { width: 2, height: 10, backgroundColor: '#D1D5DB' },
  transitChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, gap: 5, borderWidth: 1, borderColor: '#E5E7EB' },
  transitDuration: { fontSize: 10, fontWeight: '700', color: '#111827' },
  transitDivider: { color: '#9CA3AF', fontSize: 9 },
  transitLabel: { fontSize: 10, color: '#4B5563' },
  transitCost: { fontSize: 10, fontWeight: '700', color: '#0D9488' },
  addStopButton: { marginHorizontal: 16, marginTop: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  addStopText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },

  /* Budget, Notes, Journal */
  tabContentContainer: { paddingHorizontal: 16, paddingTop: 8 },
  budgetOverviewCard: { backgroundColor: '#0F172A', borderRadius: 22, padding: 18, marginBottom: 14 },
  budgetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  budgetCardSubHeader: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  budgetTotalAmount: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginTop: 2 },
  groupSizePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255, 255, 255, 0.12)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  groupSizeText: { color: '#2DD4BF', fontSize: 11, fontWeight: '700' },
  budgetFxNote: { color: '#94A3B8', fontSize: 11, marginTop: 4, marginBottom: 16 },
  equalSplitHighlightBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 16 },
  splitIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0F2926', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  equalSplitTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  equalSplitSubtitle: { color: '#94A3B8', fontSize: 10, marginTop: 1 },
  equalSplitValue: { color: '#2DD4BF', fontSize: 16, fontWeight: '800' },
  progressContainer: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  progressPct: { color: '#F8FAFC', fontSize: 11, fontWeight: '700' },
  progressBarTrack: { height: 6, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0D9488', borderRadius: 3 },
  openExpensesBtn: { backgroundColor: '#0D9488', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16 },
  openExpensesLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  openExpensesText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  emergencyBannerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#FECACA', marginBottom: 14 },
  emergencyBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  sosShieldIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  emergencyBannerTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  emergencyBannerSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  notesHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  notesHeadingText: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.6 },
  notesSubText: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  dropNoteButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#0D9488', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 12 },
  dropNoteButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  notesListContainer: { gap: 10 },
  noteCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  noteTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  noteAuthorBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noteAuthorAvatar: { width: 28, height: 28, borderRadius: 14 },
  noteAuthorName: { fontSize: 12, fontWeight: '700', color: '#111827' },
  noteTimeText: { fontSize: 10, color: '#9CA3AF' },
  noteTagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  noteTagText: { fontSize: 10, fontWeight: '700' },
  noteCardTitle: { fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 4 },
  noteCardBody: { fontSize: 12, color: '#4B5563', lineHeight: 18 },
  journalActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  journalMainHeading: { fontSize: 18, fontWeight: '800', color: '#111827' },
  journalMainSub: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  journalUploadPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0D9488', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 14 },
  journalUploadText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  peopleAlbumBox: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 14 },
  peopleHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  peopleSubLabel: { fontSize: 10, fontWeight: '800', color: '#0D9488', letterSpacing: 0.6 },
  clearFilterText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  peopleCarousel: { gap: 12 },
  personCard: { alignItems: 'center', width: 76 },
  personCardActive: { transform: [{ scale: 1.05 }] },
  personAvatarRing: { width: 60, height: 60, borderRadius: 30, padding: 2, borderWidth: 2, borderColor: '#E5E7EB' },
  personAvatarRingActive: { borderColor: '#0D9488', borderWidth: 2.5 },
  personAvatarImg: { width: '100%', height: '100%', borderRadius: 28 },
  sparkleAiBadge: { position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderRadius: 9, backgroundColor: '#0D9488', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFFFFF' },
  personName: { fontSize: 11, fontWeight: '700', color: '#374151', marginTop: 6, textAlign: 'center' },
  personNameActive: { color: '#0D9488', fontWeight: '800' },
  personPhotoCount: { fontSize: 10, color: '#9CA3AF', marginTop: 1 },
  gridSectionHeader: { fontSize: 13, fontWeight: '800', color: '#111827', marginBottom: 10 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gridPhotoItem: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E5E7EB' },
  gridPhotoImg: { width: '100%', height: '100%' },
  tagPillBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0, 0, 0, 0.65)', flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  tagPillBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },

  /* Modals */
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  voucherModalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 14 },
  voucherHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  voucherMainTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  voucherSubTitle: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  closeCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  boardingPassCard: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1.5, borderColor: '#CCFBF1', overflow: 'hidden', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  passHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0FDFA', marginHorizontal: -16, marginTop: -16, padding: 12, marginBottom: 14 },
  passAirline: { fontSize: 13, fontWeight: '800', color: '#0D9488' },
  passClass: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  passBodyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  passCity: { fontSize: 14, fontWeight: '800', color: '#111827' },
  passTime: { fontSize: 18, fontWeight: '900', color: '#0D9488', marginVertical: 2 },
  passDate: { fontSize: 10, color: '#6B7280' },
  passInfoGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 10, marginBottom: 14 },
  passMetaLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8' },
  passMetaVal: { fontSize: 13, fontWeight: '800', color: '#111827', marginTop: 2 },
  qrContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  qrBarcodeText: { fontSize: 10, fontWeight: '700', color: '#6B7280', letterSpacing: 0.8, marginTop: 6 },
  doneBtn: { backgroundColor: '#111827', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 16 },
  doneBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  detailCategory: { fontSize: 9, fontWeight: '800', color: '#0D9488', letterSpacing: 0.6 },
  detailTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 2 },
  detailSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  sectionHeaderLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginVertical: 8 },
  detailGalleryImage: { width: 130, height: 90, borderRadius: 12, backgroundColor: '#E5E7EB' },
  detailReviewBox: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  detailScore: { fontSize: 13, fontWeight: '800', color: '#111827' },
  detailCount: { fontSize: 10, color: '#6B7280' },
  detailReviewSnippet: { fontSize: 11, color: '#4B5563', fontStyle: 'italic', lineHeight: 16, marginTop: 6 },
  detailHours: { fontSize: 10, color: '#6B7280', marginTop: 6 },
  detailAbout: { fontSize: 11, color: '#4B5563', lineHeight: 16 },
  detailDoneBtn: { backgroundColor: '#111827', paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginTop: 16 },
  detailDoneBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});