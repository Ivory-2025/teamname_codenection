import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CARD_HEIGHT = 112;

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
}

interface PlanVariant {
  id: string;
  name: string;
  tagline: string;
  votes: number;
  userVoted: boolean;
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

  // Edit / Add Place Modal State
  const [showStopModal, setShowStopModal] = useState(false);
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [stopTitle, setStopTitle] = useState('');
  const [stopTime, setStopTime] = useState('02:00 PM');
  const [stopCategory, setStopCategory] = useState('Sightseeing');

  // Floating AI Group Advisor Modal State (75% height)
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  const [advisorInput, setAdvisorInput] = useState('');
  const [advisorMessages, setAdvisorMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello group! Based on your Halal and #SleepIn tags, I scheduled Day 1 to start at 10:30 AM with certified dining nearby.',
    },
  ]);

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
        time: '10:30 AM',
        title: 'Arashiyama Bamboo Grove & Riverside',
        category: 'Sightseeing',
        location: 'Ukyo Ward, Kyoto',
        rating: '4.7★',
        reviews: '32.4k',
        cost: 'Free',
        likes: 4,
        dislikes: 0,
        userReaction: 'like',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
      },
      {
        id: 'st-2',
        time: '01:15 PM',
        title: 'Nishiki Market Specialty Food Crawl',
        category: 'Food & Cafes',
        location: 'Nakagyo Ward, Kyoto',
        rating: '4.5★',
        reviews: '18.9k',
        cost: '¥1,800',
        likes: 3,
        dislikes: 1,
        userReaction: null,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      },
      {
        id: 'st-3',
        time: '04:30 PM',
        title: 'Gion Teahouse Sunset Session',
        category: 'Culture',
        location: 'Gion, Kyoto',
        rating: '4.8★',
        reviews: '8.2k',
        cost: '¥1,200',
        likes: 4,
        dislikes: 0,
        userReaction: 'like',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
      },
    ],
    2: [
      {
        id: 'st-4',
        time: '10:00 AM',
        title: 'Fushimi Inari Torii Gate Hike',
        category: 'Culture',
        location: 'Fushimi Ward, Kyoto',
        rating: '4.9★',
        reviews: '55.1k',
        cost: 'Free',
        likes: 3,
        dislikes: 0,
        userReaction: 'like',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
      },
    ],
  });

  const currentStops = timelineStops[selectedDay] || [];
  const readyCount = members.filter((m) => m.isReady).length;

  const handleSwap = (fromIdx: number, toIdx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updated = [...currentStops];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setTimelineStops((prev) => ({
      ...prev,
      [selectedDay]: updated,
    }));
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
          return {
            ...p,
            votes: p.userVoted ? p.votes - 1 : p.votes + 1,
            userVoted: !p.userVoted,
          };
        }
        return {
          ...p,
          votes: p.userVoted ? p.votes - 1 : p.votes,
          userVoted: false,
        };
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

  const handleOpenAddModal = () => {
    setEditingStopId(null);
    setStopTitle('');
    setStopTime('02:00 PM');
    setStopCategory('Sightseeing');
    setShowStopModal(true);
  };

  const handleOpenEdit = (stop: ActivityStop) => {
    setEditingStopId(stop.id);
    setStopTitle(stop.title);
    setStopTime(stop.time);
    setStopCategory(stop.category);
    setShowStopModal(true);
  };

  const handleSaveStop = () => {
    if (!stopTitle.trim()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (editingStopId) {
      setTimelineStops((prev) => ({
        ...prev,
        [selectedDay]: prev[selectedDay].map((s) =>
          s.id === editingStopId
            ? { ...s, title: stopTitle.trim(), time: stopTime, category: stopCategory }
            : s
        ),
      }));
    } else {
      const item: ActivityStop = {
        id: `custom-${Date.now()}`,
        time: stopTime,
        title: stopTitle.trim(),
        category: stopCategory,
        location: 'Kyoto & Osaka',
        rating: 'New Spot',
        reviews: 'Group Added',
        cost: 'Free',
        likes: 1,
        dislikes: 0,
        userReaction: 'like',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
      };
      setTimelineStops((prev) => ({
        ...prev,
        [selectedDay]: [...(prev[selectedDay] || []), item],
      }));
    }

    setShowStopModal(false);
  };

  const handleDeleteStop = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTimelineStops((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((s) => s.id !== id),
    }));
    setShowStopModal(false);
  };

  const handleSendAdvisorMessage = () => {
    if (!advisorInput.trim()) return;
    const userText = advisorInput.trim();
    setAdvisorMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setAdvisorInput('');

    setTimeout(() => {
      let reply = 'Option A matches everyone best! Average daily spending stands at ¥3,050/person.';
      if (userText.toLowerCase().includes('halal') || userText.toLowerCase().includes('food')) {
        reply = 'Ayam-YA Karasuma and Naritaya Gion are both 10 minutes from your scheduled stops.';
      }
      setAdvisorMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: reply }]);
    }, 700);
  };

  const handleLockAndConfirm = () => {
    Alert.alert(
      'Lock-In Group Itinerary?',
      'All members have confirmed the route. This freezes changes, activates offline maps, and saves the trip to your Home dashboard.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Confirm & Save',
          style: 'default',
          onPress: () => router.replace('/itinerary-detail'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.topBarTitle}>Group Route Studio</Text>
          <Text style={styles.topBarSub}>4 Collaborators Active</Text>
        </View>
        <TouchableOpacity onPress={handleShareInvite} style={styles.inviteSharePill}>
          <Ionicons name="share-social-outline" size={13} color="#0D9488" />
          <Text style={styles.inviteSharePillText}>Invite</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================================= */}
        {/* TOP ANCHORED SECTION: POLLS & SURVEY STATUS                               */}
        {/* ========================================================================= */}
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
              <Text style={styles.cardHeaderTitle}>MEMBER SURVEY READINESS</Text>
              <Text style={styles.memberRatioText}>{readyCount}/{members.length} Ready</Text>
            </View>

            {members.map((m) => (
              <View key={m.id} style={styles.memberRow}>
                <Image source={{ uri: m.avatar }} style={styles.avatarImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={m.isReady ? styles.readyText : styles.pendingText}>
                    {m.isReady ? `✓ Tags: ${m.tags.join(', ')}` : '⏳ Waiting for tags'}
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
              <Text style={styles.consensusHeading}>🔥 GROUP CONSENSUS</Text>
              <View style={styles.tagWrap}>
                <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Chill (2/2)</Text></View>
                <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#CafeHopping (2/2)</Text></View>
                <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Halal (2/2)</Text></View>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* TIMELINE SECTION                                                          */}
        {/* ========================================================================= */}
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
          <View>
            <Text style={styles.timelineDayTitle}>Day {selectedDay} Proposed Route</Text>
            <Text style={styles.sectionHint}>Drag cards up/down to swap • Tap pencil to edit</Text>
          </View>
          <TouchableOpacity onPress={handleOpenAddModal} style={styles.addStopBtn}>
            <Ionicons name="add" size={14} color="#FFFFFF" />
            <Text style={styles.addStopBtnText}>Add Place</Text>
          </TouchableOpacity>
        </View>

        {/* Draggable Group Stops List */}
        <View style={styles.stopsList}>
          {currentStops.map((stop, index) => (
            <InteractiveGroupDragCard
              key={stop.id}
              item={stop}
              index={index}
              totalItems={currentStops.length}
              onSwap={handleSwap}
              onEdit={() => handleOpenEdit(stop)}
              onReaction={handleReaction}
              setScrollEnabled={setScrollEnabled}
            />
          ))}
        </View>

        {/* Lock Plan Action */}
        <View style={styles.lockNoticeCard}>
          <View style={styles.lockNoticeLeft}>
            <Ionicons name="shield-checkmark" size={20} color="#0D9488" />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockNoticeTitle}>Ready to Finalize?</Text>
              <Text style={styles.lockNoticeSub}>Locking freezes edits and saves this plan to the itinerary dashboard.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.lockMainBtn} onPress={handleLockAndConfirm}>
            <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
            <Text style={styles.lockMainBtnText}>Confirm Plan & Lock</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating AI Agent Trigger */}
      <TouchableOpacity
        style={styles.floatingAiButton}
        activeOpacity={0.85}
        onPress={() => setShowAiAdvisor(true)}
      >
        <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        <Text style={styles.floatingAiText}>Ask AI Copilot</Text>
      </TouchableOpacity>

      {/* Add / Edit Stop Modal */}
      <Modal visible={showStopModal} transparent animationType="slide" onRequestClose={() => setShowStopModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{editingStopId ? 'Edit Place' : 'Add New Place'}</Text>
              <TouchableOpacity onPress={() => setShowStopModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>PLACE TITLE</Text>
            <TextInput
              value={stopTitle}
              onChangeText={setStopTitle}
              placeholder="e.g. Yasaka Pagoda Sunset"
              style={styles.modalInput}
            />

            <Text style={styles.fieldLabel}>SCHEDULED TIME</Text>
            <TextInput
              value={stopTime}
              onChangeText={setStopTime}
              placeholder="e.g. 03:00 PM"
              style={styles.modalInput}
            />

            <View style={styles.modalBtnRow}>
              {editingStopId && (
                <TouchableOpacity
                  style={styles.deleteStopBtn}
                  onPress={() => handleDeleteStop(editingStopId)}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveStop}>
                <Text style={styles.modalSaveBtnText}>{editingStopId ? 'Save Changes' : 'Add to Day'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Expanded AI Advisor Chat Modal (75% Height) */}
      <Modal visible={showAiAdvisor} transparent animationType="slide" onRequestClose={() => setShowAiAdvisor(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={styles.agentSheetExpanded}>
            <View style={styles.sheetHandle} />
            <View style={styles.agentHeader}>
              <View style={styles.agentHeaderTitleRow}>
                <Ionicons name="sparkles" size={18} color="#0D9488" />
                <Text style={styles.agentHeaderTitle}>Group AI Advisor</Text>
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
                placeholder="Ask about budget split, Halal spots, transit..."
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

// -------------------------------------------------------------
// SMOOTH SWAP GROUP CARD
// -------------------------------------------------------------
function InteractiveGroupDragCard({
  item,
  index,
  totalItems,
  onSwap,
  onEdit,
  onReaction,
  setScrollEnabled,
}: {
  item: ActivityStop;
  index: number;
  totalItems: number;
  onSwap: (from: number, to: number) => void;
  onEdit: () => void;
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
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        setScrollEnabled(false);
        Animated.spring(scale, { toValue: 1.04, friction: 5, useNativeDriver: false }).start();
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
      onPanResponderTerminate: () => {
        setIsDragging(false);
        setScrollEnabled(true);
        currentDisplacement.current = 0;
        Animated.parallel([
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: false }),
        ]).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.stopCardWrapper,
        {
          transform: [{ translateY: pan.y }, { scale }],
          zIndex: isDragging ? 9999 : 1,
          elevation: isDragging ? 10 : 1,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.stopCard, isDragging && styles.stopCardActiveDrag]}>
        <Image source={{ uri: item.image }} style={styles.stopThumbnail} />

        <View style={styles.stopBody}>
          <View style={styles.stopTopRow}>
            <View style={styles.stopTimeBadge}>
              <Text style={styles.stopTimeBadgeText}>{item.time}</Text>
            </View>
            <Text style={styles.stopCategoryText}>{item.category}</Text>
          </View>

          <Text style={styles.stopTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.stopLocation} numberOfLines={1}>📍 {item.location}</Text>

          <View style={styles.stopMetaRow}>
            <Text style={styles.stopRatingText}>{item.rating} ({item.reviews})</Text>
            <Text style={styles.stopCostText}>{item.cost}</Text>
          </View>

          <View style={styles.opinionVoteRow}>
            <Text style={styles.opinionLabel}>Group opinion:</Text>
            <View style={styles.reactionGroup}>
              <TouchableOpacity
                onPress={() => onReaction(item.id, 'like')}
                style={[styles.reactionBtn, item.userReaction === 'like' && styles.reactionBtnLikeActive]}
              >
                <Ionicons name="thumbs-up" size={11} color={item.userReaction === 'like' ? '#FFFFFF' : '#10B981'} />
                <Text style={[styles.reactionCountText, item.userReaction === 'like' && styles.reactionCountActive]}>
                  {item.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onReaction(item.id, 'dislike')}
                style={[styles.reactionBtn, item.userReaction === 'dislike' && styles.reactionBtnDislikeActive]}
              >
                <Ionicons name="thumbs-down" size={11} color={item.userReaction === 'dislike' ? '#FFFFFF' : '#EF4444'} />
                <Text style={[styles.reactionCountText, item.userReaction === 'dislike' && styles.reactionCountActive]}>
                  {item.dislikes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.cardActionsColumn}>
          <TouchableOpacity onPress={onEdit} style={styles.iconActionBtn}>
            <Ionicons name="pencil" size={15} color="#0D9488" />
          </TouchableOpacity>
          <View style={styles.dragIndicator}>
            <Ionicons name="reorder-two-outline" size={20} color="#9CA3AF" />
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  scrollContent: { padding: 16, paddingBottom: 170 },

  /* Top Anchored Status Section */
  topStatusSection: { marginBottom: 14 },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
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
  doneCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consensusBoxInline: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  consensusHeading: { fontSize: 9, fontWeight: '800', color: '#4338CA', letterSpacing: 0.5, marginBottom: 4 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  consensusTag: { backgroundColor: '#4338CA', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  consensusTagText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },

  /* Day Selector */
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  timelineDayTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  sectionHint: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  addStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addStopBtnText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },

  /* Stops & Dragging */
  stopsList: { gap: 8, marginBottom: 16 },
  stopCardWrapper: {
    height: CARD_HEIGHT,
  },
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
  stopTimeBadge: { backgroundColor: '#F0FDFA', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  stopTimeBadgeText: { fontSize: 10, fontWeight: '700', color: '#0D9488' },
  stopCategoryText: { fontSize: 9, color: '#6B7280' },
  stopTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginTop: 1 },
  stopLocation: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  stopMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  stopRatingText: { fontSize: 10, fontWeight: '700', color: '#F59E0B' },
  stopCostText: { fontSize: 10, fontWeight: '700', color: '#0D9488' },
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
  cardActionsColumn: {
    alignItems: 'center',
    paddingRight: 10,
    gap: 8,
  },
  iconActionBtn: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
  },
  dragIndicator: {
    padding: 4,
  },

  /* Lock Card */
  lockNoticeCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginTop: 6,
  },
  lockNoticeLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  lockNoticeTitle: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  lockNoticeSub: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
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

  /* Floating AI Trigger */
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingAiText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  /* Add / Edit Modal */
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 14 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  circleCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginTop: 8, marginBottom: 5 },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalBtnRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  deleteStopBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveBtn: { flex: 1, backgroundColor: '#111827', height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modalSaveBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  /* Expanded AI Advisor Modal (75% Height) */
  agentSheetExpanded: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: '75%',
    padding: 18,
  },
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