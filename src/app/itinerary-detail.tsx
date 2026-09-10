import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

interface AttachmentItem {
  id: string;
  type: 'ticket' | 'booking' | 'pdf';
  title: string;
  code: string;
  qrAvailable: boolean;
}

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
  attachments?: AttachmentItem[];
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
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    tag: 'Logistics',
    title: 'Packing & Logistics',
    content: 'Universal adapter, e-SIM, JR pass pickup at Kansai Airport Terminal 1 counter.',
    timeAgo: '2h ago',
  },
  {
    id: 'n2',
    author: 'Chin Jie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    tag: 'Food',
    title: 'Halal Ramen Reservation',
    content: 'Ayam-YA Karasuma doesn’t require advance reservations, but we should arrive by 6:00 PM to avoid lines.',
    timeAgo: '5h ago',
  },
];

const PEOPLE_ALBUMS: PersonAlbum[] = [
  {
    id: 'm1',
    name: 'Ivory (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'm2',
    name: 'Chin Jie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'm3',
    name: 'ZhiHeng',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'm4',
    name: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
];

const INITIAL_PHOTOS: JournalPhoto[] = [
  {
    id: 'p1',
    uri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    caption: 'Morning stroll through the towering bamboo grove',
    location: 'Arashiyama, Kyoto',
    date: 'Oct 14, 09:30 AM',
    uploadedBy: 'Ivory (You)',
    taggedMemberIds: ['m1', 'm2'],
  },
  {
    id: 'p2',
    uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    caption: 'Giant grilled squid skewers! 🦑',
    location: 'Nishiki Market',
    date: 'Oct 14, 01:15 PM',
    uploadedBy: 'Chin Jie',
    taggedMemberIds: ['m2', 'm3'],
  },
  {
    id: 'p3',
    uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    caption: 'Golden Pavilion gleaming under the sun',
    location: 'Kinkaku-ji',
    date: 'Oct 14, 04:45 PM',
    uploadedBy: 'ZhiHeng',
    taggedMemberIds: ['m1', 'm3', 'm4'],
  },
];

const STOPS_DAY_1: StopItem[] = [
  {
    id: '1',
    time: '09:00 AM',
    title: 'Arashiyama Bamboo Grove',
    neighborhood: 'Ukyo Ward, Kyoto',
    category: 'Sightseeing',
    rating: '4.6',
    reviews: '32.4k',
    operatingHours: 'Open 24 Hours',
    isClash: false,
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    ],
    description:
      'A natural forest of bamboo in Arashiyama. Walking paths cut through the towering green stalks.',
    attachments: [
      {
        id: 'att-1',
        type: 'ticket',
        title: 'Sagano Scenic Railway Pass',
        code: 'SAGANO-8849-2026',
        qrAvailable: true,
      },
    ],
    transitToNext: {
      mode: 'subway',
      label: 'Subway & Walk',
      duration: '22 min',
      cost: 'RM 8 (¥240)',
    },
  },
  {
    id: '2',
    time: '12:30 PM',
    title: 'Nishiki Market Food Crawl',
    neighborhood: 'Nakagyo Ward, Kyoto',
    category: 'Food & Dining',
    rating: '4.4',
    reviews: '18.9k',
    operatingHours: '10:00 AM – 06:00 PM',
    isClash: false,
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    ],
    description: 'Kyoto kitchen street lined with seafood, skewers, and street snacks.',
    transitToNext: {
      mode: 'car',
      label: 'Grab / Taxi',
      duration: '14 min',
      cost: 'RM 14',
    },
  },
  {
    id: '3',
    time: '06:15 PM',
    title: 'Kinkaku-ji (Golden Pavilion)',
    neighborhood: 'Kita Ward, Kyoto',
    category: 'Culture & Temple',
    rating: '4.7',
    reviews: '45.1k',
    operatingHours: '09:00 AM – 05:00 PM',
    isClash: true,
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    ],
    description: 'Iconic golden temple. Scheduled visit is after closing hours.',
  },
];

