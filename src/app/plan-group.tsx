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
  Share,
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
const GROUP_FLIGHT_OUTBOUND_PRICE = 390;
const GROUP_FLIGHT_RETURN_PRICE = 420;
const GROUP_HOTEL_RATE_PER_NIGHT = 400;
const GROUP_HOTEL_NIGHTS = 4;

interface MemberStatus {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  tags: string[];
}

interface ActivityStop {
  id: string;
  time: string;
  title: string;
  category: string;
  location: string;
  rating: string;
  reviews: string;
  cost: string;
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
  image: string;
  isHotel?: boolean;
  googleReviewsData: {
    starRating: string;
    totalReviews: string;
    photos: string[];
    comments: { user: string; rating: string; text: string; time: string }[];
  };
}

interface PlanVariant {
  id: string;
  name: string;
  tagline: string;
  votes: number;
  userVoted: boolean;
}

interface AlternativeSpot {
  id: string;
  title: string;
  location: string;
  rating: string;
  reviews: string;
  category: string;
  image: string;
  googleReviewsData: {
    starRating: string;
    totalReviews: string;
    photos: string[];
    comments: { user: string; rating: string; text: string; time: string }[];
  };
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function PlanGroupScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Dual Start & End Time State
  const [dayStartTime, setDayStartTime] = useState('09:00 AM');
  const [dayEndTime, setDayEndTime] = useState('09:00 PM');
  const [showTimeConfig, setShowTimeConfig] = useState(false);

  // Invite & QR Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Payment Checkout Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Review Modals State
  const [activeReviewStop, setActiveReviewStop] = useState<ActivityStop | null>(null);
  const [activeAltReviewSpot, setActiveAltReviewSpot] = useState<AlternativeSpot | null>(null);

  // Alternative AI Suggestions Modal
  const [showAlternativeModal, setShowAlternativeModal] = useState(false);
  const [activeAlternativeStopId, setActiveAlternativeStopId] = useState<string | null>(null);

  // Add Custom Place Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customTime, setCustomTime] = useState('02:00 PM');

  // Edit Stop Time Modal State
  const [editingTimeStopId, setEditingTimeStopId] = useState<string | null>(null);
  const [newTimeInput, setNewTimeInput] = useState('');

