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

const CARD_HEIGHT = 96;

interface StopItem {
  id: string;
  time: string;
  title: string;
  category: string;
  rating: string;
  reviews: string;
  cost: string;
  image: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function PlanSoloScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Edit / Add Place Modal State
  const [showStopModal, setShowStopModal] = useState(false);
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [stopTitle, setStopTitle] = useState('');
  const [stopTime, setStopTime] = useState('10:00 AM');
  const [stopCategory, setStopCategory] = useState('Sightseeing');

  // AI Agent Modal State (75% height)
  const [showAiAgent, setShowAiAgent] = useState(false);
  const [agentInput, setAgentInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hey! I am your Solo Copilot. Want advice on transit timing, cafe stops, or crowd density?',
    },
  ]);

  const [stopsByDay, setStopsByDay] = useState<Record<number, StopItem[]>>({
    1: [
      {
        id: '1',
        time: '10:00 AM',
        title: 'Kiyomizu-dera Early Walk',
        category: 'Sightseeing',
        rating: '4.8★',
        reviews: '41k',
        cost: '¥400',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
      },
      {
        id: '2',
        time: '01:30 PM',
        title: 'Solo Coffee & Matcha Roast',
        category: 'Cafe',
        rating: '4.6★',
        reviews: '4.2k',
        cost: '¥850',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      },
      {
        id: '3',
        time: '04:30 PM',
        title: 'Gion Hanamikoji Alley Walk',
        category: 'Culture',
        rating: '4.7★',
        reviews: '12k',
        cost: 'Free',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
      },
    ],
    2: [
      {
        id: '4',
        time: '11:00 AM',
        title: 'Arashiyama Bamboo Grove',
        category: 'Nature',
        rating: '4.7★',
        reviews: '32k',
        cost: 'Free',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
      },
    ],
  });

  const currentStops = stopsByDay[selectedDay] || [];

  const handleSwap = (fromIdx: number, toIdx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updated = [...currentStops];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setStopsByDay((prev) => ({
      ...prev,
      [selectedDay]: updated,
    }));
  };

  const handleOpenAdd = () => {
    setEditingStopId(null);
    setStopTitle('');
    setStopTime('02:00 PM');
    setStopCategory('Sightseeing');
    setShowStopModal(true);
  };

  const handleOpenEdit = (stop: StopItem) => {
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
      setStopsByDay((prev) => ({
        ...prev,
        [selectedDay]: prev[selectedDay].map((s) =>
          s.id === editingStopId
            ? { ...s, title: stopTitle.trim(), time: stopTime, category: stopCategory }
            : s
        ),
      }));
    } else {
      const newStop: StopItem = {
        id: `s-${Date.now()}`,
        time: stopTime,
        title: stopTitle.trim(),
        category: stopCategory,
        rating: '4.7★',
        reviews: 'New',
        cost: 'Free',
        image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400',
      };
      setStopsByDay((prev) => ({
        ...prev,
        [selectedDay]: [...(prev[selectedDay] || []), newStop],
      }));
    }
    setShowStopModal(false);
  };

  const handleDeleteStop = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStopsByDay((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((s) => s.id !== id),
    }));
    setShowStopModal(false);
  };

  const handleSendAgentMessage = () => {
    if (!agentInput.trim()) return;
    const userText = agentInput.trim();
    setChatMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setAgentInput('');

    setTimeout(() => {
      let reply = 'Kyoto flows very nicely on a solo trip! That afternoon matcha stop fits right between your temple walk and hotel check-in.';
      if (userText.toLowerCase().includes('crowd') || userText.toLowerCase().includes('busy')) {
        reply = 'Kiyomizu-dera gets packed past 10:00 AM. Visiting around 8:30 AM guarantees clearer walkways!';
      }
      setChatMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: reply }]);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.topBarTitle}>Solo Route Studio</Text>
          <Text style={styles.topBarSub}>Tailored for 1 Traveler</Text>
        </View>
        <View style={styles.soloBadge}>
          <Text style={styles.soloBadgeText}>SOLO</Text>
        </View>
      </View>

      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBanner}>
          <Text style={styles.heroSub}>KYOTO & OSAKA</Text>
          <Text style={styles.heroTitle}>Autonomous Exploration</Text>
          <Text style={styles.heroDates}>Oct 14 – Oct 20, 2026 • 7 Days</Text>
        </View>

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
          <View>
            <Text style={styles.sectionHeading}>DAY {selectedDay} STOPS</Text>
            <Text style={styles.sectionHint}>Drag cards up/down to swap • Tap pencil to edit</Text>
          </View>
          <TouchableOpacity style={styles.addStopBtn} onPress={handleOpenAdd}>
            <Ionicons name="add" size={14} color="#FFFFFF" />
            <Text style={styles.addStopBtnText}>Add Place</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Smooth Draggable Stops List */}
        <View style={styles.stopsList}>
          {currentStops.map((stop, index) => (
            <InteractiveDragCard
              key={stop.id}
              item={stop}
              index={index}
              totalItems={currentStops.length}
              onSwap={handleSwap}
              onEdit={() => handleOpenEdit(stop)}
              setScrollEnabled={setScrollEnabled}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.lockBtn}
          onPress={() => {
            Alert.alert('Save Itinerary?', 'Confirm and save this trip to your dashboard?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Confirm', onPress: () => router.replace('/itinerary-detail') },
            ]);
          }}
        >
          <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
          <Text style={styles.lockBtnText}>Confirm & Save Itinerary</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating AI Agent Button */}
      <TouchableOpacity
        style={styles.floatingAiButton}
        activeOpacity={0.85}
        onPress={() => setShowAiAgent(true)}
      >
        <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        <Text style={styles.floatingAiText}>Ask AI Copilot</Text>
      </TouchableOpacity>

      {/* Edit / Add Place Modal */}
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
              placeholder="e.g. 04:30 PM"
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

      {/* Expanded AI Agent Modal (75% Height) */}
      <Modal visible={showAiAgent} transparent animationType="slide" onRequestClose={() => setShowAiAgent(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={styles.agentSheetExpanded}>
            <View style={styles.sheetHandle} />
            <View style={styles.agentHeader}>
              <View style={styles.agentHeaderTitleRow}>
                <Ionicons name="sparkles" size={18} color="#0D9488" />
                <Text style={styles.agentHeaderTitle}>AI Route Copilot</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAiAgent(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.agentChatAreaExpanded} contentContainerStyle={{ gap: 10 }}>
              {chatMessages.map((m) => (
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
                value={agentInput}
                onChangeText={setAgentInput}
                placeholder="Ask about crowd levels, pacing, food..."
                placeholderTextColor="#9CA3AF"
                style={styles.agentInputField}
              />
              <TouchableOpacity style={styles.agentSendBtn} onPress={handleSendAgentMessage}>
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
// SMOOTH SWAP GESTURE CARD
// -------------------------------------------------------------
function InteractiveDragCard({
  item,
  index,
  totalItems,
  onSwap,
  onEdit,
  setScrollEnabled,
}: {
  item: StopItem;
  index: number;
  totalItems: number;
  onSwap: (from: number, to: number) => void;
  onEdit: () => void;
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

        // Calculate if we moved past half-card threshold
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
        <Image source={{ uri: item.image }} style={styles.stopImg} />
        <View style={styles.stopBody}>
          <View style={styles.stopTopLine}>
            <Text style={styles.stopTime}>{item.time}</Text>
            <Text style={styles.stopCategoryBadge}>{item.category}</Text>
          </View>
          <Text style={styles.stopTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.stopRating}>{item.rating} ({item.reviews} reviews)</Text>
        </View>

        <View style={styles.cardActionsRow}>
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
  soloBadge: { backgroundColor: '#E0E7FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  soloBadgeText: { fontSize: 10, fontWeight: '800', color: '#4338CA' },
  scrollContent: { padding: 16, paddingBottom: 170 },
  heroBanner: { backgroundColor: '#0F172A', borderRadius: 20, padding: 18, marginBottom: 14 },
  heroSub: { fontSize: 10, fontWeight: '800', color: '#2DD4BF', letterSpacing: 0.6 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  heroDates: { fontSize: 11, color: '#94A3B8', marginTop: 4 },
  dayScroll: { gap: 8, marginBottom: 16 },
  dayChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  dayChipActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  dayChipText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  dayChipTextActive: { color: '#FFFFFF' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5 },
  sectionHint: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  addStopBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0D9488', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  addStopBtnText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  stopsList: { gap: 8, marginBottom: 20 },
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
  stopImg: { width: 85, height: '100%' },
  stopBody: { padding: 12, flex: 1 },
  stopTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  stopTime: { fontSize: 10, fontWeight: '700', color: '#0D9488' },
  stopCategoryBadge: { fontSize: 9, color: '#6B7280', backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  stopTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginTop: 2 },
  stopRating: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    gap: 4,
  },
  iconActionBtn: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
  },
  dragIndicator: {
    padding: 4,
  },
  lockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0D9488',
    paddingVertical: 14,
    borderRadius: 16,
  },
  lockBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
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
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 34 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 14 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  circleCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginTop: 8, marginBottom: 5 },
  modalInput: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB' },
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