export default function ItineraryDetailScreen() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState<'Itinerary' | 'Budget' | 'Notes' | 'Journal'>('Itinerary');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAlignmentModal, setShowAlignmentModal] = useState(false);
  const [alignmentSubTab, setAlignmentSubTab] = useState<'preferences' | 'benchmark'>('benchmark');
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<StopItem | null>(null);

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

  // Preferences State
  const [selectedTags, setSelectedTags] = useState<string[]>(['#CafeHopping', '#Chill']);
  const [stayBudget, setStayBudget] = useState('250');
  const [transitCap, setTransitCap] = useState('40');
  const [dailyLiving, setDailyLiving] = useState('120');

  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    if (!showBeaconModal) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showBeaconModal]);

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
        uri: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80',
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
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
      {/* Top App Bar with SOS Button */}
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
            style={styles.beaconButton}
            onPress={() => setShowBeaconModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="radio" size={13} color="#B45309" />
            <Text style={styles.beaconButtonText}>Beacon</Text>
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
              uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80',
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
                <Text style={styles.dayTitle}>Day {selectedDay} • Kyoto Highlights</Text>
                <Text style={styles.daySubtitle}>3 places • Est. 6 hrs • ~¥2,240</Text>
              </View>
              <View style={styles.optimizeBadge}>
                <Ionicons name="sparkles" size={12} color="#0D9488" />
                <Text style={styles.optimizeText}>Optimized</Text>
              </View>
            </View>

            <View style={styles.timelineContainer}>
              {STOPS_DAY_1.map((stop, index) => (
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
                        {stop.attachments && stop.attachments.length > 0 ? (
                          <View style={styles.ticketBadge}>
                            <Ionicons name="ticket-outline" size={11} color="#0D9488" />
                            <Text style={styles.ticketBadgeText}>Pass Attached</Text>
                          </View>
                        ) : (
                          <Text style={styles.tapPromptText}>Tap for details ›</Text>
                        )}
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

        {/* TAB 2: BUDGET & OVERALL TRIP EXPENSES */}
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

            <View style={styles.benchmarkCard}>
              <View style={styles.benchmarkTopRow}>
                <View>
                  <Text style={styles.benchmarkCardTitle}>Agreed Budget Ceilings</Text>
                  <Text style={styles.benchmarkCardSub}>Calibrated by 4 trip members</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setAlignmentSubTab('benchmark');
                    setShowAlignmentModal(true);
                  }}
                  style={styles.recalibrateBtn}
                >
                  <Ionicons name="options-outline" size={12} color="#0D9488" />
                  <Text style={styles.recalibrateBtnText}>View Rules</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.miniCeilingRow}>
                <Text style={styles.miniCeilingLabel}>Hotel / Stay Cap:</Text>
                <Text style={styles.miniCeilingVal}>RM 200 - RM 300 / night</Text>
              </View>
              <View style={styles.miniCeilingRow}>
                <Text style={styles.miniCeilingLabel}>Transit Allowance:</Text>
                <Text style={styles.miniCeilingVal}>RM 35 / day (Public Transit)</Text>
              </View>
              <View style={styles.miniCeilingRow}>
                <Text style={styles.miniCeilingLabel}>Daily Food & Drinks:</Text>
                <Text style={styles.miniCeilingVal}>RM 100 - RM 150 / day</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: NOTES & SHARED MEMBER MEMOS */}
        {activeTab === 'Notes' && (
          <View style={styles.tabContentContainer}>
            {/* Emergency Quick Access Card */}
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

            {/* Notes Section Header with Drop a Note Button */}
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

            {/* Rendered Notes List */}
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

        {/* TAB 4: DIGITAL JOURNAL & AI SMART FACE ALBUMS */}
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

            {isScanning && (
              <View style={styles.scanningBanner}>
                <Ionicons name="scan-outline" size={16} color="#0D9488" />
                <Text style={styles.scanningText}>Detecting faces & sorting into albums...</Text>
              </View>
            )}

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

      {/* DROP A NOTE MODAL SHEET */}
      <Modal
        visible={showNoteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNoteModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalHeading}>Drop a Group Note</Text>
                <Text style={styles.modalSubheading}>Visible to all travelers in real time</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNoteModal(false)} style={styles.closeCircle}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {/* Note Tag Selector */}
              <Text style={styles.sectionHeaderLabel}>CATEGORY TAG</Text>
              <View style={styles.tagWrapRow}>
                {(['General', 'Logistics', 'Food', 'Tickets'] as const).map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => setNewNoteTag(tag)}
                    style={[styles.noteTagPill, newNoteTag === tag && styles.noteTagPillActive]}
                  >
                    <Text style={[styles.noteTagPillText, newNoteTag === tag && styles.noteTagPillTextActive]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionHeaderLabel}>NOTE TITLE</Text>
              <TextInput
                value={newNoteTitle}
                onChangeText={setNewNoteTitle}
                placeholder="e.g. Luggage storage in Kyoto station"
                placeholderTextColor="#9CA3AF"
                style={styles.modalTextInput}
              />

              <Text style={styles.sectionHeaderLabel}>DETAILS</Text>
              <TextInput
                value={newNoteContent}
                onChangeText={setNewNoteContent}
                placeholder="Write locker numbers, locker codes, reminders..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                style={[styles.modalTextInput, styles.modalTextArea]}
              />

              <TouchableOpacity style={styles.postNoteBtn} onPress={handleAddNote}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                <Text style={styles.postNoteBtnText}>Post Note</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* PHOTO INSPECTOR MODAL */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.inspectorBackdrop}>
          <View style={styles.inspectorCard}>
            {selectedPhoto && (
              <>
                <View style={styles.inspectorTopBar}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inspectorLocation}>📍 {selectedPhoto.location}</Text>
                    <Text style={styles.inspectorDate}>{selectedPhoto.date}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedPhoto(null)}
                    style={styles.inspectorCloseCircle}
                  >
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Image source={{ uri: selectedPhoto.uri }} style={styles.inspectorHeroImage} />

                <View style={styles.inspectorBody}>
                  <Text style={styles.inspectorCaption}>"{selectedPhoto.caption}"</Text>
                  <Text style={styles.inspectorAuthor}>Shared by {selectedPhoto.uploadedBy}</Text>

                  <Text style={styles.inspectorSectionLabel}>IDENTIFIED IN THIS PHOTO</Text>
                  <View style={styles.tagWrap}>
                    {selectedPhoto.taggedMemberIds.map((mId) => {
                      const person = PEOPLE_ALBUMS.find((p) => p.id === mId);
                      if (!person) return null;
                      return (
                        <View key={person.id} style={styles.recognizedChip}>
                          <Image source={{ uri: person.avatar }} style={styles.recognizedAvatar} />
                          <Text style={styles.recognizedName}>{person.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* INVITE MODAL */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalHeading}>Invite Travel Buddies</Text>
                <Text style={styles.modalSubheading}>Share link or QR code to join workspace</Text>
              </View>
              <TouchableOpacity onPress={() => setShowInviteModal(false)} style={styles.closeCircle}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View style={styles.qrBox}>
              <Ionicons name="qr-code" size={130} color="#0F172A" />
              <Text style={styles.qrHint}>Scan to jump directly into the trip plan</Text>
            </View>

            <View style={styles.copyLinkRow}>
              <Ionicons name="link" size={16} color="#6B7280" />
              <Text style={styles.copyLinkInput} numberOfLines={1}>
                app.escape.io/join/kansai-2026
              </Text>
              <TouchableOpacity
                style={styles.copyActionBtn}
                onPress={() => Alert.alert('Copied', 'Invite link copied to clipboard!')}
              >
                <Text style={styles.copyActionText}>Copy</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryShareBtn} onPress={handleShareInvite}>
              <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
              <Text style={styles.primaryShareText}>Share via WhatsApp / Messages</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ALIGNMENT & BENCHMARK MODAL */}
      <Modal
        visible={showAlignmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAlignmentModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { maxHeight: '88%' }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalHeading}>Trip Alignment</Text>
                <Text style={styles.modalSubheading}>Sync travel vibes & financial ceilings</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAlignmentModal(false)} style={styles.closeCircle}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View style={styles.subTabBar}>
              <TouchableOpacity
                onPress={() => setAlignmentSubTab('preferences')}
                style={[styles.subTabItem, alignmentSubTab === 'preferences' && styles.subTabItemActive]}
              >
                <Text style={[styles.subTabText, alignmentSubTab === 'preferences' && styles.subTabTextActive]}>
                  My Preferences
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAlignmentSubTab('benchmark')}
                style={[styles.subTabItem, alignmentSubTab === 'benchmark' && styles.subTabItemActive]}
              >
                <Text style={[styles.subTabText, alignmentSubTab === 'benchmark' && styles.subTabTextActive]}>
                  Group Benchmark (4/4)
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {alignmentSubTab === 'preferences' ? (
                <View>
                  <Text style={styles.sectionHeaderLabel}>1. SELECT YOUR VIBE TAGS</Text>
                  <View style={styles.tagGrid}>
                    {VIBE_TAGS.map((tag) => {
                      const isActive = selectedTags.includes(tag.label);
                      return (
                        <TouchableOpacity
                          key={tag.id}
                          onPress={() => toggleTag(tag.label)}
                          style={[styles.tagPill, isActive && styles.tagPillActive]}
                        >
                          <Text style={[styles.tagPillText, isActive && styles.tagPillTextActive]}>
                            {tag.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={styles.sectionHeaderLabel}>2. PERSONAL BUDGET ALLOCATION (RM)</Text>

                  <View style={styles.budgetInputCard}>
                    <Text style={styles.budgetInputTitle}>Stay / Night (Max per room share)</Text>
                    <View style={styles.inputBar}>
                      <Text style={styles.inputPrefix}>RM</Text>
                      <TextInput
                        value={stayBudget}
                        onChangeText={setStayBudget}
                        keyboardType="numeric"
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  <View style={styles.budgetInputCard}>
                    <Text style={styles.budgetInputTitle}>Daily Transit Allowance</Text>
                    <View style={styles.inputBar}>
                      <Text style={styles.inputPrefix}>RM</Text>
                      <TextInput
                        value={transitCap}
                        onChangeText={setTransitCap}
                        keyboardType="numeric"
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  <View style={styles.budgetInputCard}>
                    <Text style={styles.budgetInputTitle}>Daily Food & Tickets Allowance</Text>
                    <View style={styles.inputBar}>
                      <Text style={styles.inputPrefix}>RM</Text>
                      <TextInput
                        value={dailyLiving}
                        onChangeText={setDailyLiving}
                        keyboardType="numeric"
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.saveAlignBtn}
                    onPress={() => {
                      Alert.alert('Saved', 'Your preferences have updated the group benchmark!');
                      setAlignmentSubTab('benchmark');
                    }}
                  >
                    <Text style={styles.saveAlignBtnText}>Update Group Benchmark →</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.consensusBox}>
                    <Text style={styles.consensusHeading}>🔥 COLLECTIVE GROUP MATCH</Text>
                    <View style={styles.tagWrap}>
                      <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#CafeHopping (4/4)</Text></View>
                      <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Chill (3/4)</Text></View>
                      <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Halal (2/4)</Text></View>
                    </View>
                    <Text style={styles.consensusDesc}>
                      "The group prioritizes relaxed mornings, specialty cafes, and Halal dining options."
                    </Text>
                  </View>

                  <Text style={styles.sectionHeaderLabel}>AGREED BUDGET CEILINGS</Text>

                  <View style={styles.ceilingCard}>
                    <View style={styles.ceilingRow}>
                      <Text style={styles.ceilingLabel}>Stay / Night</Text>
                      <Text style={styles.ceilingValue}>RM 200 – RM 300</Text>
                    </View>
                    <View style={styles.ceilingBar}><View style={[styles.ceilingProgress, { width: '75%' }]} /></View>
                    <Text style={styles.ceilingNote}>Group Avg: RM 240 / night</Text>
                  </View>

                  <View style={styles.ceilingCard}>
                    <View style={styles.ceilingRow}>
                      <Text style={styles.ceilingLabel}>Transit Preference</Text>
                      <Text style={styles.ceilingTeal}>🚆 Public Transit Preferred</Text>
                    </View>
                    <Text style={styles.ceilingNote}>Cap: RM 35 / day per person</Text>
                  </View>

                  <View style={styles.ceilingCard}>
                    <View style={styles.ceilingRow}>
                      <Text style={styles.ceilingLabel}>Daily Meals & Activities</Text>
                      <Text style={styles.ceilingValue}>RM 100 – RM 150</Text>
                    </View>
                    <View style={styles.ceilingBar}><View style={[styles.ceilingProgress, { width: '60%' }]} /></View>
                  </View>

                  <View style={styles.rulesBox}>
                    <Text style={styles.rulesTitle}>💡 ACTIVE AI FILTER RULES</Text>
                    <Text style={styles.ruleLine}>• Filters out stays above RM 300/night</Text>
                    <Text style={styles.ruleLine}>• Enforces Halal & Muslim-friendly eateries</Text>
                    <Text style={styles.ruleLine}>• Prefers walking and metro transit</Text>
                  </View>
                </View>
              )}
            </ScrollView>
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

                <Text style={styles.sectionHeaderLabel}>TICKETS & ATTACHMENTS</Text>
                {selectedPlace.attachments && selectedPlace.attachments.length > 0 ? (
                  selectedPlace.attachments.map((att) => (
                    <View key={att.id} style={styles.ticketCard}>
                      <Ionicons name="ticket" size={20} color="#0D9488" />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.ticketCardTitle}>{att.title}</Text>
                        <Text style={styles.ticketCardCode}>REF: {att.code}</Text>
                      </View>
                      <View style={styles.confirmedPill}><Text style={styles.confirmedPillText}>Confirmed</Text></View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noTicketText}>No passes attached to this location</Text>
                )}

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

      {/* BEACON / LIVE RADAR MODAL */}
      <Modal
        visible={showBeaconModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBeaconModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalHeading}>📍 Live Radar & Meetup</Text>
                <Text style={styles.modalSubheading}>Real-time proximity active for 4 members</Text>
              </View>
              <View style={styles.beaconActivePill}><Text style={styles.beaconActiveText}>ACTIVE</Text></View>
            </View>

            <View style={styles.meetupBox}>
              <Text style={styles.meetupSub}>DESIGNATED MEETUP POINT</Text>
              <Text style={styles.meetupName}>⛩️ Hachiko Statue / Main Gate</Text>
              <Text style={styles.meetupDist}>120m away from you</Text>
            </View>

            <View style={styles.countdownBox}>
              <Text style={styles.countdownLabel}>REGROUP COUNTDOWN</Text>
              <Text style={styles.countdownValue}>
                {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>

            <TouchableOpacity style={styles.detailDoneBtn} onPress={() => setShowBeaconModal(false)}>
              <Text style={styles.detailDoneBtnText}>Close Radar</Text>
            </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
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
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
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
  emergencyNavText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  beaconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  beaconButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
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
  alignmentButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 14,
  },
  inviteButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  heroCard: {
    margin: 16,
    height: 180,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
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
  countdownText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heroDates: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  heroLocation: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  tabItem: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
  },
  tabItemActive: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  dayScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayChipActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  daySubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  optimizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  optimizeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  timelineContainer: {
    paddingHorizontal: 16,
  },
  stopCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stopCardClash: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  stopThumbnail: {
    width: 88,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  stopContent: {
    flex: 1,
    padding: 12,
  },
  stopTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  stopIndexBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIndexBadgeClash: {
    backgroundColor: '#DC2626',
  },
  stopIndexText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  stopTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  stopTimeTextClash: {
    color: '#DC2626',
  },
  stopCategoryBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  clashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  clashBadgeText: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  stopTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  stopTitleClash: {
    color: '#991B1B',
  },
  stopNeighborhood: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  operatingHoursText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 3,
  },
  operatingHoursTextClash: {
    color: '#DC2626',
    fontWeight: '700',
  },
  stopFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  ticketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ticketBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0D9488',
  },
  tapPromptText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  transitWrapper: {
    alignItems: 'center',
    marginVertical: 3,
  },
  transitVerticalLine: {
    width: 2,
    height: 10,
    backgroundColor: '#D1D5DB',
  },
  transitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transitDuration: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
  },
  transitDivider: {
    color: '#9CA3AF',
    fontSize: 9,
  },
  transitLabel: {
    fontSize: 10,
    color: '#4B5563',
  },
  transitCost: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  addStopButton: {
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addStopText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  tabContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  budgetOverviewCard: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  budgetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  budgetCardSubHeader: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  budgetTotalAmount: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  groupSizePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  groupSizeText: {
    color: '#2DD4BF',
    fontSize: 11,
    fontWeight: '700',
  },
  budgetFxNote: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 16,
  },
  equalSplitHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  splitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F2926',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  equalSplitTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  equalSplitSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },
  equalSplitValue: {
    color: '#2DD4BF',
    fontSize: 16,
    fontWeight: '800',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  progressPct: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 3,
  },
  openExpensesBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  openExpensesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openExpensesText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  benchmarkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  benchmarkTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  benchmarkCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  benchmarkCardSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  recalibrateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  recalibrateBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  miniCeilingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3F4F6',
  },
  miniCeilingLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  miniCeilingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },

  /* Emergency Quick Banner in Notes */
  emergencyBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 14,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emergencyBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sosShieldIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  emergencyBannerSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },

  /* Notes Tab Styles */
  notesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesHeadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
  },
  notesSubText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  dropNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0D9488',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  dropNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  notesListContainer: {
    gap: 10,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteAuthorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteAuthorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  noteAuthorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  noteTimeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  noteTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  noteTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noteCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  noteCardBody: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },

  /* Note Modal Elements */
  tagWrapRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  noteTagPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  noteTagPillActive: {
    backgroundColor: '#0D9488',
  },
  noteTagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  noteTagPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalTextInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  modalTextArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  postNoteBtn: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  postNoteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Journal Tab Styling */
  journalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  journalMainHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  journalMainSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  journalUploadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  journalUploadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  peopleAlbumBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  peopleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  peopleSubLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.6,
  },
  clearFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  peopleCarousel: {
    gap: 12,
  },
  personCard: {
    alignItems: 'center',
    width: 76,
  },
  personCardActive: {
    transform: [{ scale: 1.05 }],
  },
  personAvatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  personAvatarRingActive: {
    borderColor: '#0D9488',
    borderWidth: 2.5,
  },
  personAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  sparkleAiBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  personName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
    textAlign: 'center',
  },
  personNameActive: {
    color: '#0D9488',
    fontWeight: '800',
  },
  personPhotoCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  scanningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 14,
  },
  scanningText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
  },
  gridSectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gridPhotoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  gridPhotoImg: {
    width: '100%',
    height: '100%',
  },
  tagPillBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagPillBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },

  /* Photo Inspector Modal */
  inspectorBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 16,
  },
  inspectorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  inspectorTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  inspectorLocation: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  inspectorDate: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  inspectorCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectorHeroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#0F172A',
  },
  inspectorBody: {
    padding: 18,
  },
  inspectorCaption: {
    color: '#F8FAFC',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  inspectorAuthor: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
  },
  inspectorSectionLabel: {
    color: '#2DD4BF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 16,
    marginBottom: 8,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recognizedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  recognizedAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  recognizedName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  /* Modals Common */
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    maxHeight: '85%',
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
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubheading: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qrHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },
  copyLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  copyLinkInput: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    marginHorizontal: 8,
  },
  copyActionBtn: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  copyActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  primaryShareBtn: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryShareText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  subTabItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  subTabItemActive: {
    backgroundColor: '#FFFFFF',
  },
  subTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  subTabTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginVertical: 8,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagPillActive: {
    backgroundColor: '#4338CA',
    borderColor: '#4338CA',
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  tagPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  budgetInputCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  budgetInputTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputPrefix: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 6,
  },
  saveAlignBtn: {
    backgroundColor: '#4338CA',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveAlignBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  consensusBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 12,
  },
  consensusHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  consensusTag: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  consensusTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  consensusDesc: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 16,
  },
  ceilingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  ceilingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ceilingLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  ceilingValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  ceilingTeal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  ceilingBar: {
    height: 5,
    backgroundColor: '#F3F4F6',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 3,
  },
  ceilingProgress: {
    height: '100%',
    backgroundColor: '#4338CA',
  },
  ceilingNote: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  rulesBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 6,
  },
  rulesTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ruleLine: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  detailCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.6,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  detailSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  detailGalleryImage: {
    width: 130,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  detailReviewBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  detailCount: {
    fontSize: 10,
    color: '#6B7280',
  },
  detailReviewSnippet: {
    fontSize: 11,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 6,
  },
  detailHours: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 6,
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  ticketCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  ticketCardCode: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  confirmedPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  confirmedPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0D9488',
  },
  noTicketText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  detailAbout: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  detailDoneBtn: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  detailDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  beaconActivePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  beaconActiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  meetupBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  meetupSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B7280',
  },
  meetupName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  meetupDist: {
    fontSize: 11,
    color: '#0D9488',
    marginTop: 2,
  },
  countdownBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  countdownLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  countdownValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginVertical: 2,
  },
});