  // AI Group Travel Agent Chat Modal State
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  const [advisorInput, setAdvisorInput] = useState('');
  const [advisorMessages, setAdvisorMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello group! You can tap on any time badge to customize the schedule for each stop!',
    },
  ]);

  const alternativesList: AlternativeSpot[] = [
    { 
      id: 'alt-1',
      title: 'Fushimi Inari Hidden Trail & Shrine', 
      location: 'Fushimi Ward, Kyoto', 
      rating: '4.9★', 
      reviews: '55.1k reviews',
      category: 'Culture', 
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
      googleReviewsData: {
        starRating: '4.9 / 5.0',
        totalReviews: '55,120 Google Reviews',
        photos: [
          'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
        ],
        comments: [
          { user: 'Marcus T.', rating: '★★★★★', text: 'Mesmerizing red gates winding up the forested mountain. Best hiked early morning!', time: '2 days ago' },
        ],
      },
    },
    { 
      id: 'alt-2',
      title: 'Philosophers Path & Canal Walk', 
      location: 'Northern Higashiyama', 
      rating: '4.7★', 
      reviews: '14.2k reviews',
      category: 'Nature', 
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
      googleReviewsData: {
        starRating: '4.7 / 5.0',
        totalReviews: '14,200 Google Reviews',
        photos: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
        ],
        comments: [
          { user: 'Elena K.', rating: '★★★★★', text: 'Peaceful stone path flanked by cherry trees.', time: '3 days ago' },
        ],
      },
    },
  ];

  const [members, setMembers] = useState<MemberStatus[]>([
    { id: '1', name: 'Ivory (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', isReady: true, tags: ['#Chill', '#CafeHopping', '#Halal'] },
    { id: '2', name: 'Chin Jie', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', isReady: true, tags: ['#Photography', '#Chill', '#Halal'] },
    { id: '3', name: 'ZhiHeng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', isReady: false, tags: [] },
    { id: '4', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120', isReady: false, tags: [] },
  ]);

  const [polls, setPolls] = useState<PlanVariant[]>([
    { id: 'v1', name: 'Option A: Relaxed Cultural Flow', tagline: 'Late morning starts, scenic tea houses, minimal transit stress', votes: 3, userVoted: true },
    { id: 'v2', name: 'Option B: Dynamic City Discovery', tagline: 'Early markets, photography spots, specialty cafe hops', votes: 1, userVoted: false },
  ]);

  const [timelineStops, setTimelineStops] = useState<Record<number, ActivityStop[]>>({
    1: [
      {
        id: 'st-1',
        time: '09:00 AM',
        title: 'Nishiki Market Specialty Food Crawl',
        category: 'Food & Cafes',
        location: 'Nakagyo Ward, Kyoto',
        rating: '4.5★',
        reviews: '18.9k reviews',
        cost: '¥1,800',
        likes: 3,
        dislikes: 1,
        userReaction: null,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
        googleReviewsData: {
          starRating: '4.5 / 5.0',
          totalReviews: '18,900 Google Reviews',
          photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'],
          comments: [{ user: 'Kenji S.', rating: '★★★★★', text: 'Fresh seafood skewers and soy donuts!', time: '1 week ago' }],
        },
      },
      {
        id: 'st-2',
        time: '11:45 AM',
        title: 'Arashiyama Bamboo Grove & Riverside',
        category: 'Sightseeing',
        location: 'Ukyo Ward, Kyoto',
        rating: '4.7★',
        reviews: '32.4k reviews',
        cost: 'Free',
        likes: 4,
        dislikes: 0,
        userReaction: 'like',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
        googleReviewsData: {
          starRating: '4.7 / 5.0',
          totalReviews: '32,400 Google Reviews',
          photos: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400'],
          comments: [{ user: 'Daniel W.', rating: '★★★★★', text: 'Stunning bamboo forest walk.', time: 'Yesterday' }],
        },
      },
      {
        id: 'st-hotel',
        time: '02:30 PM',
        title: 'Hotel Check-In: Traders Hotel KL',
        category: 'Hotel Stay',
        location: 'KLCC Park View • 0.2 km from center',
        rating: '4.8★',
        reviews: '2,410 reviews',
        cost: `RM ${GROUP_HOTEL_RATE_PER_NIGHT} x ${GROUP_HOTEL_NIGHTS} nights = RM ${GROUP_HOTEL_RATE_PER_NIGHT * GROUP_HOTEL_NIGHTS}`,
        likes: 4,
        dislikes: 0,
        userReaction: 'like',
        isHotel: true,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
        googleReviewsData: {
          starRating: '4.8 / 5.0',
          totalReviews: '2,410 Google Reviews',
          photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
          ],
          comments: [{ user: 'Jonathan L.', rating: '★★★★★', text: 'Spectacular twin towers view!', time: '2 days ago' }],
        },
      },
    ],
  });

  const currentStops = timelineStops[selectedDay] || [];
  const readyCount = members.filter((m) => m.isReady).length;
  const groupFlightPerPersonTotal = GROUP_FLIGHT_OUTBOUND_PRICE + GROUP_FLIGHT_RETURN_PRICE;
  const groupFlightTotal = groupFlightPerPersonTotal * members.length;
  const groupHotelTotal = GROUP_HOTEL_RATE_PER_NIGHT * GROUP_HOTEL_NIGHTS;
  const groupPaymentTotal = groupFlightTotal + groupHotelTotal;

  const handleSwap = (fromIdx: number, toIdx: number) => {
    const updated = [...currentStops];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setTimelineStops((prev) => ({ ...prev, [selectedDay]: updated }));
  };

  const handleApplyAlternative = (alt: AlternativeSpot) => {
    if (!activeAlternativeStopId) return;

    setTimelineStops((prev) => {
      const current = prev[selectedDay] || [];
      const updated = current.map((s) => {
        if (s.id !== activeAlternativeStopId) return s;
        return {
          ...s,
          title: alt.title,
          location: alt.location,
          rating: alt.rating,
          reviews: alt.reviews,
          category: alt.category,
          image: alt.image,
          googleReviewsData: alt.googleReviewsData,
        };
      });
      return { ...prev, [selectedDay]: updated };
    });

    setShowAlternativeModal(false);
    Alert.alert('Destination Swapped ✨', 'AI successfully updated your route with the selected alternative.');
  };

  const handleResolvePlaceGps = () => {
    if (!customTitle.trim()) {
      Alert.alert('Enter Place Name First', 'Type a destination or attraction name above to fetch its exact GPS coordinates.');
      return;
    }

    const placeLower = customTitle.toLowerCase();
    let detectedCoord = '35.0037° N, 135.7772° E • Kyoto Prefecture';

    if (placeLower.includes('kiyomizu')) {
      detectedCoord = '34.9949° N, 135.7850° E • Higashiyama Ward, Kyoto';
    } else if (placeLower.includes('inari') || placeLower.includes('shrine')) {
      detectedCoord = '34.9671° N, 135.7727° E • Fushimi Ward, Kyoto';
    } else if (placeLower.includes('kinkaku') || placeLower.includes('golden')) {
      detectedCoord = '35.0394° N, 135.7292° E • Kita Ward, Kyoto';
    } else if (placeLower.includes('klcc') || placeLower.includes('twin')) {
      detectedCoord = '3.1578° N, 101.7118° E • Kuala Lumpur City Centre';
    }

    setCustomLocation(detectedCoord);
    Alert.alert('Place GPS Acquired 📍', `Resolved exact geo-coordinates for "${customTitle.trim()}".`);
  };

  const handleAddCustomPlace = () => {
    if (!customTitle.trim() || !customLocation.trim()) {
      Alert.alert('Missing Details', 'Please enter a place title and location/GPS.');
      return;
    }
    const newStop: ActivityStop = {
      id: `custom-${Date.now()}`,
      time: customTime,
      title: customTitle.trim(),
      category: 'User Added',
      location: customLocation.trim(),
      rating: '4.8★',
      reviews: 'Custom Spot',
      cost: 'Free',
      likes: 1,
      dislikes: 0,
      userReaction: 'like',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
      googleReviewsData: {
        starRating: '4.8 / 5.0',
        totalReviews: 'User Added Spot',
        photos: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400'],
        comments: [{ user: 'You', rating: '★★★★★', text: 'Added to group route.', time: 'Just now' }],
      },
    };
    setTimelineStops((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newStop],
    }));
    setCustomTitle('');
    setCustomLocation('');
    setShowAddModal(false);
  };

  const handleSaveEditedTime = () => {
    if (!editingTimeStopId || !newTimeInput.trim()) return;
    setTimelineStops((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((s) => (s.id === editingTimeStopId ? { ...s, time: newTimeInput.trim() } : s)),
    }));
    setEditingTimeStopId(null);
    setNewTimeInput('');
  };

  const handleSendAdvisorMessage = () => {
    if (!advisorInput.trim()) return;
    const userText = advisorInput.trim();
    setAdvisorMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setAdvisorInput('');

    setTimeout(() => {
      let reply = 'Option A matches everyone best! Average daily spending stands at ¥3,050/person.';
      if (userText.toLowerCase().includes('halal') || userText.toLowerCase().includes('food')) {
        reply = 'Ayam-YA Karasuma and Naritaya Gion are both 10 minutes from your scheduled stops and certified Halal.';
      } else if (userText.toLowerCase().includes('crowd') || userText.toLowerCase().includes('busy')) {
        reply = 'Visiting Nishiki Market before 11:30 AM avoids peak tourist crowd density.';
      }
      setAdvisorMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: reply }]);
    }, 700);
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: 'Join our trip workspace on Escape to review the route and vote: app.escape.io/join/kansai-2026',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleNudge = (name: string) => {
    Alert.alert('Reminder Sent 🔔', `Sent an instant ping to ${name} to finish selecting tags.`);
  };

  const handleVoteVariant = (id: string) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, votes: p.userVoted ? p.votes - 1 : p.votes + 1, userVoted: !p.userVoted };
        }
        return { ...p, votes: p.userVoted ? p.votes - 1 : p.votes, userVoted: false };
      })
    );
  };

  const handleReaction = (stopId: string, type: 'like' | 'dislike') => {
    setTimelineStops((prev) => {
      const current = prev[selectedDay] || [];
      const updated = current.map((stop) => {
        if (stop.id !== stopId) return stop;
        let likes = stop.likes;
        let dislikes = stop.dislikes;

        if (stop.userReaction === type) {
          if (type === 'like') likes--;
          if (type === 'dislike') dislikes--;
          return { ...stop, likes, dislikes, userReaction: null };
        } else {
          if (type === 'like') {
            likes++;
            if (stop.userReaction === 'dislike') dislikes--;
          } else {
            dislikes++;
            if (stop.userReaction === 'like') likes--;
          }
          return { ...stop, likes, dislikes, userReaction: type };
        }
      });
      return { ...prev, [selectedDay]: updated };
    });
  };

  const handleFinalizeGroupPayment = () => {
    setShowPaymentModal(false);
    Alert.alert('Group Booking Completed! 💳🎉', 'Itinerary is locked and all group reservation vouchers are saved.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.topBarTitle}>Group Route Studio</Text>
          <Text style={styles.topBarSub}>4 Collaborators Active • AI Optimized</Text>
        </View>
        <TouchableOpacity onPress={() => setShowInviteModal(true)} style={styles.inviteSharePill}>
          <Ionicons name="qr-code-outline" size={13} color="#0D9488" />
          <Text style={styles.inviteSharePillText}>Invite</Text>
        </TouchableOpacity>
      </View>

      <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* MEMBERS INTEREST TAG PROGRESS */}
        <View style={styles.topStatusSection}>
          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>ROUTE VARIANT VOTING</Text>
              <View style={styles.liveVoteBadge}>
                <Text style={styles.liveVoteBadgeText}>ACTIVE POLL</Text>
              </View>
            </View>
            {polls.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.pollCard, p.userVoted && styles.pollCardActive]}
                onPress={() => handleVoteVariant(p.id)}
                activeOpacity={0.85}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.pollTitle, p.userVoted && styles.pollTitleActive]}>{p.name}</Text>
                  <Text style={styles.pollSub}>{p.tagline}</Text>
                </View>
                <View style={[styles.votePill, p.userVoted && styles.votePillActive]}>
                  <Ionicons name="thumbs-up" size={12} color={p.userVoted ? '#FFFFFF' : '#0D9488'} />
                  <Text style={[styles.voteCount, p.userVoted && styles.voteCountActive]}>{p.votes}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.cardBox}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>MEMBER SURVEY & TAG PROGRESS</Text>
              <Text style={styles.memberRatioText}>{readyCount}/{members.length} Ready</Text>
            </View>

            {members.map((m) => (
              <View key={m.id} style={styles.memberRow}>
                <Image source={{ uri: m.avatar }} style={styles.avatarImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={m.isReady ? styles.readyText : styles.pendingText}>
                    {m.isReady ? `✓ Tags: ${m.tags.join(', ')}` : '⏳ Selecting preferences'}
                  </Text>
                </View>

                {!m.isReady ? (
                  <TouchableOpacity onPress={() => handleNudge(m.name)} style={styles.nudgeBtn}>
                    <Ionicons name="notifications-outline" size={12} color="#D97706" />
                    <Text style={styles.nudgeText}>Nudge</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.doneCircle}>
                    <Ionicons name="checkmark" size={12} color="#0D9488" />
                  </View>
                )}
              </View>
            ))}

            <View style={styles.consensusBoxInline}>
              <Text style={styles.consensusHeading}>🔥 GROUP CONSENSUS TAGS</Text>
              <View style={styles.tagWrap}>
                <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Chill (2/2)</Text></View>
                <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#CafeHopping (2/2)</Text></View>
                <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Halal (2/2)</Text></View>
              </View>
            </View>
          </View>
        </View>

        {/* HOTEL BANNER & DUAL TIME CONFIGURATION */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneRow}>
            <View style={styles.milestoneItem}>
              <Ionicons name="bed-outline" size={18} color="#0D9488" style={{ marginTop: 2 }} />
              <View style={styles.milestoneTextWrapper}>
                <Text style={styles.milestoneTitle} numberOfLines={1}>Traders Hotel Kuala Lumpur</Text>
                <Text style={styles.milestoneSub} numberOfLines={1}>Tap time pill on card to adjust check-in schedule</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.timeBadgeMini} onPress={() => setShowTimeConfig(!showTimeConfig)}>
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.timeBadgeMiniText}>{dayStartTime} – {dayEndTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showTimeConfig && (
          <View style={styles.timeConfigDropdown}>
            <Text style={styles.configHeading}>Configure Daily Pacing Hours</Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.configLabel}>Start Time:</Text>
              <View style={styles.configRow}>
                {['08:00 AM', '09:00 AM', '10:00 AM'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setDayStartTime(t)}
                    style={[styles.timeOptionPill, dayStartTime === t && styles.timeOptionActive]}
                  >
                    <Text style={[styles.timeOptionText, dayStartTime === t && styles.timeOptionTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View>
              <Text style={styles.configLabel}>End Time:</Text>
              <View style={styles.configRow}>
                {['08:00 PM', '09:00 PM', '10:00 PM'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => { setDayEndTime(t); setShowTimeConfig(false); }}
                    style={[styles.timeOptionPill, dayEndTime === t && styles.timeOptionActive]}
                  >
                    <Text style={[styles.timeOptionText, dayEndTime === t && styles.timeOptionTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setSelectedDay(d)}
              style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
            >
              <Text style={[styles.dayChipText, selectedDay === d && styles.dayChipTextActive]}>Day {d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeaderRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.timelineDayTitle}>Day {selectedDay} Proposed Route</Text>
            <Text style={styles.sectionHint}>Tap any time badge (e.g. 9:00 AM ✎) to edit visit time</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addStopBtn}>
            <Ionicons name="add" size={14} color="#FFFFFF" />
            <Text style={styles.addStopBtnText}> Add Place</Text>
          </TouchableOpacity>
        </View>

        {/* Stops List */}
        <View style={styles.stopsList}>
          {currentStops.map((stop, index) => (
            <InteractiveGroupDragCard
              key={stop.id}
              item={stop}
              index={index}
              totalItems={currentStops.length}
              onSwap={handleSwap}
              onPressCard={() => setActiveReviewStop(stop)}
              onPressTime={() => {
                setEditingTimeStopId(stop.id);
                setNewTimeInput(stop.time);
              }}
              onOpenAlternative={() => {
                setActiveAlternativeStopId(stop.id);
                setShowAlternativeModal(true);
              }}
              onReaction={handleReaction}
              setScrollEnabled={setScrollEnabled}
            />
          ))}
        </View>

        {/* Finalize Route Card */}
        <View style={styles.lockNoticeCard}>
          <View style={styles.lockNoticeLeft}>
            <Ionicons name="shield-checkmark" size={20} color="#0D9488" />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockNoticeTitle}>Ready to Finalize Route?</Text>
              <Text style={styles.lockNoticeSub}>Lock in group schedule and complete booking payment.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.lockMainBtn} onPress={() => setShowPaymentModal(true)}>
            <Ionicons name="card" size={15} color="#FFFFFF" />
            <Text style={styles.lockMainBtnText}>Lock Itinerary & Proceed to Payment 💳</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FLOATING AI TRAVEL AGENT TRIGGER */}
      <TouchableOpacity
        style={styles.floatingAiButton}
        activeOpacity={0.85}
        onPress={() => setShowAiAdvisor(true)}
      >
        <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        <Text style={styles.floatingAiText}>Ask AI Travel Agent</Text>
      </TouchableOpacity>

      {/* QR-BASED INVITE MODAL SHEET */}
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
                <Text style={styles.modalTitle}>Invite Travel Buddies</Text>
                <Text style={styles.modalSubheading}>Scan QR or share workspace link</Text>
              </View>
              <TouchableOpacity onPress={() => setShowInviteModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View style={styles.qrCardBox}>
              <Ionicons name="qr-code" size={128} color="#0F172A" />
              <Text style={styles.qrCardHint}>Scan with mobile camera to join workspace</Text>
            </View>

            <View style={styles.copyLinkRow}>
              <Ionicons name="link" size={16} color="#6B7280" />
              <Text style={styles.copyLinkInput} numberOfLines={1}>
                app.escape.io/join/kansai-2026
              </Text>
              <TouchableOpacity
                style={styles.copyActionBtn}
                onPress={() => Alert.alert('Copied 📋', 'Workspace invite link copied to clipboard!')}
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

      {/* EDIT VISIT TIME MODAL WITH PRESETS & CUSTOM INPUT */}
      <Modal visible={!!editingTimeStopId} transparent animationType="slide" onRequestClose={() => setEditingTimeStopId(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Scheduled Timing ⏰</Text>
              <TouchableOpacity onPress={() => setEditingTimeStopId(null)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>QUICK TIME PRESETS</Text>
            <View style={styles.presetsRow}>
              {['08:30 AM', '10:00 AM', '11:45 AM', '01:30 PM', '03:00 PM', '06:00 PM'].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => setNewTimeInput(preset)}
                  style={[styles.presetBadge, newTimeInput === preset && styles.presetBadgeActive]}
                >
                  <Text style={[styles.presetText, newTimeInput === preset && styles.presetTextActive]}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>OR TYPE CUSTOM TIME</Text>
            <TextInput
              value={newTimeInput}
              onChangeText={setNewTimeInput}
              placeholder="e.g. 02:30 PM"
              style={styles.modalInput}
            />
            <TouchableOpacity style={[styles.modalSaveBtn, { marginTop: 14 }]} onPress={handleSaveEditedTime}>
              <Text style={styles.modalSaveBtnText}>Save Time Slot</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal visible={showPaymentModal} transparent animationType="slide" onRequestClose={() => setShowPaymentModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Confirm & Pay Group Itinerary</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View style={styles.checkoutBreakdown}>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>✈️ Batik Air OD612 (Group Flights)</Text>
                <Text style={styles.checkoutItemPrice}>RM {GROUP_FLIGHT_OUTBOUND_PRICE} / pax</Text>
              </View>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>Batik Air OD613 return</Text>
                <Text style={styles.checkoutItemPrice}>RM {GROUP_FLIGHT_RETURN_PRICE} / pax</Text>
              </View>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>Round-trip flight subtotal ({members.length} pax)</Text>
                <Text style={styles.checkoutItemPrice}>RM {groupFlightTotal}</Text>
              </View>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>🏨 Traders Hotel KL (Lodging)</Text>
                <Text style={styles.checkoutItemPrice}>RM {GROUP_HOTEL_RATE_PER_NIGHT} / night</Text>
              </View>
              <View style={styles.checkoutRow}>
                <Text style={styles.checkoutItemName}>Hotel stay ({GROUP_HOTEL_NIGHTS} nights)</Text>
                <Text style={styles.checkoutItemPrice}>RM {groupHotelTotal}</Text>
              </View>
              <View style={[styles.checkoutRow, { borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 8, marginTop: 8 }]}>
                <Text style={[styles.checkoutItemName, { fontWeight: '800', color: '#111827' }]}>Total Payment Due:</Text>
                <Text style={[styles.checkoutItemPrice, { fontWeight: '800', color: '#0D9488', fontSize: 16 }]}>RM {groupPaymentTotal}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.confirmPayBtn} onPress={handleFinalizeGroupPayment}>
              <Ionicons name="card" size={18} color="#FFFFFF" />
              <Text style={styles.confirmPayBtnText}>Pay RM {groupPaymentTotal} with Apple Pay / Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RICH GOOGLE REVIEWS MODAL */}
      <Modal visible={!!activeReviewStop} transparent animationType="slide" onRequestClose={() => setActiveReviewStop(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetLarge}>
            <View style={styles.sheetHandle} />
            {activeReviewStop && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle} numberOfLines={1}>{activeReviewStop.title}</Text>
                  <TouchableOpacity onPress={() => setActiveReviewStop(null)} style={styles.circleCloseBtn}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>
                
                <Image source={{ uri: activeReviewStop.image }} style={styles.reviewModalImage} />

                <View style={styles.googleRatingBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="logo-google" size={18} color="#4285F4" />
                    <Text style={styles.googleRatingText}>{activeReviewStop.googleReviewsData.starRating}</Text>
                  </View>
                  <Text style={styles.reviewCountText}>{activeReviewStop.googleReviewsData.totalReviews}</Text>
                </View>

                <Text style={styles.fieldLabel}>VISITOR PHOTO GALLERY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
                  {activeReviewStop.googleReviewsData.photos.map((p, idx) => (
                    <Image key={idx} source={{ uri: p }} style={styles.galleryPhoto} />
                  ))}
                </ScrollView>

                <Text style={styles.fieldLabel}>VERIFIED REVIEWS & COMMENTS</Text>
                {activeReviewStop.googleReviewsData.comments.map((c, idx) => (
                  <View key={idx} style={styles.commentCard}>
                    <View style={styles.commentTopRow}>
                      <Text style={styles.commentUser}>{c.user}</Text>
                      <Text style={styles.commentStars}>{c.rating}</Text>
                    </View>
                    <Text style={styles.commentText}>{c.text}</Text>
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </View>
                ))}

                <TouchableOpacity style={[styles.modalSaveBtn, { marginTop: 16 }]} onPress={() => setActiveReviewStop(null)}>
                  <Text style={styles.modalSaveBtnText}>Close & Return to Studio</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* RICH GOOGLE REVIEWS MODAL FOR ALTERNATIVE SUGGESTIONS */}
      <Modal visible={!!activeAltReviewSpot} transparent animationType="slide" onRequestClose={() => setActiveAltReviewSpot(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetLarge}>
            <View style={styles.sheetHandle} />
            {activeAltReviewSpot && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle} numberOfLines={1}>{activeAltReviewSpot.title}</Text>
                  <TouchableOpacity onPress={() => setActiveAltReviewSpot(null)} style={styles.circleCloseBtn}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>
                
                <Image source={{ uri: activeAltReviewSpot.image }} style={styles.reviewModalImage} />

                <View style={styles.googleRatingBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="logo-google" size={18} color="#4285F4" />
                    <Text style={styles.googleRatingText}>{activeAltReviewSpot.googleReviewsData.starRating}</Text>
                  </View>
                  <Text style={styles.reviewCountText}>{activeAltReviewSpot.googleReviewsData.totalReviews}</Text>
                </View>

                <Text style={styles.fieldLabel}>VISITOR PHOTO GALLERY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
                  {activeAltReviewSpot.googleReviewsData.photos.map((p, idx) => (
                    <Image key={idx} source={{ uri: p }} style={styles.galleryPhoto} />
                  ))}
                </ScrollView>

                <Text style={styles.fieldLabel}>VERIFIED REVIEWS & COMMENTS</Text>
                {activeAltReviewSpot.googleReviewsData.comments.map((c, idx) => (
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
                    const spotToSwap = activeAltReviewSpot;
                    setActiveAltReviewSpot(null);
                    handleApplyAlternative(spotToSwap);
                  }}
                >
                  <Text style={styles.modalSaveBtnText}>Swap to Itinerary Now ✨</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ADD DESIRABLE PLACE MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Add Desirable Place</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>PLACE TITLE</Text>
            <TextInput 
              value={customTitle} 
              onChangeText={setCustomTitle} 
              placeholder="e.g. Fushimi Inari Shrine, Kiyomizu-dera..." 
              style={styles.modalInput} 
            />

            <TouchableOpacity style={styles.gpsSelectBtn} onPress={handleResolvePlaceGps}>
              <Ionicons name="locate" size={16} color="#0D9488" />
              <Text style={styles.gpsSelectBtnText}>Fetch Place GPS Coordinates 📍</Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>EXACT LOCATION / GPS COORDINATES</Text>
            <TextInput 
              value={customLocation} 
              onChangeText={setCustomLocation} 
              placeholder="e.g. 34.9671° N, 135.7727° E" 
              style={styles.modalInput} 
            />

            <Text style={styles.fieldLabel}>VISIT TIME</Text>
            <TextInput value={customTime} onChangeText={setCustomTime} placeholder="e.g. 03:30 PM" style={styles.modalInput} />

            <TouchableOpacity style={[styles.modalSaveBtn, { marginTop: 16 }]} onPress={handleAddCustomPlace}>
              <Text style={styles.modalSaveBtnText}>Add to Itinerary</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ALTERNATIVE DESTINATIONS MODAL */}
      <Modal visible={showAlternativeModal} transparent animationType="slide" onRequestClose={() => setShowAlternativeModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetLarge}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>AI Suggested Alternatives</Text>
              <TouchableOpacity onPress={() => setShowAlternativeModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldLabel}>TAP ANY CARD TO VIEW REVIEWS OR SWAP</Text>

            <ScrollView contentContainerStyle={{ gap: 10, marginTop: 8 }} showsVerticalScrollIndicator={false}>
              {alternativesList.map((alt) => (
                <View key={alt.id} style={styles.altCardWrapper}>
                  <TouchableOpacity
                    style={styles.altCardMain}
                    onPress={() => {
                      setShowAlternativeModal(false);
                      setActiveAltReviewSpot(alt);
                    }}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: alt.image }} style={styles.altThumbnail} />
                    <View style={{ flex: 1, padding: 10 }}>
                      <Text style={styles.altTitle} numberOfLines={1}>{alt.title}</Text>
                      <Text style={styles.altSub}>📍 {alt.location}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Ionicons name="logo-google" size={12} color="#4285F4" />
                        <Text style={styles.altRatingText}>{alt.rating} ({alt.reviews})</Text>
                        <Text style={styles.tapReviewHint}>• Tap for reviews 🔍</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.swapActionPill} onPress={() => handleApplyAlternative(alt)}>
                    <Text style={styles.swapActionText}>Swap</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* AI TRAVEL AGENT CHAT MODAL */}
      <Modal visible={showAiAdvisor} transparent animationType="slide" onRequestClose={() => setShowAiAdvisor(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={styles.agentSheetExpanded}>
            <View style={styles.sheetHandle} />
            <View style={styles.agentHeader}>
              <View style={styles.agentHeaderTitleRow}>
                <Ionicons name="sparkles" size={18} color="#0D9488" />
                <Text style={styles.agentHeaderTitle}>AI Travel Agent Copilot</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAiAdvisor(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.agentChatAreaExpanded} contentContainerStyle={{ gap: 10 }}>
              {advisorMessages.map((m) => (
                <View
                  key={m.id}
                  style={[styles.agentBubble, m.sender === 'user' ? styles.agentBubbleUser : styles.agentBubbleAi]}
                >
                  <Text style={[styles.agentBubbleText, m.sender === 'user' && styles.agentBubbleTextUser]}>
                    {m.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.agentInputBar}>
              <TextInput
                value={advisorInput}
                onChangeText={setAdvisorInput}
                placeholder="Ask about budget split, Halal food, crowd tips..."
                placeholderTextColor="#9CA3AF"
                style={styles.agentInputField}
              />
              <TouchableOpacity style={styles.agentSendBtn} onPress={handleSendAdvisorMessage}>
                <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function InteractiveGroupDragCard({
  item,
  index,
  totalItems,
  onSwap,
  onPressCard,
  onPressTime,
  onOpenAlternative,
  onReaction,
  setScrollEnabled,
}: {
  item: ActivityStop;
  index: number;
  totalItems: number;
  onSwap: (from: number, to: number) => void;
  onPressCard: () => void;
  onPressTime: () => void;
  onOpenAlternative: () => void;
  onReaction: (id: string, type: 'like' | 'dislike') => void;
  setScrollEnabled: (enabled: boolean) => void;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const currentDisplacement = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderGrant: () => {
        setIsDragging(true);
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
        setIsDragging(false);
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
        { transform: [{ translateY: pan.y }, { scale }], zIndex: isDragging ? 9999 : 1, elevation: isDragging ? 10 : 1 },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onPressCard}
        style={[
          styles.stopCard, 
          isDragging && styles.stopCardActiveDrag,
          item.isHotel && styles.hotelStopCard
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.stopThumbnail} />
        <View style={styles.stopBody}>
          <View style={styles.stopTopRow}>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                onPressTime();
              }} 
              style={[styles.stopTimeBadge, item.isHotel && { backgroundColor: '#FEF3C7' }]}
            >
              <Text style={[styles.stopTimeBadgeText, item.isHotel && { color: '#B45309' }]}>
                {item.time} ✎
              </Text>
            </TouchableOpacity>
            <Text style={[styles.stopCategoryText, item.isHotel && { color: '#B45309', fontWeight: '800' }]}>{item.category}</Text>
          </View>
          <Text style={styles.stopTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.stopLocation} numberOfLines={1}>📍 {item.location} • <Text style={{ color: '#F59E0B', fontWeight: '700' }}>{item.rating}</Text></Text>

          {!item.isHotel && (
            <View style={styles.opinionVoteRow}>
              <Text style={styles.opinionLabel}>Group opinion:</Text>
              <View style={styles.reactionGroup}>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); onReaction(item.id, 'like'); }}
                  style={[styles.reactionBtn, item.userReaction === 'like' && styles.reactionBtnLikeActive]}
                >
                  <Ionicons name="thumbs-up" size={11} color={item.userReaction === 'like' ? '#FFFFFF' : '#10B981'} />
                  <Text style={[styles.reactionCountText, item.userReaction === 'like' && styles.reactionCountActive]}>
                    {item.likes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); onReaction(item.id, 'dislike'); }}
                  style={[styles.reactionBtn, item.userReaction === 'dislike' && styles.reactionBtnDislikeActive]}
                >
                  <Ionicons name="thumbs-down" size={11} color={item.userReaction === 'dislike' ? '#FFFFFF' : '#EF4444'} />
                  <Text style={[styles.reactionCountText, item.userReaction === 'dislike' && styles.reactionCountActive]}>
                    {item.dislikes}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.cardActionsColumn}>
          {!item.isHotel && (
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); onOpenAlternative(); }}
              style={styles.iconActionBtn}
            >
              <Ionicons name="sparkles" size={14} color="#0D9488" />
            </TouchableOpacity>
          )}
          <View style={styles.dragIndicator}>
            <Ionicons name="reorder-two-outline" size={20} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  titleBox: { flex: 1, marginLeft: 12 },
  topBarTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  topBarSub: { fontSize: 11, color: '#6B7280' },
  inviteSharePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inviteSharePillText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  scrollContent: { padding: 16, paddingBottom: 220 },
  topStatusSection: { marginBottom: 14 },
  cardBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardHeaderTitle: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.6 },
  liveVoteBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  liveVoteBadgeText: { fontSize: 9, fontWeight: '800', color: '#B45309' },
  memberRatioText: { fontSize: 11, fontWeight: '800', color: '#0D9488' },
  pollCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  pollCardActive: { borderColor: '#0D9488', backgroundColor: '#F0FDFA' },
  pollTitle: { fontSize: 13, fontWeight: '700', color: '#374151' },
  pollTitleActive: { color: '#0D9488', fontWeight: '800' },
  pollSub: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  votePillActive: { backgroundColor: '#0D9488' },
  voteCount: { fontSize: 11, fontWeight: '800', color: '#0D9488' },
  voteCountActive: { color: '#FFFFFF' },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3F4F6',
    gap: 10,
  },
  avatarImg: { width: 32, height: 32, borderRadius: 16 },
  memberName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  readyText: { fontSize: 10, color: '#0D9488', fontWeight: '600' },
  pendingText: { fontSize: 10, color: '#D97706', fontWeight: '600' },
  nudgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nudgeText: { fontSize: 10, fontWeight: '700', color: '#B45309' },
  doneCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#CCFBF1', alignItems: 'center', justifyContent: 'center' },
  consensusBoxInline: { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 10, marginTop: 10 },
  consensusHeading: { fontSize: 9, fontWeight: '800', color: '#4338CA', letterSpacing: 0.5, marginBottom: 4 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  consensusTag: { backgroundColor: '#4338CA', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  consensusTagText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
  milestoneCard: { 
    backgroundColor: '#F0FDFA', 
    borderRadius: 14, 
    padding: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#CCFBF1' 
  },
  milestoneRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: 10
  },
  milestoneItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    flex: 1 
  },
  milestoneTextWrapper: {
    flex: 1,
    paddingRight: 4
  },
  milestoneTitle: { 
    fontSize: 12.5, 
    fontWeight: '800', 
    color: '#0F766E' 
  },
  milestoneSub: { 
    fontSize: 10.5, 
    color: '#0D9488', 
    marginTop: 1.5 
  },
  timeBadgeMini: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: '#0D9488', 
    paddingHorizontal: 8, 
    paddingVertical: 5, 
    borderRadius: 8,
    flexShrink: 0
  },
  timeBadgeMiniText: { 
    fontSize: 10.5, 
    fontWeight: '800', 
    color: '#FFFFFF' 
  },
  timeConfigDropdown: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  configHeading: { fontSize: 12, fontWeight: '800', color: '#111827', marginBottom: 8 },
  configRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  configLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', width: 70 },
  timeOptionPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#F3F4F6' },
  timeOptionActive: { backgroundColor: '#0D9488' },
  timeOptionText: { fontSize: 10, fontWeight: '700', color: '#4B5563' },
  timeOptionTextActive: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  dayScroll: { gap: 8, marginBottom: 14 },
  dayChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  dayChipActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  dayChipText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  dayChipTextActive: { color: '#FFFFFF' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timelineDayTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  sectionHint: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  addStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addStopBtnText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  stopsList: { gap: 8, marginBottom: 16 },
  stopCardWrapper: { height: CARD_HEIGHT },
  stopCard: {
    height: CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hotelStopCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF7',
    borderWidth: 1.5,
  },
  stopCardActiveDrag: {
    borderColor: '#0D9488',
    backgroundColor: '#FAFCFD',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  stopThumbnail: { width: 90, height: '100%', backgroundColor: '#E5E7EB' },
  stopBody: { flex: 1, padding: 12 },
  stopTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  stopTimeBadge: { 
    backgroundColor: '#F0FDFA', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  stopTimeBadgeText: { fontSize: 10.5, fontWeight: '800', color: '#0D9488' },
  stopCategoryText: { fontSize: 9, color: '#6B7280' },
  stopTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginTop: 1 },
  stopLocation: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  opinionVoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3F4F6',
  },
  opinionLabel: { fontSize: 9, color: '#9CA3AF' },
  reactionGroup: { flexDirection: 'row', gap: 6 },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reactionBtnLikeActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  reactionBtnDislikeActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  reactionCountText: { fontSize: 10, fontWeight: '700', color: '#4B5563' },
  reactionCountActive: { color: '#FFFFFF' },
  cardActionsColumn: { alignItems: 'center', paddingRight: 10, gap: 8 },
  iconActionBtn: { padding: 7, borderRadius: 8, backgroundColor: '#F0FDFA' },
  dragIndicator: { padding: 4 },
  lockNoticeCard: { 
    backgroundColor: '#0F172A', 
    borderRadius: 18, 
    padding: 16, 
    marginTop: 10,
    marginBottom: 20 
  },
  lockNoticeLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  lockNoticeTitle: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  lockNoticeSub: { fontSize: 10.5, color: '#94A3B8', marginTop: 1 },
  lockMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    borderRadius: 12,
  },
  lockMainBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  floatingAiButton: {
    position: 'absolute',
    bottom: 96,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#0D9488',
    elevation: 6,
    zIndex: 9999,
  },
  floatingAiText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalSheetLarge: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: '80%' },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 14 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111827', flex: 1, marginRight: 10 },
  modalSubheading: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  circleCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },

  /* QR Modal Card Styles */
  qrCardBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrCardHint: { fontSize: 11, color: '#64748B', marginTop: 8 },
  copyLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  copyLinkInput: { flex: 1, fontSize: 12, color: '#334155', marginHorizontal: 8 },
  copyActionBtn: { backgroundColor: '#CCFBF1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  copyActionText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  primaryShareBtn: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryShareText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  presetsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  presetBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  presetBadgeActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  presetText: { fontSize: 11, fontWeight: '700', color: '#4B5563' },
  presetTextActive: { color: '#FFFFFF' },
  checkoutBreakdown: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  checkoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  checkoutItemName: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  checkoutItemPrice: { fontSize: 13, color: '#111827', fontWeight: '700' },
  confirmPayBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0D9488', paddingVertical: 14, borderRadius: 14 },
  confirmPayBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
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
  modalInput: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  gpsSelectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F0FDFA', borderWidth: 1, borderColor: '#CCFBF1', paddingVertical: 10, borderRadius: 12, marginBottom: 12 },
  gpsSelectBtnText: { fontSize: 12, fontWeight: '700', color: '#0D9488' },
  altCardWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', marginBottom: 8 },
  altCardMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  altThumbnail: { width: 72, height: 72, backgroundColor: '#E5E7EB' },
  altTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  altSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  altRatingText: { fontSize: 11, fontWeight: '700', color: '#1E293B' },
  tapReviewHint: { fontSize: 10, color: '#0D9488', fontWeight: '600' },
  swapActionPill: { backgroundColor: '#0D9488', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 12 },
  swapActionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  agentSheetExpanded: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 26, borderTopRightRadius: 26, height: '75%', padding: 18 },
  agentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  agentHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  agentHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  agentChatAreaExpanded: { flex: 1, marginVertical: 10 },
  agentBubble: { padding: 12, borderRadius: 14, maxWidth: '85%', marginVertical: 4 },
  agentBubbleAi: { backgroundColor: '#F0FDFA', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#CCFBF1' },
  agentBubbleUser: { backgroundColor: '#111827', alignSelf: 'flex-end' },
  agentBubbleText: { fontSize: 13, color: '#0F766E', lineHeight: 18 },
  agentBubbleTextUser: { color: '#FFFFFF' },
  agentInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Platform.OS === 'ios' ? 12 : 4,
  },
  agentInputField: { flex: 1, fontSize: 13, color: '#111827' },
  agentSendBtn: { backgroundColor: '#0D9488', